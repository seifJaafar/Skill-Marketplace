const addSkillPostValidate = require("../validators/addSkillPost");
const ExpressError = require("../utils/ExpressError")

const validateSkillPost = (req, res, next) => {
    const { error } = addSkillPostValidate.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    }
    next();
}
module.exports = { validateSkillPost }