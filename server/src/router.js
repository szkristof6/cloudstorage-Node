const {
    Router
} = require('express');
const checkDiskSpace = require('check-disk-space').default
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const Files = require('./models/files');
const Directories = require('./models/directories');

const {
    getPaths,
    getContainingDirectory
} = require('./functions/utils');

const {
    upload
} = require('./functions/upload');

const router = Router();
const uploadPath = path.resolve("../data");

const getURLsForPaths = async (path) => {
    if (!Array.isArray(path)) {
        if (path.path.length > 0) {
            const paths = [...path.path];

            const temp = getPaths(paths);

            temp.shift();

            if (temp.length > 0) {
                const returnArray = [];
                for (let i of temp) {
                    const name = i.pop();


                    const url = await Directories.findOne({
                            path: i,
                            name
                        })
                        .lean()
                        .select('_id name');

                    returnArray.push(url);
                }
                return returnArray;
            }
            return temp;
        }
    }
    return [];
};

router.get('/', async (req, res, next) => {
    try {
        const pageID = req.query.PGID === 'my-drive' ? 0 : req.query.PGID;
        const {
            username
        } = req.user;

        const files = await Files.find({
                dir_id: pageID,
                user: username,
                in_trash: false
            })
            .lean()
            .select('_id in_trash name meta user createdAt updatedAt');

        const dirs = await Directories.find({
                dir_id: pageID,
                user: username,
                in_trash: false
            })
            .lean()
            .select('_id in_trash name user createdAt updatedAt');


        const dir = pageID !== 0 ? await Directories.findOne({
                _id: pageID
            })
            .lean()
            .select('path name') : [];

        const URLs = await getURLsForPaths(dir);

        const currentDirectory = pageID !== 0 ? [{
            _id: dir._id,
            name: dir.name
        }] : [];

        res.json({
            queryItems: {
                files,
                dirs
            },
            queryData: [{
                    _id: 0,
                    name: 'Saját mappa'
                },
                ...URLs,
                ...currentDirectory
            ]
        });
    } catch (error) {
        next(error);
    }
});

router.get('/getStorage', async (req, res, next) => {
    try {
        const diskContent = await checkDiskSpace(uploadPath);
        res.json({
            size: diskContent.size,
            remaining: diskContent.size - diskContent.free,
        });
    } catch (error) {
        next(error);
    }
});

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const folderExec = new RegExp('^(.*)/([^/]+)$').exec(file.originalname);
        const pageID = req.query.PGID;

        if (!folderExec && pageID === 'my-drive') {
            cb(null, uploadPath);
        } else {
            const containingDir = pageID !== 'my-drive' ? await getContainingDirectory(pageID) : '';

            const dirSplit = folderExec ? folderExec[1].split('/') : [];

            const dirs = getPaths([...pageID !== 'my-drive' ? containingDir.split('/') : [], ...dirSplit]).map(x => x.join('/'));

            dirs.map(dir => {
                if (!fs.existsSync(path.resolve(uploadPath, dir))) {
                    fs.mkdirSync(path.resolve(uploadPath, dir));
                }
            });

            const destination = path.resolve(uploadPath, containingDir);
            //console.log(`${destination}/${file.originalname}`)

            cb(null, destination);

        }
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});


const uploadHandler = multer({
    storage: storage,
    preservePath: true,
});

router.post('/upload', uploadHandler.array('files'), upload)

module.exports = router;