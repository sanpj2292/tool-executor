const express = require('express');
const socketIo = require("socket.io");
const http = require('http');
const { spawn } = require('child_process');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const controller = require('./routes/controller/controller');

const port = process.env.PORT || 4000;

const app = express();
app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(fileUpload());
app.use('/', controller);

const server = http.createServer(app);

const getDecodedValue = (dataChunk) => {
    var dec = new TextDecoder("utf-8");
    return dec.decode(dataChunk);
};

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
});

const getApiAndEmit = async socket => {
    try {
        const { folderPath } = socket.handshake.query;
        const subProcess = spawn('java', [
            '-jar',
            `-DFolder=${folderPath}`,
            'F:\\JavaProgs\\JavaApp\\classes\\production\\JavaApp\\JavaApp.jar'
        ], { stdio: 'pipe' });
        subProcess.stdout.on('data', (chunk) => {
            socket.emit("FromAPI", getDecodedValue(chunk)); // Emitting a new message. It will be consumed by the client
        });
    } catch (error) {
        console.error(`Error: ${error.code}`);
    }
};

app.listen(port, () => {
    console.log(`We are live at ${port}`);
});

module.exports = app;