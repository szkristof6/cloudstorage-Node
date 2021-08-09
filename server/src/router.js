const { Router } = require('express');
const checkDiskSpace = require('check-disk-space').default;
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const Files = require('./models/files');
const Directories = require('./models/directories');

const { getPaths, getContainingDirectory } = require('./functions/utils');

const { upload } = require('./functions/upload');

const router = Router();
const uploadPath = path.resolve('../data');

const getURLsForPaths = async (path) => {
  if (!Array.isArray(path)) {
    if (path.path.length > 0) {
      const paths = [...path.path];

      const temp = getPaths(paths);

      temp.shift();

      if (temp.length > 0) {
        const returnArray = await Promise.all(
          temp.map(async (i) => {
            const name = i.pop();

            const url = await Directories.findOne({
              path: i,
              name,
            })
              .lean()
              .select('_id name');

            return url;
          }),
        );
        return returnArray;
      }
      return temp;
    }
  }
  return [];
};

const getQueryParams = (request) => {
  const { username } = request.user;

  const trashQuery = {
    user: username,
    in_trash: true,
  };

  const sharedQuery = {
    'share.mode': 'share',
    user: username,
    in_trash: false,
  };

  if (request.query.PGID === 'trash') return trashQuery;
  if (request.query.PGID === 'shared') return sharedQuery;

  const pageID = request.query.PGID === 'my-drive' ? 0 : request.query.PGID;

  const normalQuery = {
    dir_id: pageID,
    user: username,
    in_trash: false,
  };

  return normalQuery;
};

router.get('/', async (req, res, next) => {
  try {
    const pageID = ['my-drive', 'trash', 'shared'].includes(req.query.PGID) ? 0 : req.query.PGID;

    const files = await Files.find(getQueryParams(req))
      .lean()
      .select('_id in_trash name meta user createdAt updatedAt');

    const dirs = await Directories.find(getQueryParams(req))
      .lean()
      .select('_id in_trash name user createdAt updatedAt');

    const queryItems = {
      files,
      dirs,
    };

    const dir = pageID !== 0
      ? await Directories.findOne({
        _id: pageID,
      })
        .lean()
        .select('path name')
      : [];

    const URLs = await getURLsForPaths(dir);

    const currentDirectory = pageID !== 0
      ? [
        {
          _id: dir._id,
          name: dir.name,
        },
      ]
      : [];

    res.json({
      queryItems,
      queryData:
      ['trash', 'shared'].includes(req.query.PGID)
        ? [
          {
            _id: 0,
            name: `${req.query.PGID === 'trash' ? 'Saját mappa kukaja' : 'Megosztottak'}`,
          },
        ]
        : [
          {
            _id: 0,
            name: 'Saját mappa',
          },
          ...URLs,
          ...currentDirectory,
        ],
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

      const dirs = getPaths([
        ...(pageID !== 'my-drive' ? containingDir.split('/') : []),
        ...dirSplit,
      ]).map((x) => x.join('/'));

      dirs.forEach((dir) => {
        if (!fs.existsSync(path.resolve(uploadPath, dir))) {
          fs.mkdirSync(path.resolve(uploadPath, dir));
        }
      });

      const destination = path.resolve(uploadPath, containingDir);
      // console.log(`${destination}/${file.originalname}`)

      cb(null, destination);
    }
  },

  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadHandler = multer({
  storage,
  preservePath: true,
});

router.post('/upload', uploadHandler.array('files'), upload);

router.get('/deleteDB', async (req, res, next) => {
  try {
    const dirQuery = await Directories.deleteMany().lean();
    const fileQuery = await Files.deleteMany().lean();

    res.json({
      dirQuery,
      fileQuery,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
