import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, Form, FormGroup, Label, Input, FormFeedback } from 'reactstrap';
import "./login.css";
import { Link } from "react-router-dom";
import { LoginUser } from "../../actions/user.action"


function Register() {
    const { control, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        await LoginUser(data, () => { });
    };

    return (
        <div className="login-container">
            <div className="login-wrapper">
                <h2>Sign In</h2>
                <Form onSubmit={handleSubmit(onSubmit)} method="post">
                    <div className="row">

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
                    <div className="row">
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
                    <Button color="primary" type="submit">Sign In</Button>
                </Form>
                <div className="row">
                    <div className="col-md-12">
                        <p className="login_typo pt-3">
                            <Link to="/resetPassword">Forgot Password</Link>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Register;
