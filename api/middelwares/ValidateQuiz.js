const QuizValidate = require("../validators/QuizValidate");
const ExpressError = require("../utils/ExpressError")

const validateQuiz = (req, res, next) => {
    const { error } = QuizValidate.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    }
    next();
}
module.exports = { validateQuiz }