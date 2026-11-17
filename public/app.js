import { serviceGroups, serviceNames } from './services.js';

const copy = {
  en: {
    rights:'All rights reserved.', browse:'Find a pro', signIn:'Sign in', join:'Create account', logout:'Sign out', dashboard:'Dashboard',
    location:'Kigali, Rwanda', hero:'Good work starts', heroEnd:'close to home.', intro:'Find a local professional for repairs, maintenance, and projects around your home.',
    service:'Service', district:'District', allServices:'All services', allDistricts:'All districts',
    categories:'Explore services', results:'Local professionals', found:'Profiles found', empty:'No professionals match your search.',
    sample:'Demo profile', sampleBio:'Sample profile for practicing the quote workflow.', profile:'View profile', details:'Describe the work',
    request:'Request a quote', title:'Job title', guestName:'Your full name', optionalEmail:'Email (optional)',
    guestNotice:'Your contact information and job details will be shared with this professional so they can reply directly.',
    requestReceived:'Request received. The professional can contact you directly about your quote.',
    guestRequests:'Requests from guests', emailAlert:'Email alert', smsAlert:'SMS alert',
    smsOptIn:'Text me when a customer requests a quote', smsMobile:'Enter a Rwanda mobile number to receive text alerts.',
    pending:'Pending', acceptedAlert:'Accepted by provider', unconfigured:'Not configured',
    disabled:'Disabled', failed:'Failed', unknown:'Unknown',
    back:'Back to search', name:'Full name or business name', email:'Email', password:'Password (at least 8 characters)',
    role:'Account type', customer:'Customer', pro:'Professional', admin:'Administrator', bio:'About your services',
    save:'Save profile', jobs:'Job requests', noJobs:'There are no job requests yet.', opened:'Awaiting quote', quoted:'Quote sent',
    accepted:'Quote accepted', quote:'Send quote', amount:'Price in RWF', note:'What does your quote include?', accept:'Accept quote',
    adminTitle:'Admin dashboard', accounts:'Accounts', profiles:'Professional profiles', hide:'Hide profile', show:'Show profile',
    visible:'Visible', hidden:'Hidden', local:'Home services in Kigali', missing:'This item is unavailable.',
    badLogin:'Check your email and password.', emailTaken:'An account already uses that email.', invalid:'Check the form fields and try again.',
    forbidden:'Your account cannot perform this action.', loginNeeded:'Sign in to continue.', closed:'This request is no longer available for that action.',
    tryLater:'Too many attempts. Wait a minute and try again.', unexpected:'Something went wrong. Try again.', saved:'Saved.', signupHint:'Choose how you’ll use FixIt Rwanda.',
    explore:'Explore', phone:'Phone number', invalidPhone:'Enter a valid phone number with 7 to 15 digits.',
    addPro:'Add professional', deletePro:'Delete professional', proPassword:'Initial password (at least 8 characters)',
    confirmDeletePro:'Delete this professional? Their listing and sign-in will be removed. Existing jobs and quotes will stay in your records.',
    registerPro:'Join as a professional', mine:'My requests', received:'Incoming requests', loading:'Loading…'
  },
  rw: {
    rights:'Uburenganzira bwose burabitswe.', browse:'Shaka umunyamwuga', signIn:'Injira', join:'Fungura konti', logout:'Sohoka', dashboard:'Imbonerahamwe',
    location:'Kigali, u Rwanda', hero:'Serivisi nziza ziboneka', heroEnd:'hafi yawe.', intro:'Shaka umunyamwuga uri hafi yawe wakora imirimo yo gusana, kubungabunga no gutunganya urugo.',
    service:'Serivisi', district:'Akarere', allServices:'Serivisi zose', allDistricts:'Uturere twose',
    categories:'Reba serivisi', results:'Abanyamwuga bo hafi yawe', found:'Abanyamwuga babonetse', empty:'Nta munyamwuga uhuye n’ibyo washakishije.',
    sample:'Umwirondoro w’igerageza', sampleBio:'Umwirondoro w’igerageza wo kwitoza gusaba no gutanga igiciro.', profile:'Reba umwirondoro', details:'Sobanura akazi',
    request:'Saba igiciro', title:'Izina ry’akazi', guestName:'Amazina yawe yose', optionalEmail:'Imeyili (si ngombwa)',
    guestNotice:'Amakuru yo kukuvugisha n’ibisobanuro by’akazi bizahabwa uyu munyamwuga kugira ngo akuvugishe.',
    requestReceived:'Ubusabe bwakiriwe. Umunyamwuga ashobora kukuvugisha akakubwira igiciro.',
    guestRequests:'Ubusabe bw’abakiriya badafite konti', emailAlert:'Imenyesha kuri imeyili', smsAlert:'Imenyesha kuri SMS',
    smsOptIn:'Nyohereza SMS igihe umukiriya asabye igiciro', smsMobile:'Andika nimero ya telefoni igendanwa yo mu Rwanda kugira ngo wakire SMS.',
    pending:'Birategereje', acceptedAlert:'Byakiriwe n’utanga serivisi', unconfigured:'Ntibirashyirwaho',
    disabled:'Birazimye', failed:'Byanze', unknown:'Ntibizwi',
    back:'Subira mu ishakisha', name:'Amazina yawe cyangwa izina ry’ubucuruzi', email:'Imeyili', password:'Ijambobanga (inyuguti nibura 8)',
    role:'Ubwoko bwa konti', customer:'Umukiriya', pro:'Umunyamwuga', admin:'Umuyobozi', bio:'Sobanura serivisi utanga',
    save:'Bika umwirondoro', jobs:'Ubusabe bw’akazi', noJobs:'Nta busabe bw’akazi buraboneka.', opened:'Bitegereje igiciro', quoted:'Igiciro cyoherejwe',
    accepted:'Igiciro cyemewe', quote:'Ohereza igiciro', amount:'Igiciro mu mafaranga y’u Rwanda', note:'Igiciro gikubiyemo iki?', accept:'Emera igiciro',
    adminTitle:'Imbonerahamwe y’umuyobozi', accounts:'Konti', profiles:'Imyirondoro y’abanyamwuga', hide:'Hisha umwirondoro', show:'Erekana umwirondoro',
    visible:'Uraboneka', hidden:'Urahishwe', local:'Serivisi zo mu rugo i Kigali', missing:'Ibyo ushaka ntibiboneka.',
    badLogin:'Reba niba imeyili n’ijambobanga ari byo.', emailTaken:'Iyo meyili isanzwe ikoreshwa.', invalid:'Reba ibyo wujuje wongere ugerageze.',
    forbidden:'Konti yawe ntiyemerewe gukora iki gikorwa.', loginNeeded:'Injira kugira ngo ukomeze.', closed:'Iki gikorwa ntigishoboka kuri ubu busabe.',
    tryLater:'Wagerageje inshuro nyinshi. Tegereza umunota umwe wongere ugerageze.', unexpected:'Habaye ikibazo. Ongera ugerageze.', saved:'Byabitswe.', signupHint:'Hitamo uko uzakoresha FixIt Rwanda.',
    explore:'Reba serivisi', phone:'Nimero ya telefoni', invalidPhone:'Andika nimero ya telefoni igizwe n’imibare 7 kugeza kuri 15.',
    addPro:'Ongeramo umunyamwuga', deletePro:'Siba umunyamwuga', proPassword:'Ijambobanga ry’ibanze (inyuguti nibura 8)',
    confirmDeletePro:'Urashaka gusiba uyu munyamwuga? Umwirondoro we uzavanwa ku rubuga kandi ntazongera kwinjira. Ubusabe n’ibiciro bizaguma mu nyandiko.',
    registerPro:'Iyandikishe nk’umunyamwuga', mine:'Ubusabe bwanjye', received:'Ubusabe nakiriye', loading:'Tegereza…'
  }
};
const featuredServices = { plumbing:'◉', electrical:'ϟ', painting:'▧', cleaning:'✧', carpentry:'◇', appliances:'▣' };
const districts = ['Gasabo','Kicukiro','Nyarugenge'];
let language = localStorage.getItem('fixit-language') === 'rw' ? 'rw' : 'en';
let user = null;
let filter = { category:'', district:'' };
let viewVersion = 0;
let message = '';
const main = document.querySelector('main');
const nav = document.querySelector('nav');
const t = key => copy[language][key] || serviceNames.get(key)?.[language] || key;
const escaped = { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' };
const e = value => String(value ?? '').replace(/[&<>"']/g, character => escaped[character]);
const label = (key, control) => '<label>' + t(key) + control + '</label>';
const link = (to, key, style = '') => '<a class="' + style + '" href="#' + to + '">' + t(key) + '</a>';
const button = (key, style = '') => '<button class="button ' + style + '">' + t(key) + '</button>';
const status = job => t(job.status === 'open' ? 'opened' : job.status);
const money = amount => new Intl.NumberFormat(language === 'rw' ? 'rw-RW' : 'en-RW').format(amount) + ' RWF';
const profileName = p => e(p.name);
const bio = p => p.sample && p.bio === 'Sample profile for practicing the quote workflow.' ? t('sampleBio') : e(p.bio);

async function api(path, data) {
  const response = await fetch('/api/' + path, data === undefined ? {} : {
    method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error);
  return result;
}
function page(title, contents, narrow = false) {
  return '<section class="wrap page ' + (narrow ? 'narrow' : '') + '"><h1 tabindex="-1">' +
    t(title) + '</h1>' + contents + '</section>';
}
function options(values, selected, first, translate = false) {
  const placeholder = first ? '<option value="">' + t(first) + '</option>' : '';
  return placeholder + values.map(value => '<option value="' + value + '"' +
    (value === selected ? ' selected' : '') + '>' + (translate ? t(value) : value) + '</option>').join('');
}
function selector(name, values, value, empty, translate) {
  return '<select name="' + name + '">' + options(values,value,empty,translate) + '</select>';
}
function field(name, type, min, max) {
  return '<input required name="' + name + '" type="' + type + '" minlength="' + min + '" maxlength="' + max + '">';
}
function textArea(name, min, max, value = '') {
  return '<textarea required name="' + name + '" minlength="' + min + '" maxlength="' + max + '">' + e(value) + '</textarea>';
}
const feedback = '<p class="feedback" role="alert"></p>';
function form(action, fields, submit, extra = '') {
  return '<form class="form" data-action="' + action + '" ' + extra + '>' + fields + feedback + button(submit) + '</form>';
}
function serviceSelector(selected, first) {
  const groups = serviceGroups.map(([en, rw, services]) =>
    '<optgroup label="' + e(language === 'rw' ? rw : en) + '">' +
    options(services.map(([id]) => id), selected, null, true) + '</optgroup>'
  ).join('');
  return '<select name="category">' + options([], selected, first) + groups + '</select>';
}
function phoneField(value = '') {
  return label('phone','<input type="tel" required name="phone" autocomplete="tel" maxlength="30" value="' +
    e(value) + '">');
}
function profileFields(p = {}) {
  return label('service',serviceSelector(p.category || 'plumbing')) +
    label('district',selector('district',districts,p.district)) +
    label('bio',textArea('bio',10,500,p.bio));
}
function profileLine(p) {
  return '<div class="card-top"><span class="avatar" aria-hidden="true">' + e(p.name.slice(0,1).toUpperCase()) +
    '</span><div><h3>' + profileName(p) + '</h3><small>' + t(p.category) + ' · ' + e(p.district) + '</small></div></div>';
}
function cards(profiles) {
  if (!profiles.length) return '<p class="muted">' + t('empty') + '</p>';
  return '<div class="cards">' + profiles.map(p => '<article class="card">' + profileLine(p) +
    (p.sample ? '<small class="tag">' + t('sample') + '</small>' : '') +
    link('pro/' + p.id,'profile','button quiet profile-link') + '</article>').join('') + '</div>';
}
function filtered(profiles) {
  return profiles.filter(p => (!filter.category || p.category === filter.category) &&
    (!filter.district || p.district === filter.district));
}
function updateResults(profiles) {
  const list = filtered(profiles);
  document.querySelector('#professionals').textContent =
    filter.category ? t(filter.category) : t('results');
  document.querySelector('#matches').textContent = t('found') + ' · ' + list.length;
  document.querySelector('#results').innerHTML = cards(list);
  for (const tile of document.querySelectorAll('[data-category]')) {
    tile.setAttribute('aria-pressed', String(tile.dataset.category === filter.category));
  }
}
function home(profiles) {
  main.innerHTML = '<section class="hero"><div class="wrap hero-inner"><div class="hero-art" aria-hidden="true"><span>✦</span></div>' +
    '<div class="hero-copy"><span class="location">' + t('location') + '</span><h1>' + t('hero') + '<br><em>' + t('heroEnd') +
    '</em></h1><p>' + t('intro') + '</p></div><form class="search" id="search">' +
    label('service',serviceSelector(filter.category,'allServices')) +
    label('district',selector('district',districts,filter.district,'allDistricts')) + button('browse','bright') +
    '</form></div></section><section class="wrap section"><div class="heading"><h2>' + t('categories') +
    '</h2><button type="button" class="button quiet" id="all-services">' + t('allServices') +
    '</button></div><div class="tiles">' + Object.entries(featuredServices).map(([key, icon]) =>
      '<button class="tile" type="button" data-category="' + key + '"><span class="tile-icon" aria-hidden="true">' +
      icon + '</span>' + t(key) + '</button>').join('') +
    '</div></section><section class="wrap section"><div class="heading"><h2 id="professionals" tabindex="-1">' +
    t('results') + '</h2><small id="matches" role="status"></small></div><div id="results"></div></section>';
  updateResults(profiles);
  document.querySelector('#all-services').onclick = () => {
    window.scrollTo(0,0);
    const menu = nav.querySelector('.explore');
    menu.open = true;
    menu.querySelector('summary').focus();
  };
  const search = document.querySelector('#search');
  function apply() {
    filter = Object.fromEntries(new FormData(search));
    history.replaceState(null, '', filter.category ? '#service/' + filter.category : '#home');
    updateResults(profiles);
    document.querySelector('#professionals').focus();
  }
  search.onsubmit = event => { event.preventDefault(); apply(); };
  for (const tile of document.querySelectorAll('[data-category]')) {
    tile.onclick = () => {
      search.elements.category.value = filter.category === tile.dataset.category ? '' : tile.dataset.category;
      apply();
    };
  }
}
function auth(register, proSignup) {
  const mode = register ? 'register' : 'login';
  const fields = (register ? label('name',field('name','text',2,80)) : '') +
    label('email',field('email','email',3,254)) + label('password',field('password','password',8,128)) +
    (register ? label('role',selector('role',['customer','pro'],proSignup ? 'pro' : 'customer',null,true)) +
      '<div class="form" id="pro-fields">' + phoneField() + profileFields() + '</div>' : '');
  main.innerHTML = page(register ? 'join' : 'signIn', '<div class="panel stack">' +
    (register ? '<p>' + t('signupHint') + '</p>' : '') +
    form(mode,fields,register ? 'join' : 'signIn') +
    link(register ? 'login' : 'register',register ? 'signIn' : 'join') + '</div>',true);
  const authForm = main.querySelector('form');
  authForm.elements.email.autocomplete = 'email';
  authForm.elements.password.autocomplete = register ? 'new-password' : 'current-password';
  if (register) {
    const section = document.querySelector('#pro-fields');
    function sync() {
      section.hidden = authForm.elements.role.value !== 'pro';
      for (const input of section.querySelectorAll('input,select,textarea')) input.disabled = section.hidden;
    }
    authForm.elements.role.onchange = sync;
    sync();
  }
}
function professional(p) {
  const action = form('guest-requests',
    '<input type="hidden" name="proId" value="' + p.id + '">' +
    '<input type="hidden" name="requestId" value="' + crypto.randomUUID() + '">' +
    label('guestName','<input required name="customer" autocomplete="name" minlength="2" maxlength="80">') +
    phoneField() +
    label('optionalEmail','<input type="email" name="email" autocomplete="email" maxlength="254">') +
    label('title',field('title','text',4,100)) + label('details',textArea('details',10,1000)) +
    '<p class="muted">' + t('guestNotice') + '</p>', 'request');
  main.innerHTML = page('profile','<div class="stack">' + link('home','back') +
    '<article class="panel stack">' + profileLine(p) +
    (p.sample ? '<small class="tag">' + t('sample') + '</small>' : '') +
    '<p class="pre">' + bio(p) + '</p></article><section class="panel stack"><h2>' + t('request') + '</h2>' +
    action + '</section></div>',true);
}
function jobCard(job) {
  let action = '';
  if (user.role === 'pro' && job.status === 'open') {
    action = form('quote','<input type="hidden" name="jobId" value="' + job.id + '">' +
      label('amount','<input type="number" name="amount" required min="1" max="100000000" step="1">') +
      label('note',textArea('note',4,500)),'quote');
  }
  if (user.role === 'customer' && job.status === 'quoted') {
    action = form('accept','<input type="hidden" name="jobId" value="' + job.id + '">','accept');
  }
  const quote = job.amount === null ? '' : '<div class="quote"><strong>' +
    money(job.amount) + '</strong><p class="pre">' + e(job.note) + '</p></div>';
  return '<article class="panel stack"><div class="line"><h3>' + e(job.title) +
    '</h3><span class="tag">' + status(job) + '</span></div><small>' +
    e(job.customer) + ' → ' + e(job.professional) + ' · ' + t(job.category) + ' · ' + e(job.district) +
    '</small><p class="pre">' + e(job.details) + '</p>' + quote + action + '</article>';
}
function guestCard(request) {
  const statusLabel = value => t(value === 'accepted' ? 'acceptedAlert' : value);
  const delivery = user.role === 'admin' ? '<small>' + t('emailAlert') + ' · ' + statusLabel(request.email_status) +
    ' / ' + t('smsAlert') + ' · ' + statusLabel(request.sms_status) + '</small>' : '';
  return '<article class="panel stack"><h3>' + e(request.title) + '</h3><small>' +
    e(request.customer) + ' → ' + e(request.professional) + ' · ' + t(request.category) + ' · ' +
    e(request.district) + '</small><p><a href="tel:' + e(request.phone) + '">' + e(request.phone) + '</a>' +
    (request.email ? ' · <a href="mailto:' + e(request.email) + '">' + e(request.email) + '</a>' : '') +
    '</p><p class="pre">' + e(request.details) + '</p>' + delivery + '</article>';
}
function dashboard(data) {
  const jobs = data.jobs.length ? data.jobs.map(jobCard).join('') : '<p>' + t('noJobs') + '</p>';
  let heading = 'mine';
  let panels = '';
  if (user.role === 'pro') {
    heading = 'received';
    panels = '<section class="panel stack"><h2>' + t('profile') + '</h2>' +
      form('profile',profileFields(data.profile) + phoneField(data.profile.phone) +
        '<label class="check-label"><input type="checkbox" name="smsOptIn"' +
        (data.profile.sms_opt_in ? ' checked' : '') + '> ' + t('smsOptIn') + '</label>','save') + '</section>';
  }
  if (user.role === 'admin') {
    heading = 'jobs';
    panels = '<section class="panel stack"><h2>' + t('accounts') + '</h2><div class="line">' +
      ['customer','pro','admin'].map(role => '<span>' + t(role) + ' <strong>' +
        (data.accounts.find(entry => entry.role === role)?.total || 0) + '</strong></span>').join('') +
      '</div></section><section class="panel stack"><h2>' + t('addPro') + '</h2>' +
      form('admin/professionals', label('name',field('name','text',2,80)) +
        label('email',field('email','email',3,254)) +
        phoneField() +
        label('proPassword','<input required type="password" name="password" autocomplete="new-password" minlength="8" maxlength="128">') +
        profileFields(),'addPro') +
      '</section><section class="panel stack"><h2>' + t('profiles') + '</h2>' +
      data.profiles.map(p => '<div class="line">' + profileLine(p) +
        (p.phone ? '<small>' + t('phone') + ' · <a href="tel:' + e(p.phone) + '">' + e(p.phone) + '</a></small>' : '') +
        '<span class="tag">' +
        t(p.visible ? 'visible' : 'hidden') + '</span>' + form('moderate',
        '<input type="hidden" name="id" value="' + p.id + '"><input type="hidden" name="visible" value="' +
        (p.visible ? 'false' : 'true') + '">',p.visible ? 'hide' : 'show') +
        form('admin/delete-professional','<input type="hidden" name="id" value="' + p.id + '">','deletePro') +
        '</div>').join('') + '</section>';
  }
  main.innerHTML = page(user.role === 'admin' ? 'adminTitle' : 'dashboard','<div class="stack">' +
    (message ? '<p class="success" role="status">' + t(message) + '</p>' : '') +
    panels + (data.guestRequests?.length ? '<h2>' + t('guestRequests') + '</h2>' +
      data.guestRequests.map(guestCard).join('') : '') + '<h2>' + t(heading) + '</h2>' + jobs + '</div>',user.role !== 'admin');
  message = '';
}
function exploreMenu() {
  const groups = serviceGroups.map(([en, rw, services]) =>
    '<details class="explore-group"><summary>' + e(language === 'rw' ? rw : en) +
    '</summary><ul>' + services.map(([id]) =>
      '<li>' + link('service/' + id, id) + '</li>'
    ).join('') + '</ul></details>'
  ).join('');
  return '<details class="explore"><summary>' + t('explore') + '</summary>' +
    '<div class="explore-panel">' + groups + '</div></details>';
}
async function render() {
  const version = ++viewVersion;
  document.documentElement.lang = language;
  document.querySelector('#footer-text').textContent = t('local');
  document.querySelector('#copyright').textContent = '© 2026 FixIt Rwanda. ' + t('rights');
  nav.innerHTML = exploreMenu() + link('home','browse') +
    (user ? link('dashboard','dashboard') + '<button class="button quiet small" id="logout">' + t('logout') + '</button>'
      : link('register/pro','registerPro') + link('login','signIn','button small')) +
    '<button class="button quiet small" id="language" lang="' + (language === 'en' ? 'rw' : 'en') +
    '">' + (language === 'en' ? 'Kinyarwanda' : 'English') + '</button>';
  const explore = nav.querySelector('.explore');
  explore.onclick = event => {
    const target = event.target.closest('a');
    if (target) {
      event.preventDefault();
      explore.open = false;
      navigate(target.hash.slice(1));
    }
  };
  nav.querySelector('#language').onclick = () => {
    language = language === 'en' ? 'rw' : 'en';
    localStorage.setItem('fixit-language',language);
    render();
  };
  const logout = nav.querySelector('#logout');
  if (logout) logout.onclick = async () => {
    try {
      await api('logout',{});
      user = null;
      navigate('home');
    } catch (error) {
      main.innerHTML = page(error.message,'',true);
    }
  };
  const route = location.hash.slice(1) || 'home';
  main.innerHTML = '<p class="wrap section" role="status">' + t('loading') + '</p>';
  try {
    if (route === 'login' || route.startsWith('register')) {
      auth(route !== 'login',route === 'register/pro');
    } else if (route === 'dashboard') {
      if (!user) { navigate('login'); return; }
      const data = await api('dashboard');
      if (version === viewVersion) dashboard(data);
    } else {
      const profiles = await api('profiles');
      if (version !== viewVersion) return;
      const service = route.startsWith('service/') ? route.slice(8) : '';
      if (route === 'home' || serviceNames.has(service)) {
        filter.category = service;
        home(profiles);
        if (service) document.querySelector('#professionals').focus();
      } else {
        const profile = profiles.find(p => route === 'pro/' + p.id);
        if (profile) professional(profile);
        else main.innerHTML = page('missing',link('home','back'),true);
      }
    }
  } catch (error) {
    if (version === viewVersion) main.innerHTML = page(error.message,link('home','back'),true);
  }
}
function navigate(route) {
  if (location.hash === '#' + route) render();
  else location.hash = route;
}
main.addEventListener('submit',async event => {
  const form = event.target;
  const action = form.dataset.action;
  if (!action) return;
  event.preventDefault();
  if (action === 'admin/delete-professional' && !window.confirm(t('confirmDeletePro'))) return;
  const submit = form.querySelector('button');
  const errorBox = form.querySelector('.feedback');
  const data = Object.fromEntries(new FormData(form));
  if (action === 'profile') data.smsOptIn = form.elements.smsOptIn.checked;
  if (action === 'moderate') data.visible = data.visible === 'true';
  submit.disabled = true;
  errorBox.textContent = '';
  try {
    const result = await api(action,data);
    if (action === 'guest-requests') {
      const confirmation = document.createElement('p');
      confirmation.className = 'success';
      confirmation.setAttribute('role','status');
      confirmation.tabIndex = -1;
      confirmation.textContent = t('requestReceived');
      form.replaceWith(confirmation);
      confirmation.focus();
    } else if (result.user) {
      user = result.user;
      navigate('dashboard');
    } else {
      message = 'saved';
      navigate('dashboard');
    }
  } catch (error) {
    errorBox.textContent = t(error.message);
  } finally {
    submit.disabled = false;
  }
});
document.addEventListener('click',event => {
  const explore = nav.querySelector('.explore[open]');
  if (explore && !explore.contains(event.target) && !event.target.closest('#all-services')) {
    explore.open = false;
  }
});
document.addEventListener('keydown',event => {
  const explore = nav.querySelector('.explore[open]');
  if (explore && event.key === 'Escape') {
    explore.open = false;
    explore.querySelector('summary').focus();
  }
});
window.addEventListener('hashchange',() => { window.scrollTo(0,0); render(); });
try {
  ({ user } = await api('me'));
} finally {
  render();
}
