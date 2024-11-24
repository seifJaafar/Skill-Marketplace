const addUserValidation = require("../validators/addUser");
const ExpressError = require("../utils/ExpressError")

const validateSignUp = (req, res, next) => {
    const { error } = addUserValidation.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    }
    next();
}
module.exports = { validateSignUp }