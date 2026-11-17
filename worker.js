const encoder = new TextEncoder();
const cookieAttributes = '; Path=/; HttpOnly; SameSite=Strict; Secure';
const hex = bytes => Array.from(new Uint8Array(bytes), byte => byte.toString(16).padStart(2,'0')).join('');
const random = size => hex(crypto.getRandomValues(new Uint8Array(size)));
const tokenHash = async token => hex(await crypto.subtle.digest('SHA-256',encoder.encode(token)));

async function passwordHash(password,salt = random(16)) {
  const key = await crypto.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveBits']);
  const bits = await crypto.subtle.deriveBits({
    name:'PBKDF2', hash:'SHA-256', salt:encoder.encode(salt), iterations:100000
  },key,256);
  return salt + ':' + hex(bits);
}
async function matches(password,saved) {
  const candidate = await passwordHash(password,saved.split(':')[0]);
  let difference = candidate.length ^ saved.length;
  for (let i = 0; i < saved.length; i++) difference |= candidate.charCodeAt(i) ^ saved.charCodeAt(i);
  return difference === 0;
}
function idField(value) {
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id < 1) fail(400,'invalid');
  return id;
}
async function readBody(req) {
  if (req.headers.get('Content-Type')?.split(';')[0] !== 'application/json') fail(415,'invalid');
  let size = 0;
  let raw = '';
  const decoder = new TextDecoder();
  for await (const chunk of req.body || []) {
    size += chunk.byteLength;
    if (size > 8192) fail(413,'invalid');
    raw += decoder.decode(chunk,{stream:true});
  }
  try {
    const body = JSON.parse(raw + decoder.decode());
    if (body && typeof body === 'object' && !Array.isArray(body)) return body;
  } catch {
    fail(400,'invalid');
  }
  fail(400,'invalid');
}

