const mongoose = require("mongoose")

const ChapterSchema = new mongoose.Schema({
    title: { type: String, required: true },
    files: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File', required: true }], validate: {
            validator: function (v) {
                return v.length <= 10; // Limit to 10 files (adjust as needed)
            },
            message: props => `A chapter can only have a maximum of 10 files. You have ${props.value.length} files.`
        }
    },
    previousChapter: { type: mongoose.Schema.Types.ObjectId, ref: "Chapter", default: null }
});
ChapterSchema.index({ title: 1, files: 1 }, { unique: true });

const Chapter = mongoose.model("Chapter", ChapterSchema)
module.exports = Chapter