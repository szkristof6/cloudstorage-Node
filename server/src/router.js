const {Router} = require('express');
const checkDiskSpace = require('check-disk-space').default
const multer = require('multer');
const path = require('path');

const Files = require('./models/files');
const Directories = require('./models/directories');

const { upload } = require('./functions/upload');

const router = Router();
const uploadPath = path.resolve("../data");

const getURLsForPaths = async (path) => {
    if (path.length > 0) {
        const paths = [...path.path];
        const temp = [];

        paths.forEach((_, index) => {
            const a = [];
            for (let i = 0; i < index + 1; i++) {
                a.push(paths[i]);
            }
            temp.push(a)
        });

        temp.shift();

        if (temp.length > 0) {
            const returnArray = [];
            for (let i of temp) {
                const name = i.pop();

                const url = await Directories.find({
                    path: i,
                    name
                }, '_id name');
                returnArray.push(url);
            }
            return returnArray;
        } else {
            return temp;
        }
    }
    return [];
};

router.get('/', async (req, res, next) => {
    try {
        const pageID = req.query.pageID === 'my-drive' ? 0 : req.query.pageID;
        const { username } = req.user;

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
        
        const currentDirectory = pageID !== 0 ? [[{
            _id: dir._id,
            name: dir.name
        }]] : [];

        res.json({
            queryItems: {
                files,
                dirs
            },
            queryData: [
                [{
                    _id: 0,
                    name: 'Saját mappa'
                }],
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
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },

    filename: (req, file, cb) => {
        cb(null, file.fieldname + path.extname(file.originalname));
    }
});

const uploadHandler = multer({ storage: storage });

router.post('/upload', uploadHandler.array("files"), upload)

module.exports = router;