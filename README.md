# **Remote Access Trojan (RAT) Command & Control Server**

A powerful Node.js-based command-and-control server for managing and interacting with a Remote Access Trojan (RAT). This project allows administrators to remotely control Trojans via a centralized server, send commands, fetch results, and monitor status updates.

---

## **Summary of Setup**

### **Command & Control Structure**
1. **Node.js Server**:
   - Acts as the command-and-control (C2) server.
   - Sends commands and configurations to the Trojan.
   - Logs results of executed commands and status updates received from the Trojan.

2. **Trojan**:
   - Periodically polls the Node.js server for commands and configurations.
   - Executes received commands (shell, Python modules, C modules).
   - Sends results and status updates back to the server.

---

### **Workflow**

1. **Sending Commands**:
   - The administrator sends commands to the Node.js server via the `/send-command` endpoint.
   - Supported commands include:
     - **Shell commands** (e.g., `ls -la`).
     - **Python modules** (e.g., importing and executing Python code).
     - **C modules** (e.g., compiled C programs).
   - Commands are validated and stored in `trojanConfig.commands`.

2. **Trojan Fetches Configuration**:
   - The Trojan retrieves commands and configurations from the `/config` endpoint.
   - The server clears stored commands after they are sent.

3. **Executing Commands**:
   - The Trojan processes received commands:
     - **Shell commands**: Executes using Python’s `subprocess` module.
     - **Python/C modules**: Dynamically imports and runs the specified modules.
   - Results are stored locally and sent back to the server via the `/command` endpoint.

4. **Updating Status**:
   - The Trojan sends status updates (e.g., `running`, `stopped`) to the server using the `/status` endpoint.
   - This keeps the server informed about the Trojan’s state.

5. **Command Result Handling**:
   - The server logs results sent by the Trojan, providing feedback on execution outcomes.

---

### **Integration with GitHub**

- **Fetch Configuration**: The Trojan can download configuration files from a GitHub repository.
- **Upload Results**: Command outputs and execution results can be uploaded to the repository for persistent storage.

---

## **Virtual Machine Setup**

### **Virtual Machine Requirements**:
1. **Ubuntu 22.04 Live Server**:  
   Download the ISO: [Ubuntu 22.04 Live Server](https://releases.ubuntu.com/jammy/).

---

## **Node.js Server Setup**

1. **Install Node.js and npm**:
   ```bash
   sudo apt update
   sudo apt install nodejs npm
   ```

2. **Set Up the Project**:
   ```bash
   mkdir Trojan_Server
   cd Trojan_Server
   npm init -y
   npm install express body-parser
   touch server.js
   ```

3. **Add Server Code**:
   Copy the enhanced Node.js server code into `server.js`.

4. **Start the Server**:
   ```bash
   node server.js
   ```

5. **Verify the Setup**:
   Use `curl` or a browser to test the server endpoints:
   ```bash
   curl -X GET http://localhost:3000/config
   ```

---

## **Endpoints**

| Endpoint         | Method | Description                                                                 |
|-------------------|--------|-----------------------------------------------------------------------------|
| `/send-command`  | POST   | Add a command to the Trojan configuration.                                  |
| `/config`        | GET    | Fetch the current Trojan configuration (commands are cleared after sending).|
| `/command`       | POST   | Receive results of executed commands from the Trojan.                      |
| `/status`        | POST   | Receive status updates from the Trojan.                                    |

---

## **Example Usage**

### **1. Add a Command**:
Send a shell command to the Trojan:
```bash
curl -X POST http://localhost:3000/send-command -H "Content-Type: application/json" \
-d '{"type": "shell", "command": "ls -la"}'
```

### **2. Fetch Configuration**:
Retrieve commands and configurations:
```bash
curl -X GET http://localhost:3000/config
```

### **3. Submit Command Results**:
Send results of an executed command:
```bash
curl -X POST http://localhost:3000/command -H "Content-Type: application/json" \
-d '{"command": "ls -la", "result": "drwxr-xr-x 5 user group 4096 Nov 25 2024"}'
```

### **4. Send Status Update**:
Update the server with the Trojan’s current state:
```bash
curl -X POST http://localhost:3000/status -H "Content-Type: application/json" \
-d '{"id": "trojan-123", "status": "running"}'
```

---

## **Features**

- **Multifunctional Command Support**:
  - Execute shell commands.
  - Import and run Python/C modules.

- **Real-Time Status Updates**:
  - Monitor the Trojan’s state (e.g., `active`, `stopped`).

- **Command Validation**:
  - Ensures only valid commands are processed, reducing risks of malformed inputs.

- **Flexible Configuration Management**:
  - Dynamically fetch and execute commands.

- **Integration with GitHub**:
  - Fetch and upload files to a GitHub repository for persistent command storage.

---

## **Future Enhancements**

- **Authentication**: Add API keys or token-based authentication for secure access.
- **Encryption**: Encrypt communication between the Trojan and server.
- **Logging**: Store logs persistently in a database for auditing and analysis.
- **GUI Control Panel**: Develop a web-based dashboard for managing commands and monitoring Trojans.

---

## **Disclaimer**

This tool is intended for **educational purposes only**.  
The author does not condone the use of this tool for illegal or malicious activities.  
Always ensure proper authorization before deploying this tool.

---

### **Made with 💻 and ⚡ by Stephen Sam**

