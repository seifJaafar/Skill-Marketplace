const UpdateQuestionValidate = require("../validators/UpdateQuestion");
const ExpressError = require("../utils/ExpressError")

const validateUpdateQuestion = (req, res, next) => {
    const { error } = UpdateQuestionValidate.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    }
    next();
}
module.exports = { validateUpdateQuestion }