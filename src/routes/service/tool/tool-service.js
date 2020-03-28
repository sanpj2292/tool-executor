const router = new require('express').Router();
const path = require('path');
const jarFolderPath = path.join(__dirname, '../../uploads/jars');

router.get('/*', (req, res) => {
    return res.status(400)
        .send(`
            <!DOCTYPE html>
            <head>
                <title>${req.originalUrl}</title>
            </head>
            <body>
                <p>Cannot perform <em>GET</em> request for <i>${req.originalUrl}</i></p>
            <body>
            </html>
        `);
});

router.post('/toolSave', (req, res) => {
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
})

module.exports = router;