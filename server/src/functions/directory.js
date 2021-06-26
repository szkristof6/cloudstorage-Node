const Files = require('../models/files');
const Directories = require('../models/directories');

const findUpperDir = async (req) => {
    const path = [...req.body.path];
    const folder = path.pop();

    //console.log(`path: ${path}, folder: ${folder}`);

    const query = await Directories.find({
        'path': path,
        'name': folder,
    }, '_id', (_, dir) => {
        return dir._id;
    });

    return query[0] !== undefined ? query[0]._id : 0;
}

const createDirectory = async (req, res, next) => {
    try {
        const dir_id = await findUpperDir(req);

        const directoryEntry = new Directories({
            ...req.body,
            dir_id
        });

        const createdEntry = await directoryEntry.save();
        res.json(createdEntry)
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(422);
        }
        next(error);
    }
}

module.exports = {
    createDirectory,
}