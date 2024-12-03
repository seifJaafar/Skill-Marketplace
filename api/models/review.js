const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReviewSchema = new Schema({
  reviewer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reviewee: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
  rating: { type: Number, required: true, min: 1, max: 5 }, 
  comment: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now } 
});

const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;
