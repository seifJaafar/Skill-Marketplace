import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { GetEnrollments } from "../../actions/enrollement.action";
import { useNavigate } from "react-router-dom";
import "../../assets/Datatable.css";

function Enrollments({ user }) {
    const [enrollments, setEnrollments] = useState([]);
    const navigate = useNavigate();
    // Fetch enrollments data
    const fetchEnrollments = async () => {
        const response = await GetEnrollments();
        if (response.error) {
            console.error(response.error);
        } else {
            setEnrollments(response);
        }
    };

    // Handle "Complete Learning" button click
    const handleCompleteLearning = (enrollement) => {
        console.log(`Completing learning for enrollment: ${enrollement._id}`);
        console.log(enrollement.course.chapters);
        navigate(`/learn/${enrollement.course._id}`, { chapters: enrollement.course.chapters });
    };

    useEffect(() => {
        fetchEnrollments();
        console.log(enrollments)
    }, []);

    // Render the "Complete Learning" button
    const actionBodyTemplate = (rowData) => {
        return (
            <Button
                label="Complete Learning"
                icon="pi pi-check"
                className="p-button-success p-button-sm"
                onClick={() => handleCompleteLearning(rowData)}
            />
        );
    };

    return (
        <>
            <div className="layout-main">
                <div className="layout-main__content">
                    <h1 className="mb-4">Enrollments</h1>
                    <div className="table-container">
                        <DataTable
                            value={enrollments}
                            paginator
                            rows={10}
                            className="datatable-custom "
                            emptyMessage="No enrollments found."
                            header="Enrollments"
                        >
                            {/* Course Title Column */}
                            <Column
                                field="courseTitle"
                                header="Course Title"
                                body={(rowData) => rowData.course?.title || "N/A"}
                            />

                            {/* Action Column for "Complete Learning" */}
                            <Column
                                body={actionBodyTemplate}
                                header="Actions"
                                style={{ width: "150px" }}
                            />
                        </DataTable>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Enrollments;
