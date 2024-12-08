const mongoose = require("mongoose")

const FileSchema = new mongoose.Schema({
    title: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String, enum: ['PDF', 'Video'], required: true },
    order: { type: Number, required: true, min: 1, max: 10 }
})
FileSchema.index({ url: 1, title: 1 }, { unique: true });
const File = mongoose.model("File", FileSchema)
module.exports = File