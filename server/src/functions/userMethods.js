const requestIP = require("request-ip");
const jwtDecode = require("jwt-decode");
const UserData = require("../models/userData");

const {
  RegisterSchema,
  LoginSchema,
  createToken,
  hashPassword,
  verifyPassword,
} = require("./utils");

const login = async (req, res, next) => {
  try {
    if (req.recaptcha.error) {
      return res.status(403).json({ message: req.recaptcha.error });
    }

    const Validation = await LoginSchema.isValid(req.body);
    if (!Validation) {
      return res.status(403).json({ message: "Nincs minden mező kitöltve!" });
    }

    const { username, password } = req.body;
    const user = await UserData.findOne({
      username,
    }).lean();

    if (!user) {
      return res
        .status(403)
        .json({ message: "Rossz felhasználónév vagy jelszó" });
    }

    const passwordValid = await verifyPassword(password, user.password);

    if (passwordValid) {
      const { password, ...rest } = user;
      const userInfo = { ...rest };

      const token = createToken(userInfo, requestIP.getClientIp(req));
      const decodedToken = jwtDecode(token);
      const expiresAt = decodedToken.exp;

      res.cookie("TKN", token, {
        httpOnly: true,
        secure: true,
      });

      res.cookie("EXPAT", expiresAt, {
        secure: true,
      });

      return res.json({
        message: "Sikeres belépés!",
        token,
        userInfo,
        expiresAt,
      });
    }
    return res
      .status(403)
      .json({ message: "Rossz felhasználónév vagy jelszó" });
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(422);
    }
    next(error);
  }
};

/*
 * id - Uuid
 * email - Email
 * username - Text
 * password - Hash
 * role - Text
 * active - Boolean
 * login_ip - IPv4
 * created_at - DateTime
 * modified_at - DateTime
 */

const register = async (req, res, next) => {
  try {
    if (req.recaptcha.error) {
      return res.status(403).json({ message: req.recaptcha.error });
    }

    const Validation = await RegisterSchema.isValid(req.body);
    if (!Validation) {
      return res.status(403).json({ message: "Nincs minden mező kitöltve!" });
    }

    const { email, username, password } = req.body;

    const encryptedPassword = await hashPassword(password);
    const user = {
      email: email.toLowerCase(),
      username,
      password: encryptedPassword,
      role: "user",
      active: true,
      login_ip: requestIP.getClientIp(req),
    };

    /* const existingUser = await UserData.findOne({
            email: user.email
        }).lean();

        if(existingUser) {
            return res
            .status(400)
            .json({ message: 'Már létezik ez a fiók' });
        } */

    const newUser = new UserData(user);
    const savedUser = await newUser.save();

    if (savedUser) {
      const token = createToken(savedUser);
      const decodedToken = jwtDecode(token);
      const expiresAt = decodedToken.exp;

      res.cookie("TKN", token, {
        httpOnly: true,
      });

      res.cookie("EXPAT", expiresAt, {
        secure: true,
      });

      return res.json({
        message: "User sikeresen létrehozva!",
        token,
        userInfo: {
          username: savedUser.username,
          email: savedUser.email,
          role: savedUser.role,
          active: savedUser.active,
        },
        expiresAt,
      });
    }
    return res.status(400).json({ message: "Valami probléma történt" });
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(422);
    }
    next(error);
  }
};

module.exports = {
  login,
  register,
};
