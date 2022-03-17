const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const Recaptcha = require('express-recaptcha').RecaptchaV2;

require('dotenv').config();

const middlewares = require('./middlewares');
const router = require('./router');

const { login, register } = require('./functions/userMethods');

const { requireAuth, attachUser } = require('./middlewares');

const app = express();

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const recaptcha = new Recaptcha(process.env.SITE_KEY, process.env.PRIVATE_KEY);

app.use(morgan('common'));
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  }),
);
app.use(express.json());

app.post('/register', recaptcha.middleware.verify, register);
app.post('/login', recaptcha.middleware.verify, login);

app.use(cookieParser());
app.use(attachUser);
app.use(requireAuth);

app.use('/api', router);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

const PORT = process.env.PORT || 1337;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
