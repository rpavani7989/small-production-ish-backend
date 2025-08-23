// __mocks__/auth.js
module.exports.testauthMiddleware = (req, res, next) => {
  req.user = { id: 1, email: "test@example.com" }; // fake user
  next();
};