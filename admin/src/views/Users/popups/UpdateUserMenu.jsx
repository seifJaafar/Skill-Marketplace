import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { UpdateUser } from "../../../actions/user.action";
import useWindowSize from "../../../components/useWindowSize";
import { InputNumber } from "primereact/inputnumber";
import Select from "react-select";
import { Dropdown } from "primereact/dropdown";
import { GetSkills } from "../../../actions/skills.action";

function UpdateUserMenu(props) {
    const { open, handleClose, title = "Updating user", value } = props;
    const [email, setEmail] = useState(value.email);
    const [username, setUsername] = useState(value.username);
    const [role, setRole] = useState(value.role);
    const [skills, setSkills] = useState(value.skills?.map(skill => skill._id) || []);
    const [approved, setApproved] = useState(value.approved);
    const [points, setPoints] = useState(value.points);
    const [githubProfile, setGithubProfile] = useState(value.githubProfile);
    const [linkedinProfile, setLinkedinProfile] = useState(value.linkedinProfile);
    const [phone, setPhone] = useState(value.phone);
    const [skillsOptions, setSkillsOptions] = useState([]);
    const [id, setId] = useState(value._id);
    const [quizCompleted, setQuizCompleted] = useState(value.quizCompleted);

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
        setEmail(value.email);
        setUsername(value.username);
        setRole(value.role);
        setApproved(value.approved);
        setPhone(value.phone);
        setPoints(value.points);
        setGithubProfile(value?.githubProfile);
        setLinkedinProfile(value?.linkedinProfile);
        setSkills(value.skills?.map(skill => { return { value: skill._id, label: skill.name } }) || []);
        setQuizCompleted(value?.quizCompleted);
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
        const skillsIds = skills.map(skill => skill.value ? skill.value : skill);
        const updatedUser = {
            email: email,
            username: username,
            phone: phone,
            password: value.password,
            role: role,
            approved: approved,
            ...(role === 'skillexpert' ? { githubProfile, linkedinProfile } : {}),
            points: points,
            skills: skillsIds,
            quizCompleted: quizCompleted

        };
        await UpdateUser(id, updatedUser);
        window.location.reload();
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
                    <label>Email</label>
                    <InputText
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoFocus
                    />
                </div>
                <div className="field col-12 md:col-12">
                    <label>Username</label>
                    <InputText
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="field col-6 md:col-6">
                    <label>Phone Number*</label>
                    <InputText
                        name="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>
                <div className="field col-6 md:col-6">
                    <label htmlFor="description">Quiz Completed</label>
                    <Dropdown
                        value={quizCompleted}
                        name="Quiz Completed"
                        onChange={(e) => setQuizCompleted(e.value)}
                        options={[
                            { value: true, name: "true" },
                            { value: false, name: "false" }
                        ]}
                        optionLabel="name"
                        optionValue="value"
                        placeholder="Select approval status"
                    />
                </div>
                <div className="field col-6 md:col-6">
                    <label htmlFor="description">Select Role</label>
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
                        optionValue="value"
                        placeholder="Select role"
                    />
                </div>
                <div className="field col-6 md:col-6">
                    <label htmlFor="description">Approve</label>
                    <Dropdown
                        value={approved}
                        name="approved"
                        onChange={(e) => setApproved(e.value)}
                        options={[
                            { value: true, name: "true" },
                            { value: false, name: "false" }
                        ]}
                        optionLabel="name"
                        optionValue="value"
                        placeholder="Select approval status"
                    />
                </div>
                <div className="field col-6 md:col-6">
                    <label>Skills</label>
                    <Select
                        defaultValue={skills}
                        options={skillsOptions}
                        name="skills"
                        isMulti
                        placeholder="Select your skills"
                        onChange={(e) => {
                            setSkills(e.map(skill => skill.value));
                        }}
                        className="basic-multi-select"
                        classNamePrefix="select"
                    />
                </div>
                <div className="field col-6 md:col-6">
                    <label>Points</label>
                    <InputNumber
                        value={points}
                        onValueChange={(e) => setPoints(e.value)}
                        mode="decimal"
                        showButtons
                        min={0}
                    />
                </div>
                {role === "skillexpert" && (
                    <>
                        <div className="field col-6 md:col-6">
                            <label>Github Profile</label>
                            <InputText
                                name="githubProfile"
                                value={githubProfile}
                                onChange={(e) => setGithubProfile(e.target.value)}
                            />
                        </div>
                        <div className="field col-6 md:col-6">
                            <label>Linkedin Profile</label>
                            <InputText
                                name="linkedinProfile"
                                value={linkedinProfile}
                                onChange={(e) => setLinkedinProfile(e.target.value)}
                            />
                        </div>
                    </>
                )}
            </div>
        </Dialog>
    );
}

export default UpdateUserMenu;
