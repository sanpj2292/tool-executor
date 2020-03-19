const express = require('express');
const socketIo = require("socket.io");
const http = require('http');
const { spawn } = require('child_process');
const cors = require('cors');

const port = process.env.PORT || 4000;

const app = express();
app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use('/', (req, res) => {
    res.send('Express Page');
});

const server = http.createServer(app);

const io = socketIo(server, { origins: '*:*' });

let interval;

io.on("connection", socket => {
    console.log("New client connected");
    if (interval) {
        clearInterval(interval);
    }
    interval = getApiAndEmit(socket);
    // Mimicking Live Updates scenario at regular intervals
    // setInterval(() => {
    //     getApiAndEmit(socket);
    // }, 1000);
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

const getApiAndEmit = async socket => {
    try {
        const { folderPath } = socket.handshake.query;
        console.log(folderPath);
        const subProcess = spawn('java', [
            '-jar',
            `-DFolder=${folderPath}`,
            'F:\\JavaProgs\\JavaApp\\classes\\production\\JavaApp\\JavaApp.jar'
        ], { stdio: 'pipe' });
        subProcess.stdout.on('data', (chunk) => {
            var dec = new TextDecoder("utf-8");
            console.log(`${dec.decode(chunk)}`);
            socket.emit("FromAPI", dec.decode(chunk)); // Emitting a new message. It will be consumed by the client
        });
    } catch (error) {
        console.error(`Error: ${error.code}`);
    }
};

server.listen(port, () => {
    console.log(`We are live at ${port}`);
});

module.exports = app;