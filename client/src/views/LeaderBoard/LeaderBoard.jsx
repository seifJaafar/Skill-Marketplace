import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { DataTable } from 'primereact/datatable';
import { Tab, Tabs } from "react-bootstrap";
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Chip } from 'primereact/chip';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import '../../assets/Datatable.css';
import { GetReviewsByUser } from "../../actions/review.action";
import toast from "react-hot-toast";
import { GetAllUsers } from "../../actions/user.action";
import { GetSkills } from "../../actions/skill.action";

function LeaderBoard({ user }) {
    const isMobile = useMediaQuery({ maxWidth: 992 });
    const navigate = useNavigate();
    const [key, setKey] = useState("1");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [skills, setSkills] = useState([]);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [selectedSkill, setSelectedSkill] = useState(null);  // Add selectedSkill state

    const calculateAverageRating = (reviews) => {
        if (reviews && reviews.length > 0) {
            const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
            return (totalRating / reviews.length).toFixed(2);
        }
        return 0; // Default to 0 if no reviews
    };

    const fetchSkills = async () => {
        try {
            const response = await GetSkills();
            setSkills(response);
        } catch (error) {
            console.error("Error fetching Skills:", error);
        }
    }

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await GetAllUsers({ IncludeUser: true, LeaderBoard: true }); // Fetch users
            if (response) {
                const usersWithRatings = await Promise.all(response.map(async (user) => {
                    // Fetch reviews for each user
                    const reviewsResponse = await GetReviewsByUser(user._id);
                    const averageRating = calculateAverageRating(reviewsResponse.reviews); // Calculate average rating
                    const TotalRating = reviewsResponse.reviews.length;
                    // Return user data with average rating
                    return { ...user, averageRating, TotalRating };
                }));

                usersWithRatings.sort((a, b) => {
                    const ratingScoreA = a.averageRating * Math.log(a.TotalRating + 1); // Add +1 to avoid log(0)
                    const ratingScoreB = b.averageRating * Math.log(b.TotalRating + 1);
                    return ratingScoreB - ratingScoreA;
                });

                // Filter users by selected skill
                if (selectedSkill) {
                    const filteredUsers = usersWithRatings.filter(user =>
                        user.skills && user.skills.some(skill => skill._id === selectedSkill._id)
                    );
                    setUsers(filteredUsers);
                } else {
                    setUsers(usersWithRatings);
                }
            }
        } catch (err) {
            console.log(err);
            toast.error("Error fetching users and reviews");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchSkills();
    }, [selectedSkill]);  // Re-fetch users when selectedSkill changes

    const getFileUrl = (file) => {
        if (file) {
            if (typeof file === 'string') {
                return `${process.env.REACT_APP_API_HOST}/${file}`;
            } else if (file instanceof File) {
                return URL.createObjectURL(file);
            }
        }
        return null;
    };

    const UsernameTemplate = (rowData) => {
        return (
            <div className="d-flex align-items-center">
                <img src={getFileUrl(rowData?.avatar)} alt={rowData.username} style={{ width: '50px', height: "50px", borderRadius: "50%", objectFit: "cover" }} />
                <span className="ms-2">{rowData.username}</span>
            </div>
        );
    };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        const _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-end">
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </IconField>
                <Dropdown
                    value={selectedSkill}
                    options={skills}
                    onChange={(e) => setSelectedSkill(e.value)}
                    optionLabel="name"
                    placeholder="Select a Skill"
                    className="p-mb-3 ml-2 mr-2"
                />
                <Button label="Clear" onClick={() => setSelectedSkill(null)} className="p-button-danger p-ml-2 p-mb-3" />
            </div>
        );
    };

    const SkillsTemplate = (rowData) => {
        return (
            <div className="skills-chip-container" style={{ maxWidth: '300px', whiteSpace: 'normal', wordWrap: 'break-word' }}>
                {rowData.skills && rowData.skills.map((skill) => (
                    <Chip key={skill._id} label={skill.name.toUpperCase()} className="p-mr-2 ml-2" />
                ))}
            </div>
        );
    };

    const header = renderHeader();

    return (
        <div className="layout-main">
            <div className="layout-content">
                <Tabs
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    className={`d-flex flex-wrap justify-content-center ${isMobile ? "flex-column mt-5" : ""}`}
                    style={{ maxWidth: "100%" }}
                >
                    <Tab eventKey="1" title={"SkillProviders LeaderBoard"}>
                        <h1>SkillProvider LeaderBoard</h1>

                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <div className="table-container">
                                <DataTable
                                    value={users}
                                    className="datatable-custom"
                                    paginator
                                    rows={10}
                                    filterDisplay="row"
                                    loading={loading}
                                    globalFilter={filters.global.value}
                                    globalFilterFields={['username']}
                                    header={header}
                                >
                                    <Column field="rank" header="Rank" body={(rowData, { rowIndex }) => rowIndex + 1} />
                                    <Column field="username" filterField="username" header="Username" body={UsernameTemplate} />
                                    <Column field="averageRating" header="Average Rating" />
                                    <Column field="TotalRating" header="Total Rating" />
                                    <Column field="skills" header="Skills" body={SkillsTemplate} />
                                    <Column
                                        body={(rowData) => (
                                            <Button label="View Profile" onClick={() => navigate(`/profile/${rowData._id}`)} />
                                        )}
                                    />
                                </DataTable>
                            </div>
                        )}
                    </Tab>
                </Tabs>
            </div>
        </div >
    );
}

export default LeaderBoard;
