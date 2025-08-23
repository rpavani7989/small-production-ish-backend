const express = require ("express");
const { createLead, getLeads, getLead, updateLead, deleteLead } = require("../Controllers/LeadController");

const leadRouter = express.Router();
leadRouter.post("/", createLead);
leadRouter.get("/", getLeads);
leadRouter.get("/:id", getLead);
leadRouter.put("/:id", updateLead);
leadRouter.delete("/:id", deleteLead);

module.exports = leadRouter;
