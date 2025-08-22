const pgDatabase = require("../config/database");

module.exports.initDB = async () => {
    await pgDatabase.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT UNIQUE,
      password VARCHAR(255),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await pgDatabase.query(`
    CREATE TABLE IF NOT EXISTS campaigns (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      budget FLOAT,
      status TEXT NOT NULL DEFAULT 'draft',
      start_date DATE,
      end_date DATE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  
  await pgDatabase.query(`
    CREATE TABLE IF NOT EXISTS leads (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      status TEXT NOT NULL DEFAULT 'new',
      value NUMERIC(12,2) NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  
  // Seed one user if none exist
  const { rows } = await pgDatabase.query(`SELECT COUNT(*) FROM users`);
  if (parseInt(rows[0].count) === 0) {
    await pgDatabase.query(
      `INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`,
      ['Test User', 'test@example.com', 'password']
    );
  }
}
