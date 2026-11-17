import { DatabaseSync } from 'node:sqlite';
import { createServer } from 'node:http';
import { mkdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes, scryptSync, timingSafeEqual, createHash } from 'node:crypto';

const hosted = process.env.RENDER === 'true';
const demo = process.argv.includes('--demo');
const publicOrigin = hosted ? new URL(process.env.RENDER_EXTERNAL_URL).origin : null;
const storagePath = process.env.FIXIT_DATA_DIR;
if (hosted && (demo || !storagePath || !publicOrigin.startsWith('https://'))) {
  throw new Error('Hosted FixIt requires an HTTPS origin and a persistent data directory.');
}
const directory = storagePath || fileURLToPath(new URL('./data/', import.meta.url));
if (!hosted) mkdirSync(directory, { recursive: true });
const db = new DatabaseSync(resolve(directory, 'fixit.sqlite'));
db.exec(`
  PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL, role TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS profiles (
    id INTEGER PRIMARY KEY REFERENCES users(id), category TEXT NOT NULL,
    district TEXT NOT NULL, bio TEXT NOT NULL, visible INTEGER NOT NULL DEFAULT 1,
    sample INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id),
    expires INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY, customer_id INTEGER NOT NULL REFERENCES users(id),
    pro_id INTEGER NOT NULL REFERENCES profiles(id), category TEXT NOT NULL,
    district TEXT NOT NULL, title TEXT NOT NULL, details TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open', created TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS quotes (
    job_id INTEGER PRIMARY KEY REFERENCES jobs(id), amount INTEGER NOT NULL,
    note TEXT NOT NULL
  );
`);

if (!db.prepare('PRAGMA table_info(profiles)').all().some(column => column.name === 'phone')) {
  db.exec('ALTER TABLE profiles ADD COLUMN phone TEXT');
}

const categories = ['plumbing', 'electrical', 'painting', 'cleaning', 'carpentry', 'appliances'];
const districts = ['Gasabo', 'Kicukiro', 'Nyarugenge'];
const select = (sql, ...params) => db.prepare(sql).all(...params);
const one = (sql, ...params) => db.prepare(sql).get(...params);
const run = (sql, ...params) => db.prepare(sql).run(...params);
function transaction(operation) {
  db.exec('BEGIN IMMEDIATE');
  try {
    const result = operation();
    db.exec('COMMIT');
    return result;
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}
function passwordHash(password, salt = randomBytes(16).toString('hex')) {
  return salt + ':' + scryptSync(password, salt, 64).toString('hex');
}
function matches(password, saved) {
  const salt = saved.split(':')[0];
  return timingSafeEqual(Buffer.from(saved), Buffer.from(passwordHash(password, salt)));
}
const cookieAttributes = '; Path=/; HttpOnly; SameSite=Strict' + (hosted ? '; Secure' : '');
const tokenHash = token => createHash('sha256').update(token).digest('hex');
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
function contactPhone(value) {
  if (value === undefined || value === '') return null;
  if (typeof value !== 'string' || value.length > 30) fail(400, 'invalidPhone');
  const text = value.trim();
  if (!text) return null;
  const normalized = text.replace(/[\s().-]/g, '');
  if (!/^\+?[0-9]{7,15}$/.test(normalized)) fail(400, 'invalidPhone');
  return normalized;
}
function profileFields(body) {
  if (!categories.includes(body.category) || !districts.includes(body.district)) fail(400, 'invalid');
  return [body.category, body.district, field(body, 'bio', 10, 500)];
}
function addUser(name, email, password, role) {
  return Number(run('INSERT INTO users(name,email,password,role) VALUES (?,?,?,?)',
    name, email, passwordHash(password), role).lastInsertRowid);
}
function startSession(res, id, oldToken) {
  if (oldToken) run('DELETE FROM sessions WHERE token=?', tokenHash(oldToken));
  run('DELETE FROM sessions WHERE expires<=?', Date.now());
  const token = randomBytes(32).toString('hex');
  run('INSERT INTO sessions VALUES (?,?,?)', tokenHash(token), id, Date.now() + 604800000);
  res.setHeader('Set-Cookie', 'fixit=' + token + cookieAttributes + '; Max-Age=604800');
}
async function readBody(req) {
  if (req.headers['content-type']?.split(';')[0] !== 'application/json') fail(415, 'invalid');
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 8192) fail(413, 'invalid');
    chunks.push(chunk);
  }
  try {
    const value = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if (!value || typeof value !== 'object' || Array.isArray(value)) fail(400, 'invalid');
    return value;
  } catch {
    fail(400, 'invalid');
  }
}

