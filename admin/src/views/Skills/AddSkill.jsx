import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from "primereact/button";
import { addSkill } from "../../actions/skills.action";
import "../../assets/styles/addskill.css";


function AddSkill() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleCancel = () => {
        setName("");
        setDescription("");
    };

    const handleSubmit = async () => {
        const newSkill = {
            name,
            description
        }
        console.log(newSkill);
        const response = await addSkill(newSkill);
        if (response) {
            window.location.reload();
        } else {
            console.error("Failed to add skill");

        };
    }
    return (
        <>
            <div className="form-row">
                <div className="form-field">
                    <label>Name</label>
                    <InputText
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="large-input"
                    />
                </div>
            </div>
            <div className="form-row">
                <div className="form-field">
                    <label>Description</label>
                    <InputTextarea
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        autoFocus
                        className="large-input"
                    />
                </div>
            </div>
            <div className="button-row">
                <Button
                    label="Cancel"
                    icon="pi pi-times"
                    style={{ backgroundColor: "#1E1F2A", color: "#C9E782", border: "none" }}
                    onClick={handleCancel}
                />
                <Button
                    label="Add Skill"
                    icon="pi pi-check"
                    style={{ backgroundColor: "#C9E782", color: "#1E1F2A", border: "none", marginLeft: "10px" }}
                    onClick={handleSubmit}
                />
            </div>
        </>
    );
}

export default AddSkill;
