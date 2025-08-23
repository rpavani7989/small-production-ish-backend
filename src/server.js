// server.js
const app = require("./app");
const { initDB } = require("./Models/data.js");

(async () => {
  try {
    await initDB(); // initialize db tables
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    process.exit(1);
  }
})();
