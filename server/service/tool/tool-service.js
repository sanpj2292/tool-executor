const fs = require('fs');
const router = new require('express').Router();
const path = require('path');
const jarFolderPath = path.join(__dirname, '../../../uploads');
const Tool = require('../../models/tool');
const { groupConfig, projectConfig, getFolderFromName } = require('./utils');

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
        const { mimetype, versioned_name } = fileMetaData;
        // get Folder from meta-data
        const folder = getFolderFromName(fileMetaData);
        res.set('Content-disposition', 'attachment; filename=' + versioned_name);
        res.set('Content-Type', mimetype);
        // Download from File-system
        let fstream = fs.createReadStream(`${jarFolderPath}/${folder}/${versioned_name}`);
        fstream.pipe(res);
    } catch (error) {
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
        if (firstTool && firstTool !== null && firstTool.length > 0) {
            let obj = firstTool[0].toObject();
            delete obj._id;
            delete obj.__v;
            delete obj.createdAt;
            delete obj.updatedAt;
            toolObj = Tool.createTool(obj);
        }
        toolObj.instruction = instruction;
        const tool = new Tool(toolObj);
        const savedTool = await tool.save();
        // Saving File inside the Server
        const jarFolder = getFolderFromName(savedTool);
        // Check for existence of directory, if not create it!
        const directory = `${jarFolderPath}/${jarFolder}`;
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }
        console.log('Before moving to directory')
        await jarFile.mv(`${directory}/${savedTool.versioned_name}`);
        // Aggregation needed to assit in render process on client-side
        const aggregatedTool = await Tool.aggregate([
            { $match: { name: toolObj.name } },
            { $group: groupConfig },
            { $project: projectConfig }
        ]);
        return res.status(201).send({ row: aggregatedTool[0], msg: 'Successfully created!' });
    } catch (error) {
        console.log(error);
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
        // Remove file from it's Path in Server
        const jarFolder = getFolderFromName(tool);
        fs.unlinkSync(`${jarFolderPath}/${jarFolder}/${tool.versioned_name}`);
        const aggregatedTool = await Tool.aggregate([
            { $group: groupConfig },
            { $project: projectConfig }
        ]);
        return res.status(200).send({ deleted: tool, rows: aggregatedTool });
    } catch (error) {
        return res.status(500).send(error);
    }
});

module.exports = router;