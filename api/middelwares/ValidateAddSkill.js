const addSkillValidate = require("../validators/addSkill");
const ExpressError = require("../utils/ExpressError")

const validateSkill = (req, res, next) => {
    const { error } = addSkillValidate.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    }
    next();
}
module.exports = { validateSkill }