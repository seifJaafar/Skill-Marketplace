import React, { useEffect, useState } from "react";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import Select from "react-select";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { GetSkills } from "../../actions/skills.action";
import "../../assets/styles/adduser.css";  // Import custom CSS for styling
import { RegisterUser } from "../../actions/user.action";

function AddUser() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [role, setRole] = useState("");
    const [approved, setApproved] = useState("");
    const [phone, setPhone] = useState("");
    const [skillsOptions, setSkillsOptions] = useState([]);
    const [skills, setSkills] = useState([]);
    const [points, setPoints] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [githubProfile, setGithubProfile] = useState("");
    const [linkedinProfile, setLinkedinProfile] = useState("");

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
    }, []);

    const handleCancel = () => {
        setEmail("");
        setUsername("");
        setRole("");
        setApproved("");
        setPhone("");
        setSkills([]);
    };

    const handleSubmit = async () => {
        const skillsIds = skills.map(skill => skill.value ? skill.value : skill);
        const newUser = {
            email,
            phone,
            role,
            approved,
            username,
            points,
            skills: skillsIds,
            quizCompleted,
            githubProfile,
            linkedinProfile
        };
        console.log(newUser);
        await RegisterUser(newUser);

    };

    return (
        <>
            <div className="form-row">
                <div className="form-field">
                    <label>Email</label>
                    <InputText
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="large-input"
                    />
                </div>
                <div className="form-field">
                    <label>Username</label>
                    <InputText
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="large-input"
                    />
                </div>
            </div>
            <div className="form-row">
                <div className="form-field">
                    <label>Phone</label>
                    <InputText
                        name="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="large-input"
                    />
                </div>
                <div className="form-field">
                    <label>Role</label>
                    <Dropdown
                        value={role}
                        name="role"
                        onChange={(e) => setRole(e.value)}
                        options={[
                            { value: "skillprovider", name: "Skill Provider" },
                            { value: "skillexpert", name: "Skill Expert" },
                            { value: "admin", name: "Admin" }
                        ]}
                        optionLabel="name"
                        placeholder="Select role"
                        className="large-input"
                    />
                </div>
            </div>
            <div className="form-row">
                <div className="form-field">
                    <label>Approval Status</label>
                    <Dropdown
                        value={approved}
                        name="approved"
                        onChange={(e) => setApproved(e.value)}
                        options={[
                            { value: true, name: "true" },
                            { value: false, name: "false" }
                        ]}
                        optionLabel="name"
                        placeholder="Select approval status"
                        className="large-input"
                    />
                </div>
                <div className="form-field">
                    <label>Skills</label>
                    <Select
                        value={skillsOptions.filter(option => skills.includes(option.value))}
                        options={skillsOptions}
                        isMulti
                        placeholder="Select skills"
                        onChange={(selected) => setSkills(selected.map(skill => skill.value))}
                        className="select-input"
                    />
                </div>
            </div>
            <div className="form-row">
                <div className="form-field">
                    <label>Points</label>
                    <InputNumber
                        value={points}
                        onValueChange={(e) => setPoints(e.value)}
                        showButtons
                        min={0}
                        className="large-input"
                    />
                </div>
                <div className="form-field">
                    <label>Quiz Completed</label>
                    <Dropdown
                        value={quizCompleted}
                        name="quizCompleted"
                        onChange={(e) => setQuizCompleted(e.value)}
                        options={[
                            { value: true, name: "true" },
                            { value: false, name: "false" }
                        ]}
                        optionLabel="name"
                        placeholder="Select quiz status"
                        className="large-input"
                    />
                </div>
            </div>
            {role === "skillexpert" && (
                <>
                    <div className="form-row">
                        <div className="form-field">
                            <label>Github Profile</label>
                            <InputText
                                name="githubProfile"
                                value={githubProfile}
                                onChange={(e) => setGithubProfile(e.target.value)}
                                className="large-input"
                            />
                        </div>
                        <div className="form-field">
                            <label>Linkedin Profile</label>
                            <InputText
                                name="linkedinProfile"
                                value={linkedinProfile}
                                onChange={(e) => setLinkedinProfile(e.target.value)}
                                className="large-input"
                            />
                        </div>
                    </div>
                </>
            )}
            <div className="button-row">
                <Button
                    label="Cancel"
                    icon="pi pi-times"
                    className="p-button-outlined p-button-cancel"
                    onClick={handleCancel}
                />
                <Button
                    label="Add User"
                    icon="pi pi-check"
                    className="p-button-submit"
                    onClick={handleSubmit}
                />
            </div>
        </>
    );
}

export default AddUser;
