const jwt = require("jsonwebtoken");

const generateToken = (id, accountType) => {
    return jwt.sign({id, accountType}, process.env.JWT_SECRET, { // include account type in token payload
        expiresIn: '30d',
    });
};

module.exports = generateToken;