const router = new require('express').Router();
const stream = require('stream');
// const path = require('path');
// const jarFolderPath = path.join(__dirname, '../../uploads/jars');
const Tool = require('../../models/tool');
const { groupConfig, projectConfig } = require('./utils');

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

// 
router.get('/aggregate', async (req, res) => {
    try {
        const aggregatedTool = await Tool.aggregate([
            { $group: groupConfig },
            { $project: projectConfig }
        ]);
        return res.status(200).send(aggregatedTool);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

// To Download the jar file from DB
router.get('/download/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const fileMetaData = await Tool.findById(id);
        const { mimetype, encoding, versioned_name, data } = fileMetaData;
        let fileContents = Buffer.from(data, encoding);
        res.set('Content-disposition', 'attachment; filename=' + versioned_name);
        res.set('Content-Type', mimetype);
        var readStream = new stream.PassThrough();
        readStream.end(fileContents);

        readStream.pipe(res);
    } catch (error) {
        console.log('error occurred');
        return res.status(500).send(error);
    }
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
            return res.status(400).send('No Files were uploaded');
        }
        const jarFile = req.files.jarFile;
        const { instruction } = req.body;
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
        toolObj.instruction = instruction;
        const tool = new Tool(toolObj);
        await tool.save();
        const aggregatedTool = await Tool.aggregate([
            { $match: { name: toolObj.name } },
            { $group: groupConfig },
            { $project: projectConfig }
        ]);
        return res.status(201).send({ row: aggregatedTool[0], msg: 'Successfully created!' });
    } catch (error) {
        return res.status(500).send(error);
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const tool = await Tool.findOneAndDelete({ _id: id });
        if (!tool) {
            return res.status(404).send('Mentioned Tool is not found');
        }
        return res.send(tool);
    } catch (error) {
        return res.status(500).send(error);
    }
});

module.exports = router;