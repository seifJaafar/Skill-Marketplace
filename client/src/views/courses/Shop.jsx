import React, { useState, useEffect } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { toast } from "react-hot-toast";
import useWindowSize from "../../components/useWindowSize";
import "../../assets/Profile.css";
import AddCourse from "./AddCourse";
import Courses from "./Courses";
function Shop({ user }) {
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


    return (
        <div className="layout-main">
            <div className="layout-content">
                <Tabs
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    className={`d-flex flex-wrap justify-content-center ${isMobile ? "flex-column mt-5" : ""}`}
                    style={{ maxWidth: "100%" }}
                >
                    <Tab eventKey="1" title={"Courses"}>
                        <Courses userId={user._id} />
                    </Tab>
                    {
                        user.role === "skillexpert" && (
                            <Tab eventKey="2" title={"Add Course"}>
                                <AddCourse userId={user._id} />
                            </Tab>
                        )
                    }

                </Tabs>
            </div>
        </div>
    );
}

export default Shop;
