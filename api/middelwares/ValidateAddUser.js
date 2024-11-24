const SignUpValidation = require("../validators/SignupValidation");
const ExpressError = require("../utils/ExpressError")

const validateaddUser = (req, res, next) => {
    const { error } = SignUpValidation.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    }
    next();
}
module.exports = { validateaddUser }