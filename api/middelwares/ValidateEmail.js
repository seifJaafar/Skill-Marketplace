const EmailValidate = require("../validators/EmailValidate");
const ExpressError = require("../utils/ExpressError")

const validateEmail = (req, res, next) => {
    const { error } = EmailValidate.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    }
    next();
}
module.exports = { validateEmail }