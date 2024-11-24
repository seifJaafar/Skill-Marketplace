import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ResetPass } from "../../actions/user.action"
import { Form, Input, InputGroup, InputGroupText, Label, Button } from "reactstrap";
import { Mail } from "react-feather";
import "../login/login.css"

function ResetPassword() {
    const [email, setEmail] = useState("");
    const handleSubmit = (e) => {
        e.preventDefault();
        ResetPass({ email }, () => { })
    };
    return (
        <>
            <div className="login-container">
                <div className="login-wrapper">
                    <h2>Forgot Password</h2>
                    <Form className="mt-5 pt-5">
                        <div className="mb-5">
                            <Label className="ps-3 pb-2 signup_label" id="email">
                                {"Email"}
                            </Label>
                            <InputGroup className="border-0">
                                <Input
                                    id="email"
                                    className="signup_input border_left"
                                    placeholder={"Saisie votre email"}
                                    name="email"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value) }}
                                />
                                <InputGroupText className="signup_input border_right">
                                    <Mail size={18} className="color_grey " />
                                </InputGroupText>
                            </InputGroup>
                        </div>
                        <Button color="primary" onClick={handleSubmit} type="submit">Reset Password</Button>
                    </Form>
                    <div className="row">
                        <div className="col-md-12">
                            <p className="login_typo pt-3">
                                <Link to="/login">Sign In</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>)
}

export default ResetPassword;