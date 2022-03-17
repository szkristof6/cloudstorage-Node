const Yup = require('yup');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Directories = require('../models/directories');

const RegisterSchema = Yup.object().shape({
  email: Yup.string().email().required('Add meg az email címedet'),
  username: Yup.string().required('Add meg a felhasználóneved!'),
  password: Yup.string().required('Add meg a jelszavad!'),
});

const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Add meg a felhasználóneved!'),
  password: Yup.string().required('Add meg a jelszavad!'),
});

const createToken = (user, ipAddress) => {
  // Sign the JWT
  if (!user.role) {
    throw new Error('No user role specified');
  }
  return jwt.sign(
    {
      sub: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      ipAddress,
      iss: 'api.cloud.szkt',
      aud: 'api.cloud.szkt',
    },
    process.env.JWT_SECRET,
    {
      algorithm: 'HS256',
      expiresIn: '1h',
    },
  );
};

const hashPassword = async (password) => {
  // Generate a salt at level 12 strength
  try {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error(error);
  }
};

const verifyPassword = (passwordAttempt, hashedPassword) =>
  bcrypt.compare(passwordAttempt, hashedPassword);

const getPaths = (paths) => {
  if (paths.length > 0) {
    const result = paths.map((_, index) => {
      const a = [];
      for (let i = 0; i < index + 1; i++) {
        a.push(paths[i]);
      }
      return a;
    });

    return result;
  }
  return [];
};

const getAllPath = (paths) => {
  if (paths[0] === null) return false;

  const result = paths.map((path) => {
    if (path === null) return false;
    return getPaths(path);
  });

  return result[0];
};

const getContainingDirectory = async (id) => {
  const { path, name } = await Directories.findOne({
    _id: id,
  })
    .lean()
    .select('path name');

  path.shift();

  return [...path, name].join('/');
};

module.exports = {
  RegisterSchema,
  LoginSchema,
  createToken,
  hashPassword,
  verifyPassword,
  getPaths,
  getAllPath,
  getContainingDirectory,
};
