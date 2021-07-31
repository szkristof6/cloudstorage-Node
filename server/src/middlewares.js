const jwt = require('express-jwt');
const jwtDecode = require('jwt-decode');

const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (error, req, res, next) => {
  if (error.name === 'UnauthorizedError') {
    res.status(401).json({ message: 'invalid token...' });
  }
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? '' : error.stack,
  });
};

const requireAuth = jwt({
  secret: process.env.JWT_SECRET,
  audience: 'api.cloud.szkt',
  issuer: 'api.cloud.szkt',
  algorithms: ['HS256'],
  getToken: (req) => req.cookies.TKN,
});

const attachUser = (req, res, next) => {
  const token = req.cookies.TKN;
  if (!token) return res.status(401).json({ message: 'Hibás token' });

  const decodedToken = jwtDecode(token);
  if (!decodedToken) {
    return res
      .status(401)
      .json({ message: 'Hiba történt a token hitelesítése közben' });
  }
  req.user = decodedToken;
  next();
};

module.exports = {
  notFound,
  errorHandler,
  requireAuth,
  attachUser,
};
