const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.split(" ")[1];
  if (!token) return res.status(401).json({ error: 'User not login' });
  try {
    const tokenVerified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: tokenVerified.sub, email: tokenVerified.email };
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = { authMiddleware };
