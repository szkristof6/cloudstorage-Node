const Directories = require('../models/directories');

const { createDirectory } = require('./directory');
const { fileUpload } = require('./file');

const upload = async (req, res, next) => {
    try {
        const { files, user } = req;
        const pageID = req.query.pageID === 'my-drive' ? 0 : req.query.pageID;

        const query = pageID !== 0 &&
            await Directories.findOne({
                _id: pageID
            })
            .lean()
            .select('path name');

        if(pageID !== 0) {
            const { path, name } = query;
            path.push(name);
        }
        
        for(let file of files){
            const json = {
                name: file.originalname,
                path: pageID !== 0 ? query.path : ["index"],
                in_trash: false,
                meta: {
                    size: file.size,
                    type: file.mimetype,
                    lastModified: Date.now()
                },
                share: {
                    mode: 'none',
                    permissions: 'read'
                },
                user: user.username
            };

            await fileUpload(json);
        };
        res.json({
            message: 'Sikeres feltöltés',
            code: 200
        });   
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(422);
        }
        next(error);
    }
};

module.exports = { upload }