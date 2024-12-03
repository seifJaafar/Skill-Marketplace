const addQuestionValidate = require("../validators/addQuestion");
const ExpressError = require("../utils/ExpressError")

const validateQuestion = (req, res, next) => {
    const { error } = addQuestionValidate.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    }
    next();
}
module.exports = { validateQuestion }