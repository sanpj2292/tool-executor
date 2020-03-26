const express = require('express');
const socketIo = require("socket.io");
const http = require('http');
const { spawn } = require('child_process');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const port = process.env.PORT || 4000;
const jarFolderPath = `${__dirname}/uploads/jars`;
const downloadPath = `${__dirname}/downloads`;

const app = express();
app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(fileUpload());

app.post('/uploadJarFile', (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send('No Files were uploaded');
    }

    const jarFile = req.files.file;
    const name = jarFile.name;
    const filePath = `${jarFolderPath}/${name}`;

    jarFile.mv(filePath, (err) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json({ message: 'File successfully uploaded!' });
    });
});

app.get('/download/:downloadFile', (req, res) => {
    let fname = req.params.downloadFile;
    res.download(`${downloadPath}\\${fname}`, (err) => {
        if (err) {
            return res.status(500).send({
                message: 'Couldn\'t download the provided file',
                error: err
            });
        }
    });
});

app.use('/', (req, res) => {
    res.send('Express Page');
});

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

server.listen(port, () => {
    console.log(`We are live at ${port}`);
});

module.exports = app;