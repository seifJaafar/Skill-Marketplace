const Review = require('../models/review');
const mongoose = require('mongoose');
const apiJson = require('../utils/apiJson');

exports.addReview = async (req, res) => {
    try {
        let { reviewee, rating, comment } = req.body;

        const reviewer = req.user.sub;
        reviewee = new mongoose.Types.ObjectId(reviewee);
        const newReview = new Review({
            reviewer,
            reviewee,
            rating,
            comment
        });
        await newReview.save();
        await newReview.populate('reviewer');

        res.status(200).json({
            message: 'Review added successfully',
            review: newReview,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Server error' });
    }
}
exports.updateReview = async (req, res) => {
    try {
        const reviewId = req.params.id;
        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        if (review.reviewer.toString() !== req.user.sub && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        const { rating, comment } = req.body;
        review.rating = rating;
        review.comment = comment;
        await review.save();
        res.status(200).json({ message: 'Review updated successfully', review });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Server error' });
    }
}
exports.deleteReview = async (req, res) => {
    try {
        const reviewId = req.params.id;
        const review = await Review.findById(reviewId).populate('reviewer');
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        if (review.reviewer._id.toString() !== req.user.sub && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        await Review.findByIdAndDelete(reviewId);
        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Server error' });
    }
}
exports.getReviewsByReviewee = async (req, res) => {
    try {
        let reviewee = req.params.id;
        reviewee = new mongoose.Types.ObjectId(reviewee);
        const reviews = await Review.find({ reviewee }).populate('reviewer', 'username').sort({ createdAt: -1 });
        res.status(200).json({
            reviews: reviews
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Server error' });
    }
}