const Files = require('../models/files');
const Directories = require('../models/directories');

const replace = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    if (to.type === 'file') {
      res.json({ message: 'Some error occurred' });
      return false;
    }

    /*
    path and dir_id update

    If FILE:
    from.path = [to.path, to.name]
    from.dir_id = to.dir_id

    If FOLDER:
    FILE + all inner files and folders have to be updated
    ONLY the first file has to be updated none of the others

    */

    const toQuery = await Directories.findOne({
      _id: to.id,
    })
      .lean()
      .select('_id path name');

    if (from.type === 'file') {
      const update = await Files.updateOne(
        {
          _id: from.id,
        },
        {
          path: [...toQuery.path, toQuery.name],
          dir_id: toQuery._id,
        }
      ).lean();

      res.json(update);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { replace };
