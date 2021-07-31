const Files = require('../models/files');
const Directories = require('../models/directories');

const iconByFormat = require('../formats');

const findUpperDir = async (path) => {
  if (path === 'index') return 0;
  const folder = path.pop();

  //console.log(`path: ${path}, folder: ${folder}`);

  const query = await Directories.findOne({
    path,
    name: folder,
  })
    .lean()
    .select('_id');

  return query ? query._id : 0;
};

const fileUpload = async (file) => {
  try {
    //console.log(file.path);

    const query = await Files.findOne({
      name: file.name,
      path: file.path,
    }).lean();

    if (query) return false;

    const dir_id = await findUpperDir(file.path);
    const icon = iconByFormat(file);

    //console.log(dir_id, 'dir_id');

    file.meta = { ...file.meta, ...icon };

    const fileEntry = new Files({
      ...file,
      dir_id,
    });

    const createdEntry = await fileEntry.save();
    //console.log(file);

    return createdEntry;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  fileUpload,
};
