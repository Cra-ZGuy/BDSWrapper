# BDSWrapper

`BDSWrapper.js` is a Node.js script designed to manage a Minecraft Bedrock Edition server via HTTP requests. It allows you to send commands with level-4 operator permissions to the server through a simple web interface.

## Features

- Send commands to the server via HTTP POST requests
- Stop the Minecraft Bedrock Edition server via HTTP POST requests
- Basic HTTP authentication for security

## Requirements

- Node.js installed on your system
- Minecraft Bedrock Edition server

## Setup

1. **Download the Minecraft Bedrock Dedicated Server**: 
   - Go to the [Minecraft Bedrock Dedicated Server download page](https://www.minecraft.net/en-us/download/server/bedrock).
   - Download the latest version of the server.

2. **Install Node.js**: Make sure you have Node.js installed on your system. You can download it from [nodejs.org](https://nodejs.org/).

3. **Dependencies Install**: Run the following command to install the dependencies:
    ```sh
    npm install express colors
    ```

4. **Update Configuration**: Make sure the `serverLocation`, `httpPort` and `authCode` in the `BDSWrapper.js` file are configured correctly:
    ```javascript
    const serverLocation = 'C:/PATH_TO_BEDROCK_SERVER_DIRECTORY'; // Update this path
    const httpPort = 8080; // Port for HTTP requests
    const authCode = 'your_auth_key'; // Authentication for HTTP requests
    ```

## Usage

1. **Run the Script**: Use the following command to run the script:
    ```sh
    node BDSWrapper.js
    ```

2. **Send Commands**:
    - **via Curl:**

        ```sh
        curl -X POST http://localhost:8080/command -H "auth: your_auth_key" -H "Content-Type: text/plain" -d "say hi"
        ```
    - **via Minecraft Server-Net:**

        ```javascript
        import { HttpRequest, HttpHeader, HttpRequestMethod, http } from "@minecraft/server-net";

        async function runConsoleCommand(score) {
            const req = new HttpRequest("http://localhost:8080/command");

            req.method = HttpRequestMethod.Post;
            req.body = "say hi";
            req.headers = [
                new HttpHeader("Content-Type", "text/plain"),
                new HttpHeader("auth", "your_auth_key")
            ];

            await http.request(req);
        }
        ```
    
## Batch File Example

You can create a batch file to run the script more easily. Save the following content in a `.bat` file:

```batch
@echo off
REM Set the path to your Node.js installation if it's not already in the PATH environment variable
REM set PATH=C:/Program Files/nodejs;%PATH%

REM Navigate to the directory where your script is located
cd C:/PATH_TO_SCRIPT_DIRECTORY

REM Run the Node.js script
node BDSWrapper.js
```