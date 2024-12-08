import React, { useState, useEffect } from "react";
import { GetCourses } from "../../actions/courses.action";
import { DataView } from "primereact/dataview";
import { Button } from "primereact/button";
import { classNames } from 'primereact/utils';
import { Tag } from 'primereact/tag';
import { Link } from "react-router-dom";
function Courses({ user }) {
    const [courses, setCourses] = useState([]);

    // Fetch courses when component mounts
    const fetchCourses = async () => {
        const response = await GetCourses();
        console.log(response);
        if (response?.courses) {
            console.log(response.courses);
            setCourses(response.courses);
        }
    };

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

    useEffect(() => {
        fetchCourses();
    }, []);

    const itemTemplate = (course, index) => {
        return (
            <div className="col-12 mt-3" key={course.id}>
                <div className={classNames('flex flex-row xl:flex-row xl:align-items-start p-4 gap-4', { 'border-top-1 surface-border': index !== 0 })} style={{ background: '#1E1F2A', color: "white", width: "100%" }}>
                    <div className="" >
                        <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" style={{ width: "400px", height: '200px', objectFit: 'cover' }} src={getFileUrl(course.thumbnail)} alt={course.title} />
                    </div>
                    <div className="flex flex-row sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                        <div className="flex flex-column gap-3" style={{ height: '100%', justifyContent: 'space-between' }}>
                            <div className="text-2xl font-bold" style={{ color: "white", textAlign: "left" }}>{course.title}</div>
                            <div className="text-lg " style={{ textAlign: 'left', color: 'white' }}>{course.description && course.description.length < 50 ? course.description : course.description.slice(0, 50) + '...'}</div>

                            <div className="text-md" style={{ textAlign: 'left', color: 'white' }} >Offered By :  {course.skillExpert?.username ? <Link to={`/profile/${course.skillExpert?._id}`}>{course.skillExpert?.username}</Link> : "unknown"}</div>
                            <div className="flex flex-row flex-wrap" style={{ maxWidth: "250px" }}>
                                {course.skillTags && course.skillTags.map((tag, index) => {
                                    return <Tag key={index} value={tag} severity="info" className="p-mr-2 m-2 " />;
                                })}
                            </div>
                            <div className="" style={{ textAlign: 'left' }}>
                                <span className="text-md" style={{ color: "white" }}>Users Enrolled: {course.usersEnrolled}</span>
                            </div>
                        </div>
                        <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                            <span className="text-2xl font-semibold">${course.price}</span>
                            <Link to={`/course/${course._id}`}> <Button icon="pi pi-shopping-cart" label="view More" className="p-button-rounded"><Link to={`/course/${course.id}`}></Link></Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    };



    const listTemplate = (items) => {
        if (!items || items.length === 0) return null;

        let list = items.map((course, index) => {
            return itemTemplate(course, index);
        });

        return <div className="grid grid-nogutter">{list}</div>;
    };

    // Optional: You can customize headers or sorting based on your requirements
    const header = () => {
        return (
            <div className="table-header">
                <h5>Available Courses</h5>
            </div>
        );
    };

    // Sorting fields and order, if needed
    const sortField = "name"; // Example field to sort by
    const sortOrder = 1; // 1 for ascending, -1 for descending

    return (
        <div>
            <h1>Shop</h1>
            <DataView
                paginator
                rows={10}
                value={courses}
                listTemplate={listTemplate}
                header={header()}
                sortField={sortField}
                sortOrder={sortOrder}
            />
        </div>
    );
}

export default Courses;
