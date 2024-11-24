import React from "react";

import { Dialog } from "primereact/dialog";
import useWindowSize from "../../../components/useWindowSize";

function Answers(props) {
    const {
        open,
        handleClose,
        title = "Question Answers",
        value,
    } = props;

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
        <Dialog
            visible={open}
            style={{ width: PopupSize() }}
            header={title}
            modal
            className="p-fluid"
            onHide={handleClose}
        >
            <div className="skills-popup-content">
                <h3>Answers</h3>
                {value.options && value.options.length > 0 ? (
                    <div className="skills-list">
                        {value.options.map((option, index) => (
                            <li key={index}>{option}</li>  // Adjust based on your question structure
                        ))}
                    </div>
                ) : (
                    <p>No Answer available</p>
                )}
            </div>
        </Dialog>
    );
}

export default Answers;