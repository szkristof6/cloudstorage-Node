const UserData = require('../models/userData');
const requestIP = require('request-ip');
const jwtDecode = require('jwt-decode');

const {
    RegisterSchema,
    LoginSchema,
    createToken,
    hashPassword,
    verifyPassword
} = require('./utils');

const login = async (req, res, next) => {
    try {
        const Validiation = await LoginSchema.isValid(req.body);
        if(!Validiation){
            return res
            .status(403)
            .json({ message: 'Nincs minden mező kitöltve!' });
        };

        const {username, password} = req.body;
        const user = await UserData.findOne({
            username,
        }).lean();

        if(!user){
            return res
            .status(403)
            .json({ message: 'Rossz felhasználónév vagy jelszó' });
        }

        const passwordValid = await verifyPassword(
            password,
            user.password
          );

        if(passwordValid){
            const { password, ...rest } = user;
            const userInfo = Object.assign({}, { ...rest });

            const token = createToken(userInfo);
            const decodedToken = jwtDecode(token);
            const expiresAt = decodedToken.exp;

            return res.json({
                message: 'Sikeres belépés!',
                token,
                userInfo,
                expiresAt
            });
        } else {
            return res
            .status(403)
            .json({ message: 'Rossz felhasználónév vagy jelszó' });
        }

        res.json(user)
    } catch (error) {
        if (error.name === 'ValidationError') {
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
        const Validiation = await RegisterSchema.isValid(req.body);
        if(!Validiation){
            return res
            .status(403)
            .json({ message: 'Nincs minden mező kitöltve!' });
        }

        const { email, username, password } = req.body;

        const encryptedPassword = await hashPassword(password);
        const user = {
            email: email.toLowerCase(),
            username,
            password: encryptedPassword,
            role: 'user',
            active: true,
            login_ip: requestIP.getClientIp(req)
        };

        const existingUser = await UserData.findOne({
            email: user.email
        }).lean();

        if(existingUser) {
            return res
            .status(400)
            .json({ message: 'Már létezik ez a fiók' });
        }

        const newUser = new UserData(user);
        const savedUser = await newUser.save();

        if(savedUser) {
            const token = createToken(savedUser);
            const decodedToken = jwtDecode(token);
            const expiresAt = decodedToken.exp; 

            return res.json({
                message: 'User sikeresen létrehozva!',
                token,
                user: {
                    username: savedUser.username,
                    email: savedUser.email,
                    role: savedUser.role,
                    active: savedUser.active
                },
                expiresAt
            });
        } else {
            return res
            .status(400)
            .json({ message: 'Valami probléma történt' });
        }

    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(422);
        }
        next(error);
    }
};

module.exports = {
    login,
    register
};