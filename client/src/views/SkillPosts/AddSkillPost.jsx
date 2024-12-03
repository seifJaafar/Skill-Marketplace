import React, { useEffect, useState } from "react";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
import Select from "react-select";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import "../../assets/PostForm.css";
import { GetSkills } from "../../actions/skill.action"
import { PostSkillPost } from "../../actions/skillPost.action";
import toast from "react-hot-toast";

function AddSkillPost({ skills, name }) {
    const [skillLevel, setSkillLevel] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [skillProvided, setSkillProvided] = useState("");
    const [exchangeSkill, setExchangeSkill] = useState("");
    const [skillProvidedOptions, setSkillProvidedOptions] = useState([]);
    const [skillsOptions, setSkillsOptions] = useState([]);


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
        if (!skills) {
            skills = [];
        }
        if (!name) {
            name = "";
        }
        setSkillProvidedOptions(skills.map(skill => ({ value: skill._id, label: skill.name })));
    }, []);

    const handleCancel = () => {
        setSkillLevel("");
        setTitle("");
        setDescription("");

        setSkillProvided("");
        setExchangeSkill("");
    };

    const handleSubmit = async () => {
        const newPost = {
            title,
            description,
            skillCategory: skillProvided,
            exchangeSkill,
            skillLevel,
            providerName: name
        }
        const response = await PostSkillPost(newPost);
        console.log(response);
        if (response.error) {
            toast.error(response.error);
            console.error("Error posting skill post:", response.error);
        } else {
            window.location.reload();
        }

    };

    return (
        <>
            <div className="form-row">
                <div className="form-field">
                    <label>Description</label>
                    <InputTextarea
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="large-input" />
                </div>
            </div>
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
                <div className="form-field">
                    <label>Project difficulty</label>
                    <Dropdown

                        name="SkillLevel"
                        value={skillLevel}
                        onChange={(e) => setSkillLevel(e.target.value)}
                        options={[
                            { value: "beginner", name: "Beginner" },
                            { value: "intermediate", name: "Intermediate" },
                            { value: "advanced", name: "Advanced" }
                        ]}
                        optionLabel="name"
                        placeholder="Select a difficulty level"
                        className="large-input"
                    />
                </div>

            </div>
            <div className="form-row">
                <div className="form-field">
                    <label>Skill You Provide</label>
                    <Select
                        value={skillProvidedOptions.filter(option => option.value === skillProvided)}
                        options={skillProvidedOptions}
                        placeholder="Select skills"
                        onChange={(selected) => setSkillProvided(selected.value)}
                        className="select-input"
                    />
                </div>
                <div className="form-field">
                    <label>Skill Needed for exchange</label>
                    <Select
                        value={skillsOptions.filter(option => option.value === exchangeSkill)}
                        options={skillsOptions}
                        placeholder="Select skills"
                        onChange={(selected) => setExchangeSkill(selected.value)}
                        className="select-input"
                    />
                </div>
            </div>

            <div className="button-row">
                <Button
                    label="Cancel"
                    icon="pi pi-times"
                    className="p-button-outlined p-button-cancel"
                    onClick={handleCancel}
                />
                <Button
                    label="Post"
                    icon="pi pi-check"
                    className="p-button-submit"
                    onClick={handleSubmit}
                />
            </div>
        </>
    );
}

export default AddSkillPost;
