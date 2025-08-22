const express = require ("express");
const {getCampaigns, createCampaign, updateCampaign, deleteCampaign, getCampaign} = require("../Controllers/campaignsController.js")

const campaignRouter = express.Router();
campaignRouter.post("/", createCampaign);
campaignRouter.get("/", getCampaigns);
campaignRouter.get("/:id", getCampaign);
campaignRouter.put("/:id", updateCampaign);
campaignRouter.delete("/:id", deleteCampaign);

module.exports = campaignRouter;
