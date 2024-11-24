import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { updateSkill } from "../../../actions/skills.action";
import useWindowSize from "../../../components/useWindowSize";
import { InputTextarea } from 'primereact/inputtextarea';


function UpdateSkillMenu(props) {
    const { open, handleClose, title = "Updating user", value } = props;
    const [id, setId] = useState(value._id);
    const [name, setName] = useState(value.name);
    const [description, setDescription] = useState(value.description);

    const size = useWindowSize();



    useEffect(() => {
        setId(value._id);
        setName(value.name);
        setDescription(value.description);
    }, [value]);

    const PopupSize = () => {
        switch (size) {
            case "xl":
            case "lg":
            case "md":
            case "sm":
                return "500px";
            case "xs":
                return "98%";
            default:
                return "80%";
        }
    };

    const handleSubmit = async () => {
        const data = {
            name: name,
            description: description,
        }
        const response = await updateSkill(id, data);
        if (response) {
            window.location.reload();
        }

    };

    const DialogFooter = (
        <>
            <Button
                label="Cancel"
                icon="pi pi-times"
                style={{ backgroundColor: "#1E1F2A", color: "#C9E782", border: "none" }}
                onClick={handleClose}
            />
            <Button
                label="Save"
                icon="pi pi-check"
                style={{ backgroundColor: "#C9E782", color: "#1E1F2A", border: "none", marginLeft: "10px" }}
                onClick={handleSubmit}
            />
        </>
    );

    return (
        <Dialog
            visible={open}
            style={{ width: PopupSize() }}
            header={title}
            modal
            className="p-fluid"
            footer={DialogFooter}
            onHide={handleClose}
        >
            <div className="grid w-100 mt-2">
                <div className="field col-12 md:col-12">
                    <label>Name</label>
                    <InputText
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        autoFocus
                    />
                </div>
                <div className="field col-12 md:col-12">
                    <label>Description</label>
                    <InputTextarea
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        autoFocus
                    />
                </div>
            </div>
        </Dialog>
    );
}

export default UpdateSkillMenu;
