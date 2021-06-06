const {
    Router
} = require('express');

const Files = require('./models/files');
const Directories = require('./models/directories');

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        const files = await Files.find();

        res.json(files);
    } catch (error) {
        next(error);
    }
});

router.post('/file_upload', async (req, res, next) => {
    try {
        const path = [...req.body.path];
        const folder = path.pop();

        const query = await Directories.find({
            'path': path,
            'name': folder,
        }, '_id', (_, dir) => {
            return dir._id;
        });

        const dir_id = query[0] !== undefined ? query[0]._id : 0;

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
        const directoryEntry = new Directories(req.body);
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