if (hosted) {
  transaction(() => {
    if (one("SELECT id FROM users WHERE role='admin'")) return;
    const { email, password } = credentials({
      email: process.env.FIXIT_ADMIN_EMAIL, password: process.env.FIXIT_ADMIN_PASSWORD
    });
    if (password.length < 16) throw new Error('Set an admin password of at least 16 characters.');
    addUser('FixIt Admin', email, password, 'admin');
  });
}

if (demo) {
  transaction(() => {
    const samples = [
      ['Mugisha Home Plumbing', 'plumbing', 'Gasabo'],
      ['Ishimwe Electrical', 'electrical', 'Kicukiro'],
      ['Keza Painting Studio', 'painting', 'Nyarugenge'],
      ['Isuku Home Cleaning', 'cleaning', 'Gasabo'],
      ['Imena Carpentry', 'carpentry', 'Kicukiro'],
      ['Urumuri Appliance Repair', 'appliances', 'Nyarugenge']
    ];
    for (const [name, category, district] of samples) {
      const email = category + '@example.test';
      if (one('SELECT id FROM users WHERE email=?', email)) continue;
      const id = addUser(name, email, 'FixIt-Demo-24', 'pro');
      run('INSERT INTO profiles(id,category,district,bio,visible,sample) VALUES (?,?,?,?,1,1)', id, category, district,
        'Sample profile for practicing the quote workflow.');
    }
    for (const [name, email, role] of [
      ['Uwase', 'customer@example.test', 'customer'],
      ['FixIt Admin', 'admin@example.test', 'admin']
    ]) {
      if (!one('SELECT id FROM users WHERE email=?', email)) addUser(name, email, 'FixIt-Demo-24', role);
    }
  });
}

const profileFieldsSql = 'p.id, p.category, p.district, p.bio, p.visible, p.sample, u.name';
const profileSource = ' FROM profiles p JOIN users u ON u.id=p.id';
const profileQuery = 'SELECT ' + profileFieldsSql + profileSource;
const adminProfileQuery = 'SELECT ' + profileFieldsSql + ', p.phone' + profileSource;
const jobQuery = `SELECT j.*, customer.name AS customer, pro.name AS professional,
  q.amount, q.note FROM jobs j JOIN users customer ON customer.id=j.customer_id
  JOIN users pro ON pro.id=j.pro_id LEFT JOIN quotes q ON q.job_id=j.id`;

