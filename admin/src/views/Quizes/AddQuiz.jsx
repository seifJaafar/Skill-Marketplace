import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";

import Select from "react-select";
import { Button } from "primereact/button";
import { addQuiz } from "../../actions/quiz.action"
import { GetSkills } from "../../actions/skills.action";


function AddQuiz() {
    const [title, setTitle] = useState("");
    const [skillsOptions, setSkillsOptions] = useState([]);
    const [skills, setSkills] = useState([]);

    const handleCancel = () => {
        setTitle("");
        setSkills([])
    };
    const fetchSkills = async () => {
        try {
            const response = await GetSkills();
            if (response) {
                const skillsWithoutLinkedQuiz = response.filter(skill => !skill.linkedQuiz);
                const skills = skillsWithoutLinkedQuiz.map(skill => ({ value: skill._id, label: skill.name }));
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
    }, []);
    const handleSubmit = async () => {
        const newQuiz = {
            title,
            skill: skills
        }
        console.log(newQuiz);
        const response = await addQuiz(newQuiz)
        if (response) {
            window.location.reload();
        } else {
            console.error("Failed to add Quiz");

        };
    }

    return (
        <>
            <div className="form-row">
                <div className="form-field">
                    <label>Title</label>
                    <InputText
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="large-input"
                    />
                </div>
            </div>
            <div className="form-row">

                <div className="form-field" style={{ display: " flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
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
                        styles={{
                            container: (provided) => ({
                                ...provided,
                                width: "300px", // Set your desired width
                            }),
                        }}
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
                    label="Add Quiz"
                    icon="pi pi-check"
                    style={{ backgroundColor: "#C9E782", color: "#1E1F2A", border: "none", marginLeft: "10px" }}
                    onClick={handleSubmit}
                />
            </div>
        </>
    );
}

export default AddQuiz;