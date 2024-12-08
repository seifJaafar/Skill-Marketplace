import React, { useEffect, useState } from "react";
import { Password } from 'primereact/password';
import { Button } from "primereact/button";
import { UpdatePass } from "../../actions/user.action";
import '../../assets/Profile.css';
function UpdatePassword() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");



    const handleCancel = () => {
        setOldPassword("");
        setNewPassword("");
    };

    const handleSubmit = async () => {
        const user = {
            OldPassword: oldPassword,
            NewPassword: newPassword,
        };
        const response = await UpdatePass(user);
        if (response?.error) {
            console.log(response.error);
        }
        handleCancel();
    };

    return (
        <>
            <div className="form-row">
                <div className="form-field">
                    <label>Old Password</label>
                    <Password
                        name="OldPassword"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                        toggleMask
                        className="large-input"
                    />
                </div>
                <div className="form-field">
                    <label>New Password</label>
                    <Password
                        name="NewPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        toggleMask
                        className="large-input"
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
                    label="Change Password"
                    icon="pi pi-check"
                    className="p-button-submit"
                    onClick={handleSubmit}
                />
            </div>
        </>
    );
}

export default UpdatePassword;
