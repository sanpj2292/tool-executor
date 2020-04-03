const { spawn } = require('child_process');
const { getDecodedValue } = require('../../utils');

const sendHelloSocket = (socket) => {
    socket.emit('hello', 'Hello from sExecution Socket');
    socket.disconnect();
};

const jarExecutionSocket = async socket => {
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
        subProcess.stdout.on('close', (code, signal) => {
            socket.emit('exitFunction', `Function execution complete with code: ${code}`);
            socket.disconnect();
        })
    } catch (error) {
        console.error(`Error: ${error.code}`);
    }
};

module.exports = {
    sendHelloSocket,
    jarExecutionSocket
}