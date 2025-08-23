const express = require ("express");
const { userRegister, userLogin } = require("../Controllers/authController");

const router = express.Router();
router.post("/register", userRegister);
router.post("/login", userLogin);

module.exports = router;
