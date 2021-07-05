const Yup = require('yup');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const RegisterSchema = Yup.object().shape({
    email: Yup.string().email().required('Add meg az email címedet'),
    username: Yup.string().required('Add meg a felhasználóneved!'),
    password: Yup.string().required('Add meg a jelszavad!'),
});

const LoginSchema = Yup.object().shape({
    username: Yup.string().required('Add meg a felhasználóneved!'),
    password: Yup.string().required('Add meg a jelszavad!'),
});

const createToken = user => {
    // Sign the JWT
    if (!user.role) {
        throw new Error('No user role specified');
    }
    return jwt.sign({
            sub: user._id,
            email: user.email,
            role: user.role,
            iss: 'api.orbit',
            aud: 'api.orbit'
        },
        process.env.JWT_SECRET, {
            algorithm: 'HS256',
            expiresIn: '1h'
        }
    );
};

const hashPassword = async (password) => {
    // Generate a salt at level 12 strength
    try {
        const salt = await bcrypt.genSalt(12);
        return bcrypt.hash(password, salt);
    } catch (error) {
        throw new Error(error);
    };
  };
  
  const verifyPassword = (
    passwordAttempt,
    hashedPassword
  ) => {
    return bcrypt.compare(passwordAttempt, hashedPassword);
  };

module.exports = {
    RegisterSchema,
    LoginSchema,
    createToken,
    hashPassword,
    verifyPassword
}