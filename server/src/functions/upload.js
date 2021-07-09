const Directories = require('../models/directories');
const path = require('path');
const { createDirectory } = require('./directory');
const { fileUpload } = require('./file');
const { getContainingDirectory } = require('./utils');

/*
{
    "name": "Index.txt",
    "path": ["index"],
    "in_trash": false,
    "meta": {
        "size": 3223123,
        "type": "text",
        "lastModified": "2021-04-13T13:32:49.142Z"
    },
    "share": {
        "mode": "none",
        "permissions": "read"
    },
    "user": "admin"
}
*/


const upload = async (req, res, next) => {
    const {files , user} = req;
    const pageID = req.query.PGID;

    console.log(files);

    for(const file of files){
        const originalname = file.originalname.split('/');
        const name = originalname.pop();
        const containingDirectory = await getContainingDirectory(pageID);

        const fileJson = {
            name,
            path: [
                'index',
                ...pageID !== 'my-drive' ? containingDirectory.split('/') : [],
                ...originalname
            ],
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
    
        const fileResult = await fileUpload(fileJson);
        console.log(fileResult);
    }
    res.json({files: files})
    
};

module.exports = { upload }