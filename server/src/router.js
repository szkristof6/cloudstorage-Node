const {
    Router
} = require('express');
const checkDiskSpace = require('check-disk-space').default

const Files = require('./models/files');
const Directories = require('./models/directories');

const {
    createDirectory
} = require('./functions/directory');
const {
    fileUpload
} = require('./functions/file');

const router = Router();

const getURLsForPaths = async (path) => {
    if (path.length > 0) {
        const paths = [...path[0].path];
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
                    'path': i,
                    'name': name
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

        const files = await Files.find({
                'dir_id': pageID
            },
            '_id in_trash name meta',
            (error, _) => {
                if (error) next(error)
            });

        const dirs = await Directories.find({
                'dir_id': pageID
            },
            '_id in_trash name',
            (error, _) => {
                if (error) next(error)
            });

        const dir = pageID !== 0 ? await Directories.find({
                '_id': pageID
            },
            'path name',
            (error, _) => {
                if (error) next(error)
            }) : [];

        const URLs = await getURLsForPaths(dir);
        
        const currentDirectory = pageID !== 0 ? [[{
            '_id': dir[0]._id,
            'name': dir[0].name
        }]] : [];

        res.json({
            'queryItems': {
                files: files.filter(x => !x.in_trash),
                dirs: dirs.filter(x => !x.in_trash)
            },
            'queryData': [
                [{
                    '_id': 0,
                    'name': 'Saját mappa'
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
    const path = 'C:/Users/SzKt/OneDrive/Dokumentumok/Projects/Node.JS/cloudstorage/data';
    try {
        const diskContent = await checkDiskSpace(path);
        res.json({
            size: diskContent.size,
            remaining: diskContent.size - diskContent.free,
        });
    } catch (error) {
        next(error);
    }
})

router.post('/file_upload', fileUpload);
router.post('/create_directory', createDirectory);

module.exports = router;