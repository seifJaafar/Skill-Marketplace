import React, { useState } from 'react';
import { Rating } from 'primereact/rating';
import { Button } from 'primereact/button';
import { InputTextarea } from "primereact/inputtextarea";
import { deleteReview, updateReview } from "../actions/review.action"
import DelReview from "./popups/DelReview";
import { toast } from 'react-hot-toast';

function Review({ review, loggedInUserId, onDelete, onEdit }) {
    const isOwner = review.reviewer?._id === loggedInUserId;
    const [isEditing, setIsEditing] = useState(false);
    const [delDialogue, setDelDialogue] = useState(false);
    const [editedComment, setEditedComment] = useState(review.comment);
    const [editedRating, setEditedRating] = useState(review.rating);
    const [item, setItem] = useState(null);
    const openDelDialogue = (value) => {
        setDelDialogue(true);
        setItem(value);
    }
    const handleEdit = async () => {
        try {

            const updatedReview = {
                rating: editedRating,
                comment: editedComment,

            }
            const response = await updateReview(review._id, updatedReview);
            if (response) {
                setIsEditing(false);
                window.location.reload();
            }
            ;
        } catch (error) {
            console.error('Error editing review:', error);
            toast.error('Failed to edit review.');
        }
    };


    return (
        <div className="p-card p-component">
            <div className="p-card-body">
                {item && delDialogue && (
                    <DelReview
                        open={delDialogue}
                        handleClose={() => setDelDialogue(false)}
                        value={item}
                        title={`Delete of Review`}
                    />
                )}
                <div className="review-header">
                    <h4>{review.reviewer?.username || "Anonymous"}</h4>
                    <div>
                        {isEditing ? (
                            <Rating
                                value={editedRating}
                                onChange={(e) => setEditedRating(e.value)}
                                stars={5}
                            />
                        ) : (
                            <Rating value={review.rating} readOnly stars={5} cancel={false} />
                        )}
                    </div>
                </div>
                <div className="review-comment">
                    {isEditing ? (
                        <InputTextarea
                            value={editedComment}
                            onChange={(e) => setEditedComment(e.target.value)}
                            rows="4"
                            autoResize
                            style={{ width: "100%" }}  // Make textarea full width
                        />
                    ) : (
                        <p>{review.comment}</p>
                    )}
                </div>
                <div className="review-footer">
                    <span>
                        {new Date(review.createdAt).toLocaleString('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: false,
                        })}
                    </span>
                </div>

                {isOwner && (
                    <div className="review-action">
                        {isEditing ? (
                            <Button label="Save" icon="pi pi-save" className="p-button-success" onClick={handleEdit} />
                        ) : (
                            <Button label="Edit" icon="pi pi-pencil" className="p-button-info" onClick={() => setIsEditing(true)} />
                        )}
                        <Button label="Delete" icon="pi pi-trash" className="p-button-danger ml-4" onClick={() => openDelDialogue(review)} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Review;
