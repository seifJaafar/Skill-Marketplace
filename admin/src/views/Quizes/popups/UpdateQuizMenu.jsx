import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import Select from "react-select";
import useWindowSize from "../../../components/useWindowSize";
import { GetSkills } from "../../../actions/skills.action";
import { updateQuiz } from "../../../actions/quiz.action"

function UpdateQuizMenu(props) {
    const { open, handleClose, header = "Updating Quiz", value } = props;
    const [id, setId] = useState(value._id);
    const [title, setTitle] = useState(value.title)
    const [skills, setSkills] = useState(value.skill);
    const [skillsOptions, setSkillsOptions] = useState([]);
    const [questions, setQuestions] = useState(value?.questions)

    const size = useWindowSize();
    const fetchSkills = async () => {
        try {
            const response = await GetSkills();
            if (response) {
                const skills = response.map(skill => ({ value: skill._id, label: skill.name }));
                setSkillsOptions(skills);
            } else {
                console.error("Skills data is missing or invalid");
                setSkillsOptions([]);
            }
        } catch (error) {
            console.error("Error fetching skills:", error);
            setSkillsOptions([]);
        }
    };
    useEffect(() => {
        fetchSkills();
        setId(value._id);
        setTitle(value.title)
        setSkills(value.skill ? { value: value.skill._id, label: value.skill.name } : {});
        setQuestions(value?.questions)
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
        const questionIDs = questions.map(question => question._id ? question._id : question);

        const data = {
            title: title,
            skill: skills,
            questions: questionIDs
        };

        const response = await updateQuiz(id, data);
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
            header={header}
            modal
            className="p-fluid"
            footer={DialogFooter}
            onHide={handleClose}
        >
            <div className="grid w-100 mt-2">
                <div className="field col-12">
                    <label htmlFor="name">Question Text</label>
                    <InputText id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="field col-6 md:col-6">
                    <label>Skills</label>
                    <Select
                        defaultValue={skills}
                        options={skillsOptions}
                        name="skills"
                        placeholder="Select your skills"
                        onChange={(e) => {
                            setSkills(e.value);
                        }}
                        className="basic-multi-select"
                        classNamePrefix="select"
                    />
                </div>

            </div>
        </Dialog>
    );
}

export default UpdateQuizMenu;
