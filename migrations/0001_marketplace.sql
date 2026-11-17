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

CREATE INDEX sessions_expiry ON sessions(expires);
CREATE INDEX jobs_customer ON jobs(customer_id, id);
CREATE INDEX jobs_professional ON jobs(pro_id, id);
CREATE TRIGGER quote_updates_job AFTER INSERT ON quotes
BEGIN
  UPDATE jobs SET status='quoted' WHERE id=NEW.job_id;
END;
