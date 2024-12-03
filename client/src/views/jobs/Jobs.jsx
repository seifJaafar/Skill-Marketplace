import React, { useState, useEffect } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import MyProjects from "./MyProjects";
import { loadStripe } from "@stripe/stripe-js";
import { createPaymentIntent, markJobAsPaid } from "../../actions/payement.action";
import { Dialog } from "primereact/dialog";
import { toast } from "react-hot-toast";
import { Elements } from "@stripe/react-stripe-js";
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import useWindowSize from "../../components/useWindowSize";
import "../../assets/Profile.css";

function Jobs() {
    const isMobile = useMediaQuery({ maxWidth: 992 });
    const navigate = useNavigate();
    const [key, setKey] = useState("1");
    const [stripePromise, setStripePromise] = useState(null);
    const [clientSecret, setClientSecret] = useState("");
    const [jobId, setJobId] = useState("");
    const [dialogVisible, setDialogVisible] = useState(false);
    const size = useWindowSize();

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
    function PaymentForm({ stripePromise, clientSecret, jobId, onSuccess }) {
        const stripe = useStripe();
        const elements = useElements();
        const handleSubmitPayment = async () => {
            if (!stripe || !elements) return;

            try {
                const { error, paymentIntent } = await stripe.confirmPayment({
                    elements,
                    confirmParams: {
                        return_url: `${window.location.origin}/jobs`,
                    },
                    redirect: 'if_required'
                });
                console.log("Payment intent:", paymentIntent);
                if (error) {
                    toast.error(error.message);
                } else if (paymentIntent.status === 'succeeded') {
                    await markJobAsPaid({ jobId, paymentIntentId: paymentIntent.id });
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
                header={'Payement Form'}
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
    }
    const handlePayment = async (jobId) => {
        try {
            setJobId(jobId);
            const response = await createPaymentIntent({ jobId });
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

    return (
        <div className="layout-main">
            <div className="layout-content">
                <Tabs
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    className={`d-flex flex-wrap justify-content-center ${isMobile ? "flex-column mt-5" : ""}`}
                    style={{ maxWidth: "100%" }}
                >
                    <Tab eventKey="1" title={"SkillPosts"}>
                        <MyProjects onPay={handlePayment} />
                        {clientSecret && (
                            <Elements stripe={stripePromise} options={{ clientSecret }}>
                                <PaymentForm
                                    stripePromise={stripePromise}
                                    clientSecret={clientSecret}
                                    jobId={jobId}
                                    onSuccess={() => { }}
                                />
                            </Elements>
                        )}
                    </Tab>
                </Tabs>
            </div>
        </div>
    );
}

export default Jobs;
