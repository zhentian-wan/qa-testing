const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Serve index.html for the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/report", (req, res) => {
  const { filepath, "top-level-url": topLevelUrl } = req.query;

  console.log(filepath, topLevelUrl);

  // Check if top-level-url exists and is a valid URL
  if (!topLevelUrl || !isValidUrl(topLevelUrl)) {
    res.status(400).type("text/plain").send("invalid action");
    return;
  }

  // Resolve the filepath and send the PDF file
  const filePath = path.resolve(`./files/${filepath}`);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(400).type("text/plain").send("file not found");
  }
});

// Helper function to validate a URL
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
