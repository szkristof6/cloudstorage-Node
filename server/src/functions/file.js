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

const fileUpload = async (req, res, next) => {
    try {

        const dir_id = await findUpperDir(req);

        const fileEntry = new Files({
            ...req.body,
            dir_id,
        });

        const createdEntry = await fileEntry.save();
        res.json(createdEntry)
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(422);
        }
        next(error);
    }
};

module.exports = {
    fileUpload,
}