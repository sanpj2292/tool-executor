const mongoose = require('mongoose');

const ToolSchemaOpts = {
    timestamps: true
};

const ToolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Original Name is to be provided'],
    },
    versioned_name: {
        type: String,
        // required: [true, 'Versioned_name has to be provided'],
        trim: true
    },
    size: {
        type: Number,
    },
    encoding: {
        type: String,
    },
    tempFilePath: {
        type: String,
    },
    truncated: {
        type: Boolean
    },
    mimetype: {
        type: String,
        default: 'application/java-archive'
    },
    md5: {
        type: String
    },
    data: {
        type: 'Buffer',
        required: [true, 'jar file is required'],
    },
    version: {
        type: 'Decimal128'
    },
    instruction: {
        type: String
    }
}, ToolSchemaOpts);

const setVersionName = (obj) => {
    const { name, version } = obj;
    const i = name.lastIndexOf('.');
    const fname = name.substring(0, i);
    const ext = name.substring(i + 1);
    return `${fname}_${version}.${ext}`;
};

const setVersion = (tool) => {
    if (tool.version && tool.version !== null && tool.version >= 1.0) {
        let val = parseFloat(tool.version);
        const decimalVal = val - Math.floor(val + 0.1);
        const inc = (decimalVal > 0.5) ? 1.0 : 0.1;
        return (val + inc).toFixed(1);
    } else {
        return (1.0).toFixed(1);
    }
};

ToolSchema.pre('save', async function (next) {
    const tool = this;
    tool.version = setVersion(tool);
    tool.versioned_name = setVersionName(tool);
    next();
});

ToolSchema.statics.createTool = (fileObj) => ({
    version: 0.0,
    ...fileObj,
    versioned_name: '',
    instruction: ''
});

const Tool = mongoose.model('tools', ToolSchema)

module.exports = Tool;