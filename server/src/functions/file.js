const Files = require('../models/files');
const Directories = require('../models/directories');

const iconByFormat = require('../formats');

const findUpperDir = async (filePath) => {
    const path = [...filePath];
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

const fileUpload = async (file) => {
    try {
        const dir_id = await findUpperDir(file.path);
        const icon = iconByFormat(file);

        file.meta = {...file.meta, ...icon};

        const fileEntry = new Files({
            ...file,
            dir_id,
        });

        const createdEntry = await fileEntry.save();
        console.log(file);

        return(createdEntry);
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = {
    fileUpload,
}