const categories = ['plumbing', 'electrical', 'painting', 'cleaning', 'carpentry', 'appliances'];
const districts = ['Gasabo', 'Kicukiro', 'Nyarugenge'];
function fail(status, code) {
  throw Object.assign(new Error(code), { status, code });
}
function field(body, key, min, max) {
  const value = typeof body[key] === 'string' ? body[key].trim() : '';
  if (value.length < min || value.length > max) fail(400, 'invalid');
  return value;
}
function credentials(body) {
  const email = field(body, 'email', 3, 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail(400, 'invalid');
  if (typeof body.password !== 'string' || body.password.length < 8 || body.password.length > 128) {
    fail(400, 'invalid');
  }
  return { email, password: body.password };
}
function profileFields(body) {
  if (!categories.includes(body.category) || !districts.includes(body.district)) fail(400, 'invalid');
  return [body.category, body.district, field(body, 'bio', 10, 500)];
}
const profileQuery = 'SELECT p.*, u.name FROM profiles p JOIN users u ON u.id=p.id';
const jobQuery = `SELECT j.*, customer.name AS customer, pro.name AS professional,
  q.amount, q.note FROM jobs j JOIN users customer ON customer.id=j.customer_id
  JOIN users pro ON pro.id=j.pro_id LEFT JOIN quotes q ON q.job_id=j.id`;


async function api(req, headers, url, env) {
  const db = env.DB;
  const stmt = (sql,...params) => db.prepare(sql).bind(...params);
  const one = (sql,...params) => stmt(sql,...params).first();
  const select = async (sql,...params) => (await stmt(sql,...params).all()).results;
  const run = async (sql,...params) => (await stmt(sql,...params).run()).meta;
  const token = req.headers.get('Cookie')?.match(/(?:^|;\s*)fixit=([a-f0-9]{64})(?:;|$)/)?.[1];
  const user = token && await one(`SELECT u.id,u.name,u.role FROM users u JOIN sessions s
    ON s.user_id=u.id WHERE s.token=? AND s.expires>?`, await tokenHash(token),Date.now());
  async function limit(key) {
    if (!(await env.AUTH_LIMIT.limit({key})).success) fail(429,'tryLater');
  }
  if (req.method === 'POST' && ['/api/login','/api/register'].includes(url.pathname)) {
    await limit('ip:' + (req.headers.get('CF-Connecting-IP') || 'unknown'));
  }
  async function startSession(id) {
    const fresh = random(32);
    const now = Date.now();
    const statements = [
      stmt('DELETE FROM sessions WHERE expires<=?',now),
      stmt('INSERT INTO sessions VALUES (?,?,?)',await tokenHash(fresh),id,now + 604800000)
    ];
    if (token) statements.unshift(stmt('DELETE FROM sessions WHERE token=?',await tokenHash(token)));
    await db.batch(statements);
    headers.set('Set-Cookie','fixit=' + fresh + cookieAttributes + '; Max-Age=604800');
  }
  function requireRole(role) {
    if (!user) fail(401, 'loginNeeded');
    if (role && user.role !== role) fail(403, 'forbidden');
  }
  const route = req.method + ' ' + url.pathname;
  if (route === 'GET /api/me') return { user: user || null };
  if (route === 'GET /api/profiles') {
    return await select(profileQuery + ' WHERE p.visible=1 ORDER BY p.sample, u.name');
  }
  if (req.method === 'POST' && req.headers.get('Origin') !== url.origin) fail(403, 'forbidden');
  if (route === 'POST /api/register') {
    const body = await readBody(req);
    const { email, password } = credentials(body);
    const name = field(body, 'name', 2, 80);
    const { role } = body;
    if (!['customer', 'pro'].includes(role)) fail(400, 'invalid');
    const profile = role === 'pro' ? profileFields(body) : null;
    const hash = await passwordHash(password);
    const statements = [stmt(
      'INSERT INTO users(name,email,password,role) VALUES (?,?,?,?) ON CONFLICT(email) DO NOTHING',
      name,email,hash,role
    )];
    if (profile) statements.push(stmt(
      'INSERT INTO profiles(id,category,district,bio) SELECT id,?,?,? FROM users WHERE email=? AND password=?',
      ...profile, email, hash
    ));
    const [created] = await db.batch(statements);
    if (!created.meta.changes) fail(409,'emailTaken');
    const id = created.meta.last_row_id;
    await startSession(id);
    return { user: { id, name, role } };
  }
  if (route === 'POST /api/login') {
    const { email, password } = credentials(await readBody(req));
    await limit('login:' + email);
    const account = await one('SELECT * FROM users WHERE email=?', email);
    if (!account || !(await matches(password, account.password))) fail(401, 'badLogin');
    await startSession(account.id);
    return { user: { id: account.id, name: account.name, role: account.role } };
  }
  if (route === 'POST /api/logout') {
    if (token) await run('DELETE FROM sessions WHERE token=?', await tokenHash(token));
    headers.set('Set-Cookie', 'fixit=' + cookieAttributes + '; Max-Age=0');
    return {};
  }
  if (route === 'GET /api/dashboard') {
    requireRole();
    if (user.role === 'admin') return {
      profiles: await select(profileQuery + ' ORDER BY u.name'),
      jobs: await select(jobQuery + ' ORDER BY j.id DESC'),
      accounts: await select('SELECT role, COUNT(*) AS total FROM users GROUP BY role')
    };
    const column = user.role === 'pro' ? 'pro_id' : 'customer_id';
    return {
      jobs: await select(jobQuery + ' WHERE j.' + column + '=? ORDER BY j.id DESC', user.id),
      profile: user.role === 'pro' ? await one(profileQuery + ' WHERE p.id=?', user.id) : null
    };
  }
  if (route === 'POST /api/profile') {
    requireRole('pro');
    const fields = profileFields(await readBody(req));
    await run('UPDATE profiles SET category=?,district=?,bio=? WHERE id=?', ...fields, user.id);
    return {};
  }
  if (route === 'POST /api/jobs') {
    requireRole('customer');
    const body = await readBody(req);
    const title = field(body, 'title', 4, 100);
    const details = field(body, 'details', 10, 1000);
    const created = await run(
      'INSERT INTO jobs(customer_id,pro_id,category,district,title,details) ' +
      'SELECT ?,id,category,district,?,? FROM profiles WHERE id=? AND visible=1',
      user.id,title,details,idField(body.proId)
    );
    if (!created.changes) fail(404,'missing');
    return {};
  }
  if (route === 'POST /api/quote') {
    requireRole('pro');
    const body = await readBody(req);
    const amount = Number(body.amount);
    if (!Number.isInteger(amount) || amount < 1 || amount > 100000000) fail(400, 'invalid');
    const note = field(body, 'note', 4, 500);
    const jobId = idField(body.jobId);
    const created = await run(
      "INSERT INTO quotes(job_id,amount,note) SELECT id,?,? FROM jobs WHERE id=? AND pro_id=? AND status='open'",
      amount,note,jobId,user.id
    );
    if (!created.changes) {
      const job = await one('SELECT id FROM jobs WHERE id=? AND pro_id=?',jobId,user.id);
      fail(job ? 409 : 404, job ? 'closed' : 'missing');
    }
    return {};
  }
  if (route === 'POST /api/accept') {
    requireRole('customer');
    const body = await readBody(req);
    const result = await run("UPDATE jobs SET status='accepted' WHERE id=? AND customer_id=? AND status='quoted'",
      idField(body.jobId), user.id);
    if (!result.changes) fail(409, 'closed');
    return {};
  }
  if (route === 'POST /api/moderate') {
    requireRole('admin');
    const body = await readBody(req);
    if (typeof body.visible !== 'boolean') fail(400, 'invalid');
    if (!(await run('UPDATE profiles SET visible=? WHERE id=?', Number(body.visible), idField(body.id))).changes) {
      fail(404, 'missing');
    }
    return {};
  }
  fail(404, 'missing');
}

export default {
  async fetch(req,env) {
    const url = new URL(req.url);
    if (!url.pathname.startsWith('/api/')) return new Response('Not found',{status:404});
    const headers = new Headers({
      'Cache-Control':'no-store',
      'X-Content-Type-Options':'nosniff'
    });
    try {
      return Response.json(await api(req,headers,url,env),{headers});
    } catch (error) {
      if (!error.status) console.error('FixIt request failed',error.message);
      return Response.json({error:error.status ? error.code : 'unexpected'},
        {status:error.status || 500,headers});
    }
  }
};
