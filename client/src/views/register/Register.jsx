import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, Form, FormGroup, Label, Input, FormFeedback, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import "./register.css";
import { useNavigate, Link } from "react-router-dom";
import Select from 'react-select';
import { RegisterUser } from "../../actions/user.action";
import { GetSkills } from "../../actions/skill.action";

function Register() {
    const { control, handleSubmit, formState: { errors } } = useForm();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [shownRole, setShownRole] = useState("Select role");
    const [selectedRole, setSelectedRole] = useState(null);
    const [skillsOptions, setSkillsOptions] = useState([]);
    const navigate = useNavigate();

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

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
    const redirectClient = () => {
        navigate("/clientdashboard");
    }
    const onSubmit = async (data) => {
        let formData = { ...data };


        if (selectedRole !== "client") {
            const skillsIds = data.skills.map(skill => skill.value);
            formData.skills = skillsIds;
        } else {

            delete formData.skills;
        }


        if (selectedRole !== "skillexpert") {
            delete formData.githubProfile;
            delete formData.linkedinProfile;
        }

        const user = await RegisterUser(formData, redirectClient);

        if (user && user.user?.role === "skillprovider" && !user.user.quizCompleted) {
            console.log("Navigating to quiz...");
            navigate(`/quiz/${formData.skills[0]}`, { state: { skills: formData.skills, userID: user.user._id } });
        }
    };


    return (
        <div className="signup-container">
            <div className="signup-wrapper">
                <h2>Sign Up</h2>
                <Form onSubmit={handleSubmit(onSubmit)} method="post">
                    <div className="row">
                        <div className="col-md-6">
                            <FormGroup>
                                <Label for="email">Email</Label>
                                <Controller
                                    name="email"
                                    control={control}
                                    defaultValue=""
                                    rules={{
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                            message: "Invalid email address",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <Input
                                            id="email"
                                            type="email"
                                            {...field}
                                            invalid={!!errors.email}
                                        />
                                    )}
                                />
                                {errors.email && <FormFeedback>{errors.email.message}</FormFeedback>}
                            </FormGroup>
                        </div>
                        <div className="col-md-6">
                            <FormGroup>
                                <Label for="phone">Phone</Label>
                                <Controller
                                    name="phone"
                                    control={control}
                                    defaultValue=""
                                    rules={{
                                        required: "Phone number is required",
                                        pattern: {
                                            value: /^[0-9]{8}$/,
                                            message: "Phone number must be 8 digits",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <Input
                                            id="phone"
                                            type="tel"
                                            {...field}
                                            invalid={!!errors.phone}
                                        />
                                    )}
                                />
                                {errors.phone && <FormFeedback>{errors.phone.message}</FormFeedback>}
                            </FormGroup>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <FormGroup>
                                <Label for="username">Username</Label>
                                <Controller
                                    name="username"
                                    control={control}
                                    defaultValue=""
                                    rules={{
                                        required: "Username is required",
                                        minLength: {
                                            value: 3,
                                            message: "Username must be at least 3 characters long",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <Input
                                            id="username"
                                            type="text"
                                            {...field}
                                            invalid={!!errors.username}
                                        />
                                    )}
                                />
                                {errors.username && <FormFeedback>{errors.username.message}</FormFeedback>}
                            </FormGroup>
                        </div>
                        <div className="col-md-6">
                            <FormGroup>
                                <Label for="password">Password</Label>
                                <Controller
                                    name="password"
                                    control={control}
                                    defaultValue=""
                                    rules={{
                                        required: "Password is required",
                                        minLength: {
                                            value: 4,
                                            message: "Password must be at least 4 characters long",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <Input
                                            id="password"
                                            type="password"
                                            {...field}
                                            invalid={!!errors.password}
                                        />
                                    )}
                                />
                                {errors.password && <FormFeedback>{errors.password.message}</FormFeedback>}
                            </FormGroup>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <FormGroup>
                                <Label for="role">Role</Label>
                                <Controller
                                    name="role"
                                    control={control}
                                    defaultValue=""
                                    rules={{
                                        required: "Role is required",
                                    }}
                                    render={({ field }) => (
                                        <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                                            <DropdownToggle caret>
                                                {shownRole}
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem onClick={() => { field.onChange("skillprovider"); setShownRole("Skill Provider"); setSelectedRole("skillprovider"); }}>Skill Provider</DropdownItem>
                                                <DropdownItem onClick={() => { field.onChange("skillexpert"); setShownRole("Skill Expert"); setSelectedRole("skillexpert"); }}>Skill Expert</DropdownItem>
                                                <DropdownItem onClick={() => { field.onChange("client"); setShownRole("Client"); setSelectedRole("client"); }}>Client</DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                    )}
                                />
                                {errors.role && <FormFeedback className="d-block">{errors.role.message}</FormFeedback>}
                            </FormGroup>
                        </div>
                        {selectedRole !== "client" && (
                            <div className="col-md-6">
                                <FormGroup>
                                    <Label for="skills">Skills</Label>
                                    <Controller
                                        name="skills"
                                        control={control}
                                        defaultValue={[]}
                                        rules={{
                                            required: "Please select at least one skill",
                                        }}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                options={skillsOptions}
                                                name='skills'
                                                isMulti
                                                placeholder="Select your skills"
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                            />
                                        )}
                                    />
                                    {errors.skills && <FormFeedback className="d-block">{errors.skills.message}</FormFeedback>}
                                </FormGroup>
                            </div>
                        )}

                    </div>

                    {/* Conditionally render GitHub and LinkedIn fields for 'skillexpert' */}
                    {selectedRole === "skillexpert" && (
                        <div className="row">
                            <div className="col-md-6">
                                <FormGroup>
                                    <Label for="github">GitHub Profile</Label>
                                    <Controller
                                        name="githubProfile"
                                        control={control}
                                        defaultValue=""
                                        rules={{
                                            required: "GitHub profile link is required",
                                            pattern: {
                                                value: /^(https?:\/\/)?(www\.)?github\.com\/[A-z0-9_-]+\/?$/,
                                                message: "Invalid GitHub profile link",
                                            },
                                        }}
                                        render={({ field }) => (
                                            <Input
                                                id="github"
                                                type="url"
                                                {...field}
                                                invalid={!!errors.githubProfile}
                                            />
                                        )}
                                    />
                                    {errors.githubProfile && <FormFeedback>{errors.githubProfile.message}</FormFeedback>}
                                </FormGroup>
                            </div>
                            <div className="col-md-6">
                                <FormGroup>
                                    <Label for="linkedin">LinkedIn Profile</Label>
                                    <Controller
                                        name="linkedinProfile"
                                        control={control}
                                        defaultValue=""
                                        rules={{
                                            required: "LinkedIn profile link is required",
                                            pattern: {
                                                value: /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[A-z0-9_-]+\/?$/,
                                                message: "Invalid LinkedIn profile link",
                                            },
                                        }}
                                        render={({ field }) => (
                                            <Input
                                                id="linkedin"
                                                type="url"
                                                {...field}
                                                invalid={!!errors.linkedinProfile}
                                            />
                                        )}
                                    />
                                    {errors.linkedinProfile && <FormFeedback>{errors.linkedinProfile.message}</FormFeedback>}
                                </FormGroup>
                            </div>
                        </div>
                    )}

                    <Button color="primary" type="submit">Sign Up</Button>
                </Form>
                <p className="signup_typo pt-3">
                    {"Already have an account? "}
                    <Link to="/login">Sign In</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
