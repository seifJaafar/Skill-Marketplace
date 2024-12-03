import React from "react";

import { Dialog } from "primereact/dialog";
import useWindowSize from "../../../components/useWindowSize";

function Dates(props) {
    const {
        open,
        handleClose,
        title = "SkillPost Dates Data",
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
                <h3>Dates</h3>
                {value.createdAt ? (
                    <div className="skills-list">
                        <p>Posted At: {value.createdAt}</p>
                    </div>
                ) : (
                    <p>Posted At: No Date available</p>
                )}
                {value.updatedAt ? (
                    <div className="skills-list">
                        <p>Last Update: {value.updatedAt}</p>
                    </div>
                ) : (
                    <p>Last Update: No Date available</p>
                )}
                {value.completedAt ? (
                    <div className="skills-list">
                        <p>Completed At: {value.completedAt}</p>
                    </div>
                ) : (
                    <p>Completed At: No Date available</p>
                )}
                {value.cancelledAt ? (
                    <div className="skills-list">
                        <p>Cancelled At: {value.cancelledAt}</p>
                    </div>
                ) : (
                    <p>Cancelled At: No Date available</p>)}
            </div>
        </Dialog>
    );
}

export default Dates;