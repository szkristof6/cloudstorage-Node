const Directories = require('../models/directories');

const findUpperDir = async (dirPath) => {
    const path = [...dirPath];
    const folder = path.pop();

    //console.log(`path: ${path}, folder: ${folder}`);

    const query = await Directories.findOne({
            path,
            name: folder 
        })
        .lean()
        .select('_id');

    return query ? query._id : 0;
}

const createDirectory = async (dir) => {
    try {
        const dir_id = await findUpperDir(dir.path);

        const directoryEntry = new Directories({
            ...dir,
            dir_id
        });

        const createdEntry = await directoryEntry.save();
        res.json(createdEntry)
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = {
    createDirectory,
}