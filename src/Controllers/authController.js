const bcrypt = require("bcryptjs");
const pgDatabase = require("../config/database.js");
const jwt = require("jsonwebtoken");

module.exports.userRegister = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    // Check if user already exists
    const exists = await pgDatabase.query(
      "SELECT id FROM users WHERE email=$1",
      [email]
    );
    if (exists.rowCount) {
      return res.status(409).json({ error: "Email already exists" });
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);
    const result = await pgDatabase.query(
      `INSERT INTO users (email, password, name) 
       VALUES ($1, $2, $3) RETURNING *`,
      [email, hashPassword, name]
    );

    const user = result.rows[0];
    const token = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET);
    res.status(201).json({ message: "User registered successfully", token, user });
  } catch (err) {
    res.status(500).json({ error: "Failed to register user" });
  }
};

module.exports.userLogin = async (req, res) => {
  const { email, password } = req.body;

  const result = await pgDatabase.query(
    'SELECT id, email, password, name FROM users WHERE email=$1',
    [email]
  );
  if (!result.rowCount) return res.status(401).json({ error: 'User not registered!' });

  const user = result.rows[0];
  const userVerified = await bcrypt.compare(password, user.password);
  if (!userVerified) return res.status(401).json({ error: 'invalid credentials' });

  const token = jwt.sign(
    { sub: user.id, email: user.email },
    process.env.JWT_SECRET
  );

  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name }
  });
};
