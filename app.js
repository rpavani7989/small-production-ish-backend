// app.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const campaignRouter = require("./Routes/campaignRoutes.js");
const { authMiddleware } = require("./middlewares/auth.js");
const leadRouter = require("./Routes/leadRoutes.js");
const router = require("./Routes/authRoutes.js");
const { testauthMiddleware } = require("./middlewares/testauthMiddleware.js");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", router);
if (process.env.NODE_ENV === "test") {
  app.use("/api/campaigns", testauthMiddleware, campaignRouter);
  app.use("/api/leads", testauthMiddleware, leadRouter);
} else {
  app.use("/api/campaigns", authMiddleware, campaignRouter);
  app.use("/api/leads", authMiddleware, leadRouter);
}


module.exports = app;
