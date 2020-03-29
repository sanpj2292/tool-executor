const router = new require('express').Router();
// const path = require('path');
// const jarFolderPath = path.join(__dirname, '../../uploads/jars');
const Tool = require('../../models/tool');

router.get('/', (req, res) => {
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

router.get('/tools', async (req, res) => {
    try {
        const toolsList = await Tool.find({});
        if (toolsList.length < 1) {
            return res.status(404).send({ 'message': 'Tools List is empty' });
        }
        return res.status(200).send({ tools: toolsList })
    } catch (error) {
        return res.status(500).send(error);
    }
});

router.post('/toolSave', async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            throw new Error('No Files were uploaded:400');
        }

        const jarFile = req.files.file;
        const firstTool = await Tool.find({ name: jarFile.name })
            .sort({ version: 'desc' })
            .limit(1);

        let toolObj = jarFile;
        if (firstTool !== null && firstTool.length > 0) {
            let obj = firstTool[0].toObject();
            delete obj._id;
            delete obj.__v;
            delete obj.createdAt;
            delete obj.updatedAt;
            toolObj = Tool.createTool(obj);
        }
        const tool = new Tool(toolObj);
        await tool.save();
        return res.status(201).send({ 'message': 'Successful Insertion' });

        // jarFile.mv(filePath, (err) => {
        //     if (err) {
        //         throw new Error(`${err.message}:500`)
        //     }
        //     res.json({ message: 'File successfully uploaded!' });
        // });
    } catch (error) {
        // if (error.message.includes(':')) {
        //     const [msg, code] = error.message.split(':');
        //     return res.status(Number(code)).send(msg);
        // }
        return res.status(500).send(error);
    }
})

module.exports = router;