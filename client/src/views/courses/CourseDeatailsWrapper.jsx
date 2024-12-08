import React, { useState, useEffect } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { toast } from "react-hot-toast";
import useWindowSize from "../../components/useWindowSize";
import "../../assets/Profile.css";
import { loadStripe } from "@stripe/stripe-js";
import { createPaymentIntentCourse, saveEnrollment } from "../../actions/payement.action";
import { Elements } from "@stripe/react-stripe-js";
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useParams } from "react-router-dom";
import CourseDetails from "./CourseDetails";
import { Dialog } from 'primereact/dialog';
function CourseDeatailsWrapper({ user }) {
    const { id } = useParams();
    const [stripePromise, setStripePromise] = useState(null);
    const [clientSecret, setClientSecret] = useState("");
    const [courseId, setCourseId] = useState("");
    const [dialogVisible, setDialogVisible] = useState(false);
    const size = useWindowSize();


    useEffect(() => {
        if (!process.env.REACT_APP_STRIPE_PUBLISH_KEY) {
            console.error("Stripe public key is missing");
            return;
        }

        const initializeStripe = async () => {
            const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISH_KEY);
            setStripePromise(stripe);
        };

        initializeStripe();
    }, []);

    const PaymentForm = ({ stripePromise, clientSecret, courseId, onSuccess }) => {
        const stripe = useStripe();
        const elements = useElements();

        const handleSubmitPayment = async () => {
            if (!stripe || !elements) return;

            try {
                const { error, paymentIntent } = await stripe.confirmPayment({
                    elements,
                    confirmParams: {
                        return_url: `${window.location.origin}/course/${courseId}`,
                    },
                    redirect: 'if_required'
                });

                console.log("Payment intent:", paymentIntent);
                if (error) {
                    toast.error(error.message);
                } else if (paymentIntent.status === 'succeeded') {
                    await saveEnrollment({ courseId, paymentIntentId: paymentIntent.id });
                    toast.success("Payment successful!");
                    window.location.reload();
                } else {
                    toast.error("Payment failed. Please try again.");
                }
            } catch (error) {
                console.error("Error confirming payment:", error);
                toast.error("Payment failed. Please try again.");
            }
        };

        return (
            <Dialog
                visible={dialogVisible}
                style={{ width: PopupSize() }}
                header={'Payment Form'}
                modal
                className="p-fluid"
                onHide={() => { setDialogVisible(false); }}
            >
                <PaymentElement />
                <button onClick={handleSubmitPayment} className="btn btn-success mt-3">
                    Pay Now
                </button>
            </Dialog>
        );
    };
    const handlePayment = async (courseId) => {
        try {
            setCourseId(courseId);
            const response = await createPaymentIntentCourse({ courseId });
            if (response.clientSecret) {
                setClientSecret(response.clientSecret);
            } else {
                toast.error("Failed to initialize payment.");
            }
            setDialogVisible(true);
        } catch (error) {
            console.error("Error creating payment intent:", error);
            toast.error("Error creating payment intent. Please try again.");
        }
    };

    const PopupSize = () => {
        switch (size) {
            case "xl":
                return "500px";
            case "lg":
                return "500px";
            case "md":
                return "500px";
            case "sm":
                return "500px";
            case "xs":
                return "98%";
            default:
                return "80%";
        }
    };


    return (
        <>
            <CourseDetails userId={user._id} onPay={handlePayment} id={id} />
            {
                clientSecret && (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <PaymentForm
                            stripePromise={stripePromise}
                            clientSecret={clientSecret}
                            courseId={courseId}
                            onSuccess={() => { }}
                        />
                    </Elements>
                )
            }
        </>
    );
}

export default CourseDeatailsWrapper;
