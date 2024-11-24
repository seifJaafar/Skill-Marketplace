const Skill = require('../models/skill');
const ExpressError = require('../utils/ExpressError');
const apiJson = require('../utils/apiJson');

exports.getAll = async (req, res, next) => {
    try {
        const skills = await Skill.find();
        const data = { skills };
        apiJson({ req, res, data, model: Skill });
    } catch (error) {
        next(error)
    }
}
exports.create = async (req, res, next) => {
    try {
        const skill = await new Skill(req.body);
        await skill.save();
        const data = { skill };
        return apiJson({ req, res, data, model: Skill });
    } catch (error) {
        next(error)
    }
}
exports.delete = async (req, res, next) => {
    try {
        const { id } = req.params;
        const skill = await Skill.findByIdAndDelete(id);
        if (!skill) {
            const msg = "Skill not found";
            throw new ExpressError(msg, 400);
        }
        const data = { skill };
        return apiJson({ req, res, data, model: Skill });
    } catch (error) {
        next(error)
    }
}
exports.update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const skill = await Skill.findByIdAndUpdate(id, req.body)
        if (!skill) {
            const msg = "Skill not found";
            throw new ExpressError(msg, 400);
        }
        const data = { skill };
        return apiJson({ req, res, data, model: Skill });
    } catch (error) {
        next(error)
    }
}
