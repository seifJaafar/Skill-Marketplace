const addReview = require("../validators/addReview");
const ExpressError = require("../utils/ExpressError")

const validateReview = (req, res, next) => {
    const { error } = addReview.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        console.log(msg)
        throw new ExpressError(msg, 400)
    }
    next();
}
module.exports = { validateReview }