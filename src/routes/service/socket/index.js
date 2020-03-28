const socketIo = require("socket.io");
const { sendHelloSocket, jarExecutionSocket } = require('./execution.socket');

const socketIoListener = (appServer) => {
    const io = socketIo.listen(appServer);
    io.of('/sendHello').once('connection', sendHelloSocket);
    io.of('/execution').once("connection", jarExecutionSocket);
    return io;
};

module.exports = socketIoListener;