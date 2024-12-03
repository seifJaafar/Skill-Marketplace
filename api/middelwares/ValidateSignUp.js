const signupValidation = require("../validators/SignupValidation");
const ExpressError = require("../utils/ExpressError")

const validateSignUp = (req, res, next) => {
    const { error } = signupValidation.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    }
    next();
}
module.exports = { validateSignUp }