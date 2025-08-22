const pgDatabase = require("../config/database");

module.exports.createLead = async (req, res) => {
  try {
    const { campaign_id, name, email, status, value } = req.body;

    if (!campaign_id || !name || !email) {
      return res.status(400).json({ error: "campaign_id, name and email are required" });
    }

    const result = await pgDatabase.query(
      `INSERT INTO leads (user_id, campaign_id, name, email, status, value)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [req.user.id, campaign_id, name, email, status || "new", value || 0]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error while creating lead", errMessage: err.message });
  }
};

module.exports.getLeads = async (req, res) => {
  try {
    const result = await pgDatabase.query(
      `SELECT * 
       FROM leads 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error while fetching leads", errMessage: err.message });
  }
};

module.exports.getLead = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pgDatabase.query("SELECT * FROM leads WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error while fetching lead", errMessage: err.message });
  }
};

module.exports.updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const { campaign_id, name, email, status, value } = req.body;

    // Run update query
    const result = await pgDatabase.query(
      `UPDATE leads 
       SET campaign_id = $1, name = $2, email = $3, status = $4, value = $5
       WHERE id = $6 AND user_id = $7 
       RETURNING *`,
      [campaign_id, name, email, status || 'new', value, id, req.user.id]
    );

    if (!result.rowCount) {
      return res.status(404).json({ error: "Lead not found or not owned by user" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error while updating lead", errMessage: err.message });
  }
};

module.exports.deleteLead = async (req, res) => {
  try {
    const { id } = req.params;

    // Auth check
    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    // Perform delete
    const result = await pgDatabase.query(
      "DELETE FROM leads WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, req.user.id]
    );

    if (!result.rowCount) {
      return res.status(404).json({ error: "Lead not found or not owned by user" });
    }

    res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
      deletedLead: result.rows[0] // optional: return deleted record
    });
  } catch (err) {
    res.status(500).json({ error: "Server error while deleting lead", errMessage: err.message });
  }
};
