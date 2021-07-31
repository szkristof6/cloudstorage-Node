const { createDirectory } = require('./directory');
const { fileUpload } = require('./file');
const { getContainingDirectory, getAllPath } = require('./utils');

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
  const { files, user } = req;
  const pageID = req.query.PGID;

  // console.log(files.map((file) => file.originalname));

  const paths = getAllPath(
    files
      .map((file) => {
        const combinedFilename = file.originalname.split('/');
        if (combinedFilename.length === 1) return null;
        return combinedFilename
          .splice(0, combinedFilename.length - 1)
          .join('/');
      })
      .filter((v, i, a) => a.indexOf(v) === i)
      .map((file) => {
        if (file === null) return null;
        return file.split('/');
      }),
  );

  // console.log(paths, '_allpaths');

  const containingDirectory = pageID !== 'my-drive' && (await getContainingDirectory(pageID));

  const folderResult = paths && (await createDirectory(paths, user.username, containingDirectory));

  const fileResult = await Promise.all(
    files.map(async (file) => {
      const originalname = file.originalname.split('/');
      const name = originalname.pop();

      const fileJson = {
        name,
        path: [
          'index',
          ...(pageID !== 'my-drive' ? containingDirectory.split('/') : []),
          ...originalname,
        ],
        in_trash: false,
        meta: {
          size: file.size,
          type: file.mimetype,
          lastModified: Date.now(),
        },
        share: {
          mode: 'none',
          permissions: 'read',
        },
        user: user.username,
      };

      const result = await fileUpload(fileJson);
      return result;
    }),
  );
  res.json({ files, folderResult, fileResult });
};

module.exports = { upload };
