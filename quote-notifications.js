import { rwandaMobile } from './guest-requests.js';

async function sendEmail(env, request, dashboard) {
  if (!env.RESEND_API_KEY || !env.QUOTE_EMAIL_FROM) return 'unconfigured';
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + env.RESEND_API_KEY,
      'Content-Type': 'application/json',
      'Idempotency-Key': 'fixit-quote/' + request.id
    },
    body: JSON.stringify({
      from: env.QUOTE_EMAIL_FROM,
      to: [request.pro_email],
      subject: 'New quote request on FixIt Rwanda',
      text: [
        'A customer requested a quote. Contact them directly using the details below.',
        '',
        'Name: ' + request.customer,
        'Phone: ' + request.phone,
        ...(request.email ? ['Email: ' + request.email] : []),
        'District: ' + request.district,
        'Job: ' + request.title,
        request.details,
        '',
        'View your FixIt Rwanda dashboard: ' + dashboard
      ].join('\n')
    }),
    signal: AbortSignal.timeout(8000)
  });
  return response.ok ? 'accepted' : 'failed';
}

async function sendSms(env, request, dashboard) {
  if (!env.AT_API_KEY || !env.AT_USERNAME || !env.AT_SENDER_ID) return 'unconfigured';
  const mobile = rwandaMobile(request.pro_phone);
  if (!request.sms_opt_in || !mobile) return 'disabled';
  const response = await fetch('https://api.africastalking.com/version1/messaging', {
    method: 'POST',
    headers: { apiKey: env.AT_API_KEY, Accept: 'application/json' },
    body: new URLSearchParams({
      username: env.AT_USERNAME,
      from: env.AT_SENDER_ID,
      to: mobile,
      message: 'FixIt Rwanda: New quote request. Call ' + request.phone + ' or view details: ' + dashboard
    }),
    signal: AbortSignal.timeout(8000)
  });
  if (!response.ok) return 'failed';
  const { SMSMessageData } = await response.json();
  return [100, 101, 102].includes(SMSMessageData?.Recipients?.[0]?.statusCode) ? 'accepted' : 'failed';
}

export async function notifyProfessional(env, id, origin) {
  // Resolve contact details again after saving, so a deleted professional gets no new alert.
  const request = await env.DB.prepare(`
    SELECT g.*, u.email AS pro_email, p.phone AS pro_phone, p.sms_opt_in
    FROM guest_requests g JOIN users u ON u.id=g.pro_id JOIN profiles p ON p.id=g.pro_id
    WHERE g.id=? AND u.role='pro' AND p.visible=1
  `).bind(id).first();
  if (!request) {
    await env.DB.prepare("UPDATE guest_requests SET email_status='disabled',sms_status='disabled' WHERE id=?").bind(id).run();
    return;
  }
  const dashboard = origin + '/#dashboard';
  const outcomes = await Promise.allSettled([sendEmail(env, request, dashboard), sendSms(env, request, dashboard)]);
  const [email, sms] = outcomes.map(result => result.status === 'fulfilled' ? result.value : 'unknown');
  await env.DB.prepare('UPDATE guest_requests SET email_status=?,sms_status=? WHERE id=?').bind(email, sms, id).run();
}
