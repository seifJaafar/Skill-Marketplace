const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;
const authorize = (roles = []) => {

    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [

        (req, res, next) => {
            const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
            if (!token) {
                return res.send({ message: 'token required' });
            }

            jwt.verify(token, SECRET_KEY, (err, decoded) => {
                if (err) {
                    return res.send({ message: 'token invalid' });
                }

                req.user = decoded;
                next();
            });
        }
    ];
};

module.exports = authorize;