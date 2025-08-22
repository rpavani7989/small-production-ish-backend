const pgDatabase = require("../config/database");


module.exports.createCampaign = async (req, res) => {
  try {
    const { name, description, budget, start_date, end_date } = req.body;

   const result = await pgDatabase.query(
      `INSERT INTO campaigns (name, description, budget, start_date, end_date, user_id)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [name, description, budget, start_date, end_date, req.user.id]
    );

    res.status(201).json({sucess : "Created Sucessfully!"});
  } catch (err) {
    res.status(500).json({ error: "Failed to create campaign", errMessage: err.message });
  }
};

module.exports.getCampaigns = async (req, res) => {
  try {
    const result = await pgDatabase.query('SELECT * FROM campaigns WHERE user_id=$1 ORDER BY created_at DESC', [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message, errMessage: err.message });
  }
};

module.exports.getCampaign = async (req, res) => {
   try {
    const { id } = req.params;
    const result = await pgDatabase.query("SELECT * FROM campaigns WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error while fetching campaign", errMessage: err.message });
  }
};

module.exports.updateCampaign = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, description, budget, start_date, end_date } = req.body;

    const result = await pgDatabase.query(
      `UPDATE campaigns 
       SET name=$1, budget=$2, description=$3, start_date=$4, end_date=$5
       WHERE id=$6 AND user_id=$7 
       RETURNING *`,
      [name, budget, description, start_date, end_date, id, req.user.id]
    );

    if (!result.rowCount) {
      return res.status(404).json({ error: "Campaign not found or not owned by user" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update campaign", errMessage: err.message });
  }
};

module.exports.deleteCampaign = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await pgDatabase.query(
      "DELETE FROM campaigns WHERE id=$1 AND user_id=$2 RETURNING *",
      [id, req.user.id]
    );
    res.json({ message: "Campaign deleted successfully"});

  } catch (err) {
    res.status(500).json({ error: "Failed to delete campaign", errMessage: err.message });
  }
};