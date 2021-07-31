const Directories = require('../models/directories');
const { patch } = require('../router');

const findUpperDir = async (path) => {
  const name = path.pop();

  console.log('path:', path, 'name:', name);

  if (path.length === 0) return 0;

  const query = await Directories.findOne({
    path,
    name,
  })
    .lean()
    .select('_id');

  return query ? query._id : 0;
};

const updateDirID = async (path, id) => {
  const dirID = await findUpperDir(path);
  if (dirID === 0) return false;
  try {
    const update = await Directories.updateOne(
      {
        _id: id,
      },
      {
        dir_id: dirID,
      }
    ).lean();
    return update || false;
  } catch (error) {
    throw new Error(error);
  }
};

/*
{
  "name": "neked",
  "path": [
      "index",
      "tessek"
  ],
  "in_trash": false,
  "share": {
      "mode": "none",
      "permissions": "read"
  },
  "user": "admin"
}
[
  { name: 'Fasor szalagavató 2021', path: [] },
  { name: 'C', path: [ 'Fasor szalagavató 2021' ] },
  {
    name: 'Szalagtűzős zenék 12.b',
    path: [ 'Fasor szalagavató 2021', 'C' ]
  }
]

*/

const createDirectory = async (dirs, user, containingDirectory) => {
  const directoryResult = await Promise.allSettled(
    dirs.map(async (dir) => {
      console.log(dir, 'adott mappanév');
      if (dir === null) return false;
      try {
        const path = [
          'index',
          ...(containingDirectory ? containingDirectory.split('/') : []),
          ...dir,
        ];
        const name = path.pop();

        console.log(path, name);

        const query = await Directories.findOne({
          name,
          path,
        }).lean();

        // console.log(query, 'dir query');

        if (query) {
          console.log('*-*');
          return false;
        }

        const dirJson = {
          name,
          path,
          dir_id: 0,
          in_trash: false,
          share: {
            mode: 'none',
            permissions: 'read',
          },
          user,
        };

        // console.log(dirJson);

        const directoryEntry = new Directories(dirJson);
        const createdEntry = await directoryEntry.save();

        const dir_id =
          dir.length > 0 && (await updateDirID(path, createdEntry._id));

        return createdEntry;
      } catch (error) {
        throw new Error(error);
      }
    })
  );

  // console.log(directoryResult);

  return directoryResult;
};

module.exports = {
  createDirectory,
};
