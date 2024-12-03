const updateSkillPostValidate = require("../validators/validateUpdateSkillPost");
const ExpressError = require("../utils/ExpressError")

const validateUpdateSkillPost = (req, res, next) => {
    const { error } = updateSkillPostValidate.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    }
    next();
}
module.exports = { validateUpdateSkillPost }