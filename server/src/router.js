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
            '_id in_trash name meta',
            (error, _) => { if (error) next(error) });

        const dirs = await Directories.find(
            {'dir_id': pageID},
            '_id in_trash name',
            (error, _) => { if (error) next(error) });

        const dir = pageID !== 0 ? await Directories.find(
                {'dir_id': pageID},
                'path',
                (error, _) => { if (error) next(error) })
            : [{'path': ['Saját mappa']}];

        res.json({
            'queryItems': {
                files: files.filter(x => !x.in_trash),
                dirs: dirs.filter(x => !x.in_trash)
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