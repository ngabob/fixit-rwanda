ALTER TABLE profiles ADD COLUMN sms_opt_in INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS guest_requests (
  id TEXT PRIMARY KEY, pro_id INTEGER NOT NULL REFERENCES profiles(id),
  customer TEXT NOT NULL, phone TEXT NOT NULL, email TEXT,
  title TEXT NOT NULL, details TEXT NOT NULL,
  category TEXT NOT NULL, district TEXT NOT NULL,
  email_status TEXT NOT NULL DEFAULT 'pending',
  sms_status TEXT NOT NULL DEFAULT 'pending',
  created TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS guest_requests_professional ON guest_requests(pro_id, created);
