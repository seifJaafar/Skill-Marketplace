
const User = require('../models/User');
const roleAuthorize = (roles) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return async (req, res, next) => {
     
        const { sub } = req.user;

        try {
            const user = await User.findById(sub);
            if (!user || !roles.includes(user.role)) {
                return res.status(403).json({ message: 'Unauthorized' });
            }
            req.user.role = user.role;
            next();
        } catch (error) {
            next(error)
        }
    };
};

module.exports = roleAuthorize;