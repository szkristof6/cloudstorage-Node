const { Router } = require('express');
const checkDiskSpace = require('check-disk-space').default

const Files = require('./models/files');
const Directories = require('./models/directories');

const { createDirectory } = require('./functions/directory');
const { fileUpload } = require('./functions/file');

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        const pageID = req.query.pageID === 'my-drive' ? 0 : req.query.pageID;

        const files = await Files.find(
            {'dir_id': pageID},
            '_id in_trash name',
            (_, {_id, in_trash, name}) => ({_id, in_trash, name}));

        const dirs = await Directories.find(
            {'dir_id': pageID},
            '_id in_trash name',
            (_, {_id, in_trash, name}) => ({_id, in_trash, name}));

        const dir = pageID !== 0 ? await Directories.find(
                {'dir_id': pageID},
                'path',
                (_, {path}) => ({path}))
            : [{'path': ['Saját mappa']}];

        res.json({
            'queryItems': {
                files,
                dirs
            },
            'queryData': dir
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