import React, { useState, useEffect } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import SkillPostsTable from "./SkillPostsTable";
import AddSkillPost from "./AddSkillPost";
import ShowSkillPosts from "./ShowSkillPosts";
import Jobs from "../jobs/Jobs";
import "../../assets/Profile.css";
function SkillPost({ skills, name, userRole }) {
    if (!skills) {
        skills = [];
    }
    const isMobile = useMediaQuery({ maxWidth: 992 });
    const [key, setKey] = useState("1");

    return (
        <div className='layout-main'>
            <div className='layout-content'>
                <Tabs activeKey={key} onSelect={(k) => setKey(k)} className={`d-flex flex-wrap justify-content-center ${isMobile ? "flex-column mt-5" : ""}`} style={{ maxWidth: "100%" }}>
                    <Tab eventKey="1" title={"SkillPosts"} >
                        <div className="table-container">
                            <ShowSkillPosts />
                        </div>
                    </Tab>
                    {userRole === "skillprovider" && (
                        <Tab eventKey="2" title={"My SkillPosts"} >
                            <div className='header-fileInput'>
                                <h1 style={{ fontWeight: "600" }}>Manage your SkillPosts</h1>

                            </div>
                            <SkillPostsTable />
                        </Tab>
                    )}
                    {userRole === "skillprovider" && (
                        <Tab eventKey="3" title={"Post SkillPost"} >
                            <AddSkillPost skills={skills} name={name} />
                        </Tab>
                    )}
                </Tabs>
            </div>
        </div>
    )
}
export default SkillPost;