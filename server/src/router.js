const {
    Router
} = require('express');
const checkDiskSpace = require('check-disk-space').default

const Files = require('./models/files');
const Directories = require('./models/directories');

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        const pageID = req.query.pageID === 'my-drive' ? 0 : req.query.pageID;

        const files = await Files.find({'dir_id': pageID});
        const dirs = await Directories.find({'dir_id': pageID});

        res.json({
            files,
            dirs
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

router.post('/file_upload', async (req, res, next) => {
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
});

router.post('/create_directory', async (req, res, next) => {
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
});

module.exports = router;