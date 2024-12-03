import React, { useState, useEffect } from "react";
import { DataView } from "primereact/dataview";
import { Button } from "primereact/button";
import { classNames } from 'primereact/utils';
import { Dropdown } from 'primereact/dropdown';
import { useNavigate } from "react-router-dom";
import { GetReviewsByUser } from "../../actions/review.action";
import { InputText } from 'primereact/inputtext';
import "../../assets/ShowSkillPosts.css";
import { GetSkillPosts } from "../../actions/skillPost.action";
import { GetSkills } from "../../actions/skill.action"
import Badge from "../../partials/Badge";

function ShowSkillPosts() {
    const [skillPosts, setSkillPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortKey, setSortKey] = useState('');
    const [sortOrder, setSortOrder] = useState(0);
    const [sortField, setSortField] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [skillsOptions, setSkillsOptions] = useState([]);
    const [selectedSkill, setSelectedSkill] = useState(null);
    const navigate = useNavigate();

    const sortOptions = [
        { label: 'Suggestions High to Low', value: '!suggestions' },
        { label: 'Suggestions Low to High', value: 'suggestions' }
    ];

    useEffect(() => {
        fetchSkillPosts();
        fetchSkills(); // Fetch skills on component load
    }, []);

    const fetchSkillPosts = async () => {
        try {
            const response = await GetSkillPosts();
            const postsWithRatings = await Promise.all(
                response.map(async (post) => {
                    const response = await GetReviewsByUser(post.providerId);
                    const reviews = response.reviews;
                    const averageRating = reviews.length > 0
                        ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
                        : 0;
                    return { ...post, averageRating, totalReviews: reviews.length, skillCategory: post.skillCategory || { _id: null, name: "Uncategorized" } };
                })
            );
            setSkillPosts(postsWithRatings);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching skill posts:", error);
            setLoading(false);
        }
    };

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

    const onSortChange = (event) => {
        const value = event.value;
        if (value.indexOf('!') === 0) {
            setSortOrder(-1);
            setSortField(value.substring(1));
        } else {
            setSortOrder(1);
            setSortField(value);
        }
        setSortKey(value);
    };

    const resetFilters = () => {
        setSearchTerm('');
        setSelectedSkill(null);
        setSortKey('');
        setSortField('');
        setSortOrder(0);
    };

    const header = () => {
        return (
            <div className="flex justify-content-evenly">
                <Dropdown
                    options={sortOptions}
                    value={sortKey}
                    optionLabel="label"
                    placeholder="Sort By Suggestions"
                    onChange={onSortChange}
                    className="w-full sm:w-14rem"
                />
                <Dropdown
                    options={skillsOptions}
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.value)}
                    placeholder="Filter by Skill"
                    className="w-full sm:w-14rem"
                />
                <InputText
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search Skill Posts"
                    className="w-full sm:w-14rem"
                />
                <Button
                    label="Reset Filters"
                    icon="pi pi-refresh"
                    className="p-button-secondary w-full sm:w-14rem"
                    onClick={resetFilters}
                />
            </div>
        );
    };

    const sortData = (data, field, order) => {
        return data.sort((a, b) => {
            if (order === 1) {
                return a[field] > b[field] ? 1 : -1;
            } else {
                return a[field] < b[field] ? 1 : -1;
            }
        });
    };

    useEffect(() => {
        if (sortField) {
            const sortedData = sortData([...skillPosts], sortField, sortOrder);
            setSkillPosts(sortedData);
        }
    }, [sortField, sortOrder]);

    const filteredSkillPosts = skillPosts.filter((post) => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (post.providerName && post.providerName.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesSkill = !selectedSkill || post.skillCategory?._id === selectedSkill;

        return matchesSearch && matchesSkill;
    });

    const itemTemplate = (skillpost, index) => {
        const maxLength = 70;
        const truncatedDescription = skillpost.description.length > maxLength
            ? skillpost.description.substring(0, maxLength) + "..."
            : skillpost.description;

        return (
            <div className="col-12 mt-4" key={skillpost._id}>
                <div
                    className={classNames(
                        'custom-card flex flex-row justify-content-between align-items-start p-4 gap-4 w-full',
                        { 'border-top-1 surface-border': index !== 0 }
                    )}
                >
                    <div className="flex flex-column ml-6" style={{ flex: 1, textAlign: 'left' }}>
                        <div className="text-xl font-bold" style={{ color: 'white' }}>
                            {skillpost.title}
                        </div>
                        <div className="text-sm mt-2 truncated-description">
                            {truncatedDescription}
                        </div>
                        <div className="text-sm mt-2">
                            <Badge>{skillpost.suggestions} propositions</Badge>
                        </div>
                        <div className="text-sm text-500 mt-1">
                            Posted by: <span className="font-semibold">{skillpost.providerName || 'Anonymous'}</span>
                            {skillpost.averageRating > 0 && (
                                <>
                                    <i className="pi pi-star-fill ml-3" style={{ color: '#C9E782' }}></i>
                                    <span className="ml-2">
                                        {skillpost.averageRating.toFixed(1)} ({skillpost.totalReviews} reviews)
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-column align-items-end text-right mr-6">
                        <div>
                            <div className="text-sm font-semibold">
                                Skill Provided: {skillpost.skillCategory?.name || 'N/A'}
                            </div>
                            <div className="text-sm font-semibold">
                                Exchange Skill: {skillpost.exchangeSkill?.name || 'N/A'}
                            </div>
                            <div className="text-sm text-500">
                                Level: {skillpost.skillLevel || 'Not specified'}
                            </div>
                        </div>
                        <Button
                            label="View Details"
                            icon="pi pi-plus"
                            className="p-button-rounded p-button-sm mt-3 btn-suggest"
                            onClick={() => navigate(`/skillpost/${skillpost._id}`)}
                        />
                    </div>
                </div>
            </div>
        );
    };

    const listTemplate = (items) => {
        if (!items || items.length === 0) {
            return <div className="no-items-message">No skill posts available.</div>;
        }

        return (
            <div className="grid grid-nogutter">
                {items.map((product, index) => itemTemplate(product, index))}
            </div>
        );
    };

    return (
        <div className="show-skill-posts">
            {loading ? (
                <p>Loading skill posts...</p>
            ) : (
                <DataView
                    value={filteredSkillPosts}
                    layout="list"
                    listTemplate={listTemplate}
                    paginator
                    rows={5}
                    header={header()}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    emptyMessage="No skill posts available."
                />
            )}
        </div>
    );
}

export default ShowSkillPosts;
