const mongoose = require("mongoose")

const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    skillTags: [{ type: String }],
    price: { type: Number, required: true },
    skillExpert: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chapter" }],
    thumbnail: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    usersEnrolled: { type: Number, default: 0 }
})
CourseSchema.index({ title: 1, skillExpert: 1 }, { unique: true });
const Course = mongoose.model("Course", CourseSchema)
module.exports = Course