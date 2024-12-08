import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { Dialog } from "primereact/dialog";
import { toast } from "react-hot-toast";
import { Tab, Tabs } from "react-bootstrap";
import { connectStripeAccount } from '../../actions/user.action';
import AccountInformations from './AccountInformations';
import UpdatePassword from './UpdatePassword';
function Profile({ user }) {
    const isMobile = useMediaQuery({ maxWidth: 992 });
    const navigate = useNavigate();
    const [key, setKey] = useState("1");
    const handleConnectStripe = async () => {
        const response = await connectStripeAccount();
        console.log(response);
    }
    return (
        <div className="layout-main">
            <div className="layout-content">
                <Tabs
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    className={`d-flex flex-wrap justify-content-center ${isMobile ? "flex-column mt-5" : ""}`}
                    style={{ maxWidth: "100%" }}
                >
                    <Tab eventKey="1" title={"Account Informations"}>
                        <AccountInformations user={user} />
                    </Tab>
                    {user.role !== "client" && (
                        <Tab eventKey="2" title={"Payment Methods"}>
                            <div className='mt-4 text-center'>
                                {user.stripeAccountId ? (
                                    <div>
                                        <h4>{`Stripe Account Already Connected with ${user.email ? user.email : "Your Email"}`}</h4>
                                    </div>
                                ) : (
                                    <div>
                                        <h4>No Stripe Account Connected</h4>
                                        <p>Connect your stripe account to receive payments</p>
                                        <Button label="Connect Stripe" onClick={handleConnectStripe} className='mt-3' />
                                    </div>
                                )}

                            </div>
                        </Tab>
                    )}
                    <Tab eventKey="3" title={"Change Password"}>
                        <UpdatePassword />
                    </Tab>
                </Tabs>
            </div>
        </div>
    );
}
export default Profile;