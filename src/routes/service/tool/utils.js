const groupConfig = {
    _id: '$name',
    versions: {
        $push: { $convert: { input: '$version', to: 'double' } }
    },
    grouped_versions: {
        $push: {
            id: '$_id',
            mimetype: '$mimetype',
            version: '$version',
            createdAt: '$createdAt',
            updatedAt: '$updatedAt',
            versioned_name: '$versioned_name',
            instruction: { $ifNull: ['$instruction', ""] }
        }
    }
};

const projectConfig = {
    _id: 0,
    name: '$_id',
    versions: '$versions',
    ids: '$grouped_versions.id',
    instructions: '$grouped_versions.instruction',
    versionedNames: '$grouped_versions.versioned_name'
};

module.exports = {
    groupConfig,
    projectConfig
}