import React from "react";

import { Dialog } from "primereact/dialog";
import useWindowSize from "../../../components/useWindowSize";

function Description(props) {
    const {
        open,
        handleClose,
        title = "Skill Description",
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
                <h3>Description</h3>
                {value.description ? (
                    <div className="skills-list">
                        <p>{value.description}</p>
                    </div>
                ) : (
                    <p>No Description available</p>
                )}
            </div>
        </Dialog>
    );
}

export default Description;