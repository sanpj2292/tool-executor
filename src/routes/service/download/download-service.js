const routes = new require('express').Router();
const path = require('path');

const downloadPath = path.join(`${__dirname}`, '../../downloads');

routes.get('/', (req, res) => {
    console.log(req.url);
    res.send(`Cannot Get this route  ${req}`);
});

routes.get('/:downloadFile', (req, res) => {
    const { downloadFile } = req.params;
    if (!downloadFile || downloadFile === null || downloadFile === '') {
        return res.status(404).send({
            message: 'Kindly provide the Download File'
        });
    }
    res.download(`${downloadPath}\\${downloadFile}`, (err) => {
        if (err) {
            return res.status(500).send({
                message: 'Couldn\'t download the provided file',
                error: err
            });
        }
    });
});

module.exports = routes;