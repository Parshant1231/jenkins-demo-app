const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({
    message: "Hello from Jenkins CI/CD!",
    version: "1.0.0"
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy"
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
