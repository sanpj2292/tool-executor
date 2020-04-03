const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const expressIp = require('express-ip');
const expIpMiddleware = expressIp().getIpInfoMiddleware;
require('./db/mongoose');


const controller = require('./controller/controller');

const port = process.env.PORT || 4000;

const app = express();
const corsOps = {
    credentials: true,
    // origin: 'http://localhost:3000'
};

app.use(cors(corsOps));

app.use(fileUpload());
app.use(expIpMiddleware);

// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use('/', controller);

// const server = http.createServer(app).listen(5000, () => {
//     console.log(`Socket is Live At 5000`);
// });

const appServer = app.listen(port, () => {
    console.log(`We are live at ${port}`);
});

const socketIoListener = require('./service/socket');
socketIoListener(appServer); // This function return io object of socketIo

module.exports = app;