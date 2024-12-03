import axios from '../custom/axios';
import { toast } from 'react-hot-toast';

export const GetReviewsByUser = async (userId) => {
    try {
        const response = await axios.get(`/review/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching reviews by user:", error);
        toast.error("Failed to fetch reviews.");
    }
}
export const addReview = async (review) => {
    try {
        const response = await axios.post(`/review`, review);
        toast.success("Review added successfully.");
        return response.data;
    } catch (error) {
        console.error("Error adding review:", error);
        toast.error("Failed to add review.");
    }
}
export const deleteReview = async (reviewId) => {
    try {
        const response = await axios.delete(`/review/${reviewId}`);
        toast.success("Review deleted successfully.");
        return response.data;
    } catch (error) {
        console.error("Error deleting review:", error);
        toast.error("Failed to delete review.");
    }
}
export const updateReview = async (reviewId, review) => {
    try {
        const response = await axios.patch(`/review/${reviewId}`, review);
        toast.success("Review updated successfully.");
        return response.data;
    } catch (error) {
        console.error("Error updating review:", error);
        toast.error("Failed to update review.");
    }
}