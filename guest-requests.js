const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function rwandaMobile(phone) {
  if (/^07[0-9]{8}$/.test(phone)) return '+250' + phone.slice(1);
  if (/^2507[0-9]{8}$/.test(phone)) return '+' + phone;
  return /^\+2507[0-9]{8}$/.test(phone) ? phone : null;
}

export function guestRequest(body, field, phone, fail) {
  if (typeof body.requestId !== 'string' ||
      !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(body.requestId)) {
    fail(400, 'invalid');
  }
  const email = body.email === undefined || body.email === '' ? null : field(body, 'email', 3, 254);
  if (email && !emailPattern.test(email)) fail(400, 'invalid');
  return [
    body.requestId, field(body, 'customer', 2, 80), phone(body.phone), email,
    field(body, 'title', 4, 100), field(body, 'details', 10, 1000)
  ];
}

export const insertGuestRequest = `
  INSERT INTO guest_requests(id,customer,phone,email,title,details,pro_id,category,district)
  SELECT ?,?,?,?,?,?,p.id,p.category,p.district
  FROM profiles p JOIN users u ON u.id=p.id
  WHERE p.id=? AND p.visible=1 AND u.role='pro'
  ON CONFLICT(id) DO NOTHING
`;

export const guestRequestQuery = `
  SELECT g.*, u.name AS professional
  FROM guest_requests g JOIN users u ON u.id=g.pro_id
`;
