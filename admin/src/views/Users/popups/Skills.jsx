import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import Badge from "../../../partials/Badge"
import { DeleteUser } from "../../../actions/user.action"
import useWindowSize from "../../../components/useWindowSize";

function Skills(props) {
    const {
        open,
        handleClose,
        title = "Delete User",
        value,
        callBack = () => { },
    } = props;
    if (value && value.skills) {
        var skills = value.skills;
    }

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
                <h3>Skills:</h3>
                {skills && skills.length > 0 ? (
                    <div className="skills-list">
                        {skills.map((skill, index) => (
                            <p key={index}>{skill.name}</p>
                        ))}
                    </div>
                ) : (
                    <p>No skills available</p>
                )}
            </div>
        </Dialog>
    );
}

export default Skills;