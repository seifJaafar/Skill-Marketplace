import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { getUserById } from '../../actions/user.action';
import { Button } from 'primereact/button';
import { GetReviewsByUser, addReview } from "../../actions/review.action";
import { CreateConversation } from "../../actions/conversation.action"
import { Chip } from 'primereact/chip';
import { Rating } from "primereact/rating";
import Review from "../../components/Review";
import { toast } from 'react-hot-toast';
import { DataView } from 'primereact/dataview';
import '../../assets/publicProfile.css'
function PublicProfile({ userId }) {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [reviews, setReviews] = useState([]);
    const fetchReviews = async () => {
        try {
            if (id) {
                const response = await GetReviewsByUser(id);
                if (Array.isArray(response?.reviews)) {
                    setReviews(response.reviews);
                } else {
                    console.warn("Expected an array but got:", response);
                    setReviews([]);
                }
            } else {
                console.warn("Provider ID is missing.");
                setReviews([]);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
            setReviews([]);
        }
    };
    useEffect(() => {
        fetchReviews();
    }, [id]);
    const handleAddReview = async () => {
        try {
            const review = {
                reviewee: id,
                rating,
                comment
            };
            if (!rating || !comment) {
                return toast.error("Please provide a rating and comment.");
            } else {
                const response = await addReview(review);
                console.log("response", response);
                if (response) {
                    console.log(response.review)
                    setReviews((prevReviews) => [response.review, ...prevReviews]); // Update the state
                    setRating(0);
                    setComment("");
                }
            }

        } catch (error) {
            console.error("Error adding review:", error);
        }
    }
    const fetchUser = async () => {
        try {
            const response = await getUserById(id);
            const userWithRatings = await (async () => {
                const responseReviews = await GetReviewsByUser(id);
                const reviews = responseReviews.reviews;
                const averageRating = reviews.length > 0
                    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
                    : 0;
                return { ...response, averageRating, totalReviews: reviews.length };
            })();
            setUser(userWithRatings);
            console.log(userWithRatings);
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };
    const handleContact = async () => {
        try {
            const response = await CreateConversation(id);
            if (response) {
                setTimeout(() => window.location.reload(), 2000);

            }
        } catch (error) {
            console.error("Error creating conversation:", error);
            toast.error("Failed to create conversation.");
        }
    }
    useEffect(() => {
        fetchUser();
    }, [id]);

    if (!user) {
        return <p>Loading...</p>;
    }
    const getFileUrl = (file) => {
        if (file) {
            if (typeof file === 'string') {
                // If file is already a URL (string), return as is
                return `${process.env.REACT_APP_API_HOST}/${file}`;
            } else if (file instanceof File) {
                // If file is a File object, use local URL
                return URL.createObjectURL(file);  // Create object URL for local file
            }
        }
        return null;
    };
    return (
        <div className="layout-main">
            <div className="layout-content">
                <div className="profile_header">
                    <div className="profile_image">
                        <img src={getFileUrl(user.avatar)} alt="profile" />
                    </div>
                    <div className="text-information">
                        <h1>{user.username || 'unknown'}</h1>
                        <div className="text-details">
                            <p>{user.role}</p>
                            <i className="pi pi-star-fill ml-2" style={{ color: '#C9E782' }}></i>
                            <span className="ml-2">
                                {user.averageRating.toFixed(1)} ({user.totalReviews} reviews)
                            </span>
                        </div>
                    </div>

                </div>
                <div className="skills_container">
                    <h4>Skills :</h4>
                    <div className="skills">
                        {user.skills.map((skill, index) => (
                            <Chip key={skill._id} label={skill.name.toUpperCase()} className="p-mr-2 p-mb-2 ml-3 " />
                        ))}
                    </div>
                </div>
                <div className="bio_container">
                    <h4>Biographie :</h4>
                    <p>{user.bio ? user.bio : "No Bio"}</p>
                </div>
                <div className="contact_info">
                    <h4>Contact Information :</h4>
                    <div className="contact_details">
                        <div className="contact">
                            <i className="pi pi-envelope"></i>
                            <p>{user.email}</p>
                        </div>
                        {user.phone && user.phone.length > 0 && (
                            <div className="contact">
                                <i className="pi pi-phone"></i>
                                <p>{user.phone}</p>
                            </div>
                        )}
                        {
                            user.githubProfile && user.githubProfile.length > 0 && (
                                <div className="contact">
                                    <i className='pi pi-github'></i>
                                    <a href={user.githubProfile} target='_blank'>Github Profile</a>
                                </div>
                            )
                        }
                        {
                            user.linkedinProfile && user.linkedinProfile.length > 0 && (
                                <div className="contact">
                                    <i className='pi pi-linkedin'></i>
                                    <a href={user.linkedinProfile} target='_blank'>Linkedin Profile</a>
                                </div>
                            )
                        }
                        {
                            user.resume && user.resume.length > 0 && (
                                <div className="contact">
                                    <i className='pi pi-file'></i>
                                    <a href={getFileUrl(user.resume)} target='_blank'>Resume</a>
                                </div>
                            )
                        }
                    </div>
                </div>
                {userId !== id && (
                    <Button
                        label="Contact"
                        icon="pi pi-envelope"
                        className="p-button-primary"
                        onClick={handleContact}
                    />
                )}
                <div className="reviews-section">
                    <div className="add-review">
                        <h4>Add a Review</h4>
                        <Rating
                            value={rating}
                            stars={5}
                            cancel={true}
                            onChange={(e) => setRating(e.target.value)}
                        />
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Write your review here..."
                            rows="4"
                        />
                        <Button label="Submit" className="p-button-success mt-2" style={{ width: "100px" }} onClick={handleAddReview} />
                    </div>
                    <DataView value={Array.isArray(reviews) ? reviews : []} itemTemplate={(review) => (
                        <Review
                            review={review}
                            loggedInUserId={userId}
                            onDelete={() => { }}
                            onEdit={() => { }}
                        />)} layout="list" paginator
                        rows={5} />

                </div>
            </div>
        </div>

    );
}

export default PublicProfile;
