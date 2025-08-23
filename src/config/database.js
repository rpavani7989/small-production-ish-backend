const { Pool } = require("pg");
require("dotenv").config();

const pgDatabase = new Pool({
  connectionString: process.env.DB_URL,
  ssl: { rejectUnauthorized: false }, // Neon requires SSL
  keepAlive: true,
});

// Test connection when app starts
(async () => {
  try {
    const res = await pgDatabase.query("SELECT NOW()");
  } catch (err) {
    process.exit(1); // stop the app if DB not reachable
  }
})();

module.exports = pgDatabase;
