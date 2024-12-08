import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { GetSkillPostById, UpdateSkillPost, LinkSkillPost } from "../../actions/skillPost.action";
import { toast } from 'react-hot-toast';
import { GetReviewsByUser, addReview } from "../../actions/review.action";
import DelDialogue from "./popups/DelDialogue";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { DataView } from "primereact/dataview";
import { GetSkills } from "../../actions/skill.action"
import { GetAllUsers } from "../../actions/user.action"
import { CreateConversation } from "../../actions/conversation.action"
import { Rating } from "primereact/rating";
import Review from "../../components/Review";
import "../../assets/SkillPostDeatils.css";

function SkillPostInformation({ userId }) {
    const { id } = useParams();
    const [isEdit, setIsEdit] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [skillsOptions, setSkillsOptions] = useState([]);
    const [newOfferType, setNewOfferType] = useState("");
    const [newPrice, setNewPrice] = useState(0);
    const [newExchangeSkill, setNewExchangeSkill] = useState("");
    const [delDialogue, setDelDialog] = useState(false);
    const [item, setItem] = useState({});
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [linkedUser, setLinkedUser] = useState(null);
    const [skillPost, setSkillPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [userOptions, setUserOptions] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const navigate = useNavigate();
    const loggedInUserId = userId;

    useEffect(() => {
        fetchSkillPost();
    }, []);
    const openDelDialogue = (skillPost) => {
        setDelDialog(true);
        setItem(skillPost);
    }
    const fetchSkillPost = async () => {
        try {
            const response = await GetSkillPostById(id);
            setSkillPost(response);
            setLoading(false);
            return response;
        } catch (error) {
            console.error("Error fetching skill post:", error);
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        handleReset();
        setIsEdit(false);
    }
    const handleReset = async () => {
        try {
            setNewDescription(skillPost.description);
            setNewTitle(skillPost.title);
            setNewPrice(skillPost.price);
            setNewOfferType(skillPost.offerType);
            setNewExchangeSkill(skillPost.exchangeSkill?._id)

        } catch (err) {
            console.error("Error resetting skill post:", err);
            toast.error("Failed to reset skill post.");
        }
    }
    const fetchSkills = async () => {
        try {
            const response = await GetSkills();
            if (response) {
                const skills = response.map(skill => ({ value: skill._id, label: skill.name }));
                setSkillsOptions(skills);
            } else {
                console.error("Skills data is missing or invalid");
                setSkillsOptions([]);
            }
        } catch (error) {
            console.error("Error fetching skills:", error);
            setSkillsOptions([]);
        }
    };
    const handleContact = async () => {
        try {
            const response = await CreateConversation(skillPost.providerId);
            if (response) {
                setTimeout(() => window.location.reload(), 2000);

            }
        } catch (error) {
            console.error("Error creating conversation:", error);
            toast.error("Failed to create conversation.");
        }
    }
    const fetchUsers = async () => {
        try {
            setLoadingUsers(true);
            const response = await GetAllUsers();
            if (response) {
                const options = response.map(user => ({
                    label: user.username,
                    value: user._id,
                }));
                setUserOptions(options);
            } else {
                setUserOptions([]);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            setUserOptions([]);
        } finally {
            setLoadingUsers(false);
        }
    }
    useEffect(() => {
        if (skillPost) {
            setNewDescription(skillPost.description);
            setNewTitle(skillPost.title);
            setNewPrice(skillPost.price);
            setNewOfferType(skillPost.offerType);
            setNewExchangeSkill(skillPost.exchangeSkill?._id);
            if (skillPost.linkedUserId) {
                setLinkedUser(skillPost.linkedUserId);  // Only set if there's an existing linkedUserId
            } else {
                setLinkedUser(null);  // Make sure linkedUser is null if no linkedUserId is present
            }
            fetchReviews();
            fetchSkills();
            fetchUsers();

        }
    }, [skillPost]);
    useEffect(() => {
        if (skillPost) {

            setNewDescription(skillPost.description);
            setNewTitle(skillPost.title);
            setNewPrice(skillPost.price);
            setNewOfferType(skillPost.offerType);
            setNewExchangeSkill(skillPost.exchangeSkill?._id);
            if (skillPost.linkedUserId) {
                setLinkedUser(skillPost.linkedUserId);  // Only set if there's an existing linkedUserId
            } else {
                setLinkedUser(null);  // Make sure linkedUser is null if no linkedUserId is present
            }
            fetchReviews();
            fetchSkills();
            fetchUsers();

        }
    }, [skillPost]);

    const handleSave = async () => {
        try {
            // Check if the linkedUser is valid, if not, avoid passing a random ObjectId
            const updatedSkillPost = {
                title: newTitle,
                description: newDescription,
                price: newPrice,
                offerType: newOfferType,
                exchangeSkill: newExchangeSkill,
                skillCategory: skillPost.skillCategory._id,
            };


            const response = await UpdateSkillPost(skillPost._id, updatedSkillPost);
            if (response && response.message === "Skill Post updated successfully") {

                setIsEdit(false);
                handleReset();
            }
        } catch (err) {
            toast.error("Failed to save skill post.");
        }
    }
    const handleLinkUser = async () => {
        try {

            const response = await LinkSkillPost(skillPost._id, { linkedUserId: linkedUser });
            if (response && response.message === "Skill Post linked successfully") {
                setLinkedUser(null);
                navigate("/skillpost");
            }
        } catch (error) {
            console.error("Error linking user to skill post:", error);
            toast.error("Failed to link user to skill post.");
        }
    }

    const fetchReviews = async () => {
        try {
            if (skillPost?.providerId) {
                const response = await GetReviewsByUser(skillPost.providerId);
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


    const handleEdit = () => {
        setIsEdit(true);
    };
    const callBack = () => {
        navigate("/skillpost");
    }
    if (loading) {
        return <div>Loading skill post details...</div>;
    }
    if (!skillPost) {
        return <div>Failed to load skill post details.</div>;
    }
    const handleAddReview = async () => {
        try {
            const review = {
                reviewee: skillPost.providerId,
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
    return (
        <div className="layout-main">
            <div className="layout-content">
                {item && delDialogue && (
                    <DelDialogue
                        open={delDialogue}
                        handleClose={() => setDelDialog(false)}
                        value={item}
                        title={`Delete of ${item.title}`}
                        callBack={callBack}
                    />
                )}
                <div className="skillpost-details-container">
                    <div className="grid-container">
                        <div className="left-column">
                            <div className="header-container">
                                {isEdit ? (
                                    <InputTextarea
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        rows={1}
                                        autoResize
                                        className="title-input"
                                        style={{ width: "100%" }}
                                    />
                                ) : (<h1>{skillPost.title}</h1>)
                                }
                                <div className="provider-infos">
                                    <Link style={{ color: "#C9E782", textDecoration: 'none' }} to={`/profile/${skillPost.providerId}`}>
                                        <span>Skill Provider : {skillPost.providerName || "unknown"}</span>
                                    </Link>

                                </div>
                            </div>
                            <div className="description-section">
                                {isEdit ? (
                                    <InputTextarea
                                        value={newDescription}
                                        onChange={(e) => setNewDescription(e.target.value)}
                                        rows={4}
                                        autoResize
                                        className="description-input"
                                        style={{ width: "100%" }}
                                    />
                                ) : (<p><strong>Description:</strong> {skillPost.description}</p>
                                )}
                            </div>
                        </div>
                        <aside className="aside-details">
                            <h2>Details</h2>
                            {isEdit ? (
                                <>
                                    <div className="flex align-items-center">
                                        <label>Price</label>
                                        <InputNumber value={newPrice} onValueChange={(e) => setNewPrice(e.value)} mode="currency" currency="USD" locale="en-US"
                                            style={{ width: '100%', marginLeft: '10px' }} step={1}
                                        />
                                    </div>
                                    <div className="flex align-items-center">
                                        <label htmlFor="">Offer Type</label>
                                        <Dropdown
                                            value={newOfferType}
                                            options={[
                                                { label: "Exchange", value: "exchange" },
                                                { label: "Monetary", value: "monetary" },
                                            ]}
                                            onChange={(e) => setNewOfferType(e.value)}
                                            placeholder="Select an Offer Type"
                                            style={{ width: '100%', marginLeft: '10px' }}
                                        />

                                    </div>
                                    <div className="flex align-items-center">
                                        <label htmlFor="">Exchange Skill</label>
                                        <Dropdown
                                            value={newExchangeSkill}
                                            options={skillsOptions}
                                            onChange={(e) => setNewExchangeSkill(e.value)}
                                            placeholder="Select an Exchange Skill"
                                            style={{ width: '100%', marginLeft: '10px' }}
                                        />
                                    </div>
                                    <p><strong>Posted:</strong> {new Date(skillPost.createdAt).toLocaleDateString()}</p>
                                    <p><strong>propositions:</strong> {skillPost.suggestions}</p>


                                </>
                            ) : (
                                <>
                                    <p><strong>Price:</strong> {skillPost.price || "Depending on the project"}</p>
                                    <p><strong>Offer Type:</strong> {skillPost.offerType === "both" ? "Exchange and Monetary" : skillPost.offerType}</p>
                                    <p><strong>Exchange Skill:</strong> {skillPost.exchangeSkill?.name || "Not set"}</p>
                                    <p><strong>Posted:</strong> {new Date(skillPost.createdAt).toLocaleDateString()}</p>
                                    <p><strong>propositions:</strong> {skillPost.suggestions}</p>
                                    {loggedInUserId !== skillPost.providerId && (
                                        <Button
                                            label="Contact"
                                            icon="pi pi-envelope"
                                            className="p-button-primary"
                                            onClick={handleContact}
                                        />
                                    )}</>
                            )}

                        </aside>
                    </div>

                    {/* Action Buttons */}
                    {loggedInUserId === skillPost.providerId && (
                        <div className="action-buttons">
                            {isEdit ? (
                                <>
                                    <Button label="Save" icon="pi pi-check" onClick={handleSave} />
                                    <Button label="Reset" icon="pi pi-refresh" className="p-button-secondary ml-4" onClick={handleReset} />
                                    <Button label="Cancel" icon="pi pi-times" className="p-button-danger ml-4" onClick={handleCancel} />
                                </>
                            ) : (
                                <Button label="Edit" icon="pi pi-pencil" onClick={handleEdit} />
                            )}
                            <Button
                                label="Delete"
                                icon="pi pi-trash"
                                className="p-button-danger ml-4"
                                onClick={() => openDelDialogue(skillPost)}
                            />

                            <Dropdown
                                value={linkedUser}
                                options={userOptions}
                                onChange={(e) => {
                                    setLinkedUser(e.value)
                                }}
                                placeholder="Link SkillPost To client"
                                disabled={loadingUsers}
                                className="ml-4"
                                style={{ width: "400px" }}
                            />
                            <Button
                                label="Link Client"
                                icon="pi pi-link"
                                className="p-button-success ml-4"
                                onClick={handleLinkUser} />
                        </div>
                    )}
                </div>
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
                            loggedInUserId={loggedInUserId}
                            onDelete={() => { }}
                            onEdit={() => { }}
                        />)} layout="list" paginator
                        rows={5} />

                </div>
            </div>
        </div>

    );
}

export default SkillPostInformation;
