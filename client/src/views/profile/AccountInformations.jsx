import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";  // Import FileUpload
import { GetSkills } from "../../actions/skill.action";
import { UpdateUser } from "../../actions/user.action";

function AccountInformations({ user }) {
    const [email, setEmail] = useState(user?.email || "");
    const [username, setUsername] = useState(user?.username || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [skillsOptions, setSkillsOptions] = useState([]);
    const [skills, setSkills] = useState([]);
    const [oldSkills, setOldSkills] = useState([]);
    const [githubProfile, setGithubProfile] = useState(user?.githubProfile || "");
    const [linkedinProfile, setLinkedinProfile] = useState(user?.linkedinProfile || "");
    const [websiteLink, setWebsiteLink] = useState(user?.websiteLink || "");  // New state for website link
    const [avatar, setAvatar] = useState(user?.avatar || "");  // Avatar state
    const [resume, setResume] = useState(user?.resume || "");  // Resume state
    const [defaultFiles, setDefaultFiles] = useState(true);  // Default files state
    const navigate = useNavigate();

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

        // Populate fields only if `user` is defined
        if (user) {
            setEmail(user.email || "");
            setUsername(user.username || "");
            setPhone(user.phone || "");
            setOldSkills(user.skills?.map(skill => skill._id) || []);
            setSkills(user.skills?.map(skill => ({ value: skill._id, label: skill.name })) || []);
            setGithubProfile(user.githubProfile || "");
            setLinkedinProfile(user.linkedinProfile || "");
            setWebsiteLink(user.websiteLink || "");
            setAvatar(user.avatar || "");
            setResume(user.resume || "");
        }
    }, [user]);

    const handleCancel = () => {
        setEmail(user?.email || "");
        setUsername(user?.username || "");
        setPhone(user?.phone || "");
        setSkills(user?.skills?.map(skill => ({ value: skill._id, label: skill.name })) || []);
        setGithubProfile(user?.githubProfile || "");
        setLinkedinProfile(user?.linkedinProfile || "");
        setWebsiteLink(user?.websiteLink || "");
        setAvatar(user?.avatar || "");
        setResume(user?.resume || "");
    };

    const handleSubmit = async () => {
        const newSkills = skills.filter(skill => !oldSkills.includes(skill.value)).map(skill => skill.value);
        const skillsIds = skills.map(skill => skill.value || skill);

        let formData = new FormData();
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('username', username);
        formData.append('skills', JSON.stringify(skillsIds));  // Skills as JSON array
        formData.append('githubProfile', githubProfile);
        formData.append('linkedinProfile', linkedinProfile);
        formData.append('websiteLink', websiteLink);  // Include website link
        formData.append('avatar', avatar);  // Include avatar file
        formData.append('resume', resume);  // Include resume file
        formData.append('quizCompleted', newSkills.length === 0);

        console.log(newSkills);
        console.log("New skills:", newSkills);
        console.log(formData)
        await UpdateUser(formData);  // Pass the formData to the backend

        if (newSkills.length > 0) {
            console.log("New skills:", newSkills);
            navigate(`/quiz/${newSkills[0]}`, { state: { skills: newSkills, userID: user._id } });
        }
    };

    const handleAvatarUpload = (e) => {
        const file = e.files[0];
        setAvatar(file);
        setDefaultFiles(false);
    };

    const handleResumeUpload = (e) => {
        const file = e.files[0];
        setResume(file);  // Set the uploaded file directly
        setDefaultFiles(false);
    };

    // Function to generate file URL if valid
    const getFileUrl = (file) => {
        if (file) {
            if (typeof file === 'string') {
                // If file is already a URL (string), return as is
                return `${process.env.REACT_APP_API_HOST}/${file}`;
            } else if (file instanceof File) {
                // If file is a File object, use local URL
                return URL.createObjectURL(file);  // Create object URL for local file
            }
        }
        return null;
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
                {user.role !== "client" && (
                    <div className="form-field">
                        <label>Skills</label>
                        <Select
                            value={skills}
                            options={skillsOptions}
                            isMulti={true}
                            placeholder="Select skills"
                            onChange={(selected) => setSkills(selected || [])}
                            className="select-input"
                        />
                    </div>
                )}

            </div>
            {user.role !== "client" && (
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
            )}

            <div className="form-row">
                <div className="form-field">
                    <label>Website Link</label>
                    <InputText
                        name="websiteLink"
                        value={websiteLink}
                        onChange={(e) => setWebsiteLink(e.target.value)}
                        className="large-input"
                    />
                </div>
                <div className="form-field">
                    <label>Avatar</label>
                    <FileUpload
                        name="avatar"
                        accept="image/*"
                        customUpload
                        uploadHandler={handleAvatarUpload}
                        auto
                        mode="basic"
                        chooseLabel="Choose Avatar"
                        className="file-upload"
                    />
                    {avatar && (
                        <img
                            src={getFileUrl(avatar)}  // Using getFileUrl to show image
                            alt="Avatar Preview"
                            width="100"
                            className="mt-4"
                        />
                    )}
                </div>
                {user.role !== "client" && (
                    <div className="form-field">
                        <label>Resume</label>
                        <FileUpload
                            name="resume"
                            accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            customUpload
                            uploadHandler={handleResumeUpload}
                            auto
                            mode="basic"
                            chooseLabel="Choose Resume"
                            className="file-upload"
                        />
                        {resume && (
                            <a href={getFileUrl(resume)} target="_blank" rel="noopener noreferrer">Resume Preview</a>
                        )}
                    </div>
                )}

            </div>
            <div className="form-actions">
                <Button label="Save" icon="pi pi-check" onClick={handleSubmit} />
                <Button label="Cancel" icon="pi pi-times" onClick={handleCancel} className="p-button-secondary" />
            </div>
        </>
    );
}

export default AccountInformations;
