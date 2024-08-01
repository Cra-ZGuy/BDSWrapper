const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const colors = require('colors');

const serverLocation = 'C:/PATH_TO_BEDROCK_SERVER_DIRECTORY'; // Directory where bedrock_server.exe lives
const httpPort = 8080; // Port for HTTP requests
const authCode = 'your_auth_key'; // Authentication for HTTP requests

let serverProcess;

const app = express();
app.use(express.text());

const startServer = () => {
    const serverExecutable = path.join(serverLocation, 'bedrock_server.exe');
    
    if (!serverExecutable) {
        console.error(`Server executable not found at ${serverExecutable}.\n`);
        process.exit(1);
    }
    
    serverProcess = spawn(serverExecutable, [], { 
        stdio: ['pipe', 'pipe', 'pipe']
    });
    
    serverProcess.stdout.on('data', (data) => {
        console.log(data.toString());
		
        if (data.toString().includes('Server started.')) {
            console.log(colors.green('BDSWrapper successfully launched.\n'));
        }
    });
    
    serverProcess.stderr.on('data', (data) => {
        console.error(`STDERR: ${data.toString()}`);
    });
    
    serverProcess.on('exit', (code) => {
        console.log(colors.yellow(`Server process exited with code ${code}.\n`));
    });
};

const stopServer = () => {
    if (!serverProcess) {
		return;
    }
	
    serverProcess.stdin.write('stop\n');
	
    serverProcess.on('exit', () => {
        console.log(colors.magenta('Server stopped successfully.'));
        process.exit(0);
    });
};

app.get('/', (req, res) => {
    res.status(200).send('Server is running.');
});

// Function to handle HTTP POST requests for commands
app.post('/command', (req, res) => {
    const requestAuth = req.headers['auth'];
	
    if (requestAuth !== authCode) {
        console.error('Invalid authentication.\n');
        res.status(403).send('Forbidden.');
        return;
    }
	
    let command = JSON.stringify(req.body); // Stringify body to test for bed requests

    if (!command || command === "{}") {
        console.error('No command received.\n');
        res.status(400).send('Bad Request.');
        return;
    }

    command = req.body.trim(); // Use original body and trim whitespace to avoid extra characters

    console.log(colors.green(`Received command: ${command}\n`));
    
    if (command === 'stop') {
        console.log(colors.yellow('Received stop command via HTTP. Exiting...\n'));
        stopServer();
    } else if (serverProcess && serverProcess.stdin) {
        serverProcess.stdin.write(`${command}\n`); // Execute command
    }
    
    res.status(200).send('OK.');
});

app.listen(httpPort, () => {
    console.log(colors.yellow(`HTTP Listener started. Listening on port ${httpPort}...\n`));
    startServer();
});