async function api(req, res, url) {
  const token = req.headers.cookie?.match(/(?:^|;\s*)fixit=([a-f0-9]{64})(?:;|$)/)?.[1];
  const user = token && one(`SELECT u.id,u.name,u.role FROM users u JOIN sessions s
    ON s.user_id=u.id WHERE s.token=? AND s.expires>? AND u.role<>'archived'`, tokenHash(token), Date.now());
  function requireRole(role) {
    if (!user) fail(401, 'loginNeeded');
    if (role && user.role !== role) fail(403, 'forbidden');
  }
  const route = req.method + ' ' + url.pathname;
  if (route === 'GET /api/me') return { user: user || null };
  if (route === 'GET /api/profiles') {
    return select(profileQuery + " WHERE p.visible=1 AND u.role='pro' ORDER BY p.sample, u.name");
  }
  if (req.method === 'POST' && req.headers.origin &&
      req.headers.origin !== (publicOrigin || 'http://' + req.headers.host)) fail(403, 'forbidden');
  if (route === 'POST /api/register' || route === 'POST /api/admin/professionals') {
    const managed = route === 'POST /api/admin/professionals';
    if (managed) requireRole('admin');
    const body = await readBody(req);
    const { email, password } = credentials(body);
    const name = field(body, 'name', 2, 80);
    const role = managed ? 'pro' : body.role;
    if (!['customer', 'pro'].includes(role)) fail(400, 'invalid');
    const profile = role === 'pro' ? profileFields(body) : null;
    const phone = managed ? contactPhone(body.phone) : null;
    const id = transaction(() => {
      if (one('SELECT id FROM users WHERE email=?', email)) fail(409, 'emailTaken');
      const id = addUser(name, email, password, role);
      if (profile) run('INSERT INTO profiles(id,category,district,bio,phone) VALUES (?,?,?,?,?)', id, ...profile, phone);
      return id;
    });
    if (managed) return {};
    startSession(res, id, token);
    return { user: { id, name, role } };
  }
  if (route === 'POST /api/login') {
    const { email, password } = credentials(await readBody(req));
    const account = one('SELECT * FROM users WHERE email=?', email);
    if (!account || account.role === 'archived' || !matches(password, account.password)) fail(401, 'badLogin');
    startSession(res, account.id, token);
    return { user: { id: account.id, name: account.name, role: account.role } };
  }
  if (route === 'POST /api/logout') {
    if (token) run('DELETE FROM sessions WHERE token=?', tokenHash(token));
    res.setHeader('Set-Cookie', 'fixit=' + cookieAttributes + '; Max-Age=0');
    return {};
  }
  if (route === 'GET /api/dashboard') {
    requireRole();
    if (user.role === 'admin') return {
      profiles: select(adminProfileQuery + " WHERE u.role='pro' ORDER BY u.name"),
      jobs: select(jobQuery + ' ORDER BY j.id DESC'),
      accounts: select("SELECT role, COUNT(*) AS total FROM users WHERE role<>'archived' GROUP BY role")
    };
    const column = user.role === 'pro' ? 'pro_id' : 'customer_id';
    return {
      jobs: select(jobQuery + ' WHERE j.' + column + '=? ORDER BY j.id DESC', user.id),
      profile: user.role === 'pro' ? one(profileQuery + ' WHERE p.id=?', user.id) : null
    };
  }
  if (route === 'POST /api/profile') {
    requireRole('pro');
    const fields = profileFields(await readBody(req));
    run('UPDATE profiles SET category=?,district=?,bio=? WHERE id=?', ...fields, user.id);
    return {};
  }
  if (route === 'POST /api/jobs') {
    requireRole('customer');
    const body = await readBody(req);
    const title = field(body, 'title', 4, 100);
    const details = field(body, 'details', 10, 1000);
    const pro = one("SELECT p.* FROM profiles p JOIN users u ON u.id=p.id WHERE p.id=? AND p.visible=1 AND u.role='pro'", Number(body.proId));
    if (!pro) fail(404, 'missing');
    run('INSERT INTO jobs(customer_id,pro_id,category,district,title,details) VALUES (?,?,?,?,?,?)',
      user.id, pro.id, pro.category, pro.district, title, details);
    return {};
  }
  if (route === 'POST /api/quote') {
    requireRole('pro');
    const body = await readBody(req);
    const amount = Number(body.amount);
    if (!Number.isInteger(amount) || amount < 1 || amount > 100000000) fail(400, 'invalid');
    const note = field(body, 'note', 4, 500);
    transaction(() => {
      const job = one('SELECT * FROM jobs WHERE id=? AND pro_id=?', Number(body.jobId), user.id);
      if (!job) fail(404, 'missing');
      if (job.status !== 'open') fail(409, 'closed');
      run('INSERT INTO quotes VALUES (?,?,?)', job.id, amount, note);
      run("UPDATE jobs SET status='quoted' WHERE id=?", job.id);
    });
    return {};
  }
  if (route === 'POST /api/accept') {
    requireRole('customer');
    const body = await readBody(req);
    const result = run("UPDATE jobs SET status='accepted' WHERE id=? AND customer_id=? AND status='quoted'",
      Number(body.jobId), user.id);
    if (!result.changes) fail(409, 'closed');
    return {};
  }
  if (route === 'POST /api/admin/delete-professional') {
    requireRole('admin');
    const id = Number((await readBody(req)).id);
    if (!Number.isSafeInteger(id) || id < 1) fail(400, 'invalid');
    transaction(() => {
      const result = run("UPDATE users SET role='archived', password='' WHERE id=? AND role='pro'", id);
      if (!result.changes) fail(404, 'missing');
      run('DELETE FROM sessions WHERE user_id=?', id);
    });
    return {};
  }
  if (route === 'POST /api/moderate') {
    requireRole('admin');
    const body = await readBody(req);
    if (typeof body.visible !== 'boolean') fail(400, 'invalid');
    if (!run("UPDATE profiles SET visible=? WHERE id=? AND id IN (SELECT id FROM users WHERE role='pro')", Number(body.visible), Number(body.id)).changes) {
      fail(404, 'missing');
    }
    return {};
  }
  fail(404, 'missing');
}

const assets = { '/': ['index.html', 'text/html'], '/styles.css': ['styles.css', 'text/css'],
  '/app.js': ['app.js', 'text/javascript'] };
const port = Number((hosted ? process.env.PORT : process.env.FIXIT_PORT) || 3000);
createServer(async (req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store');
  try {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname.startsWith('/api/')) {
      const result = await api(req, res, url);
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify(result));
      return;
    }
    const asset = assets[url.pathname];
    if (!Object.hasOwn(assets, url.pathname) || req.method !== 'GET') fail(404, 'missing');
    res.setHeader('Content-Type', asset[1] + '; charset=utf-8');
    res.end(readFileSync(new URL('./public/' + asset[0], import.meta.url)));
  } catch (error) {
    if (!error.status) console.error(error);
    res.writeHead(error.status || 500, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: error.code && error.status ? error.code : 'unexpected' }));
  }
}).listen(port, hosted ? '0.0.0.0' : '127.0.0.1', () => {
  console.log('FixIt Rwanda: ' + (publicOrigin || 'http://127.0.0.1:' + port));
});
