import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GetSkillPostsByUser } from "../../actions/skillPost.action";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import Description from "./popups/Description";
import Dates from "./popups/Dates";
import Badge from "../../partials/Badge";
import "../../assets/Datatable.css";
function SkillPostsTable() {
    const [skillPosts, setSkillPosts] = useState([]);
    const [first, setFirst] = useState(0);
    const [descriptionDialogue, setDescriptionDialog] = useState(false);
    const [datesDialogue, setDatesDialog] = useState(false);
    const [item, setItem] = useState({});
    const [rows, setRows] = useState(10);
    const onPage = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };
    const navigate = useNavigate();
    useEffect(() => {
        fetchSkillPosts();
    }, []);
    const fetchSkillPosts = async () => {
        try {
            const response = await GetSkillPostsByUser();
            console.log("Skill Posts:", response);
            setSkillPosts(response);
        } catch (error) {
            console.error("Error fetching Skill Posts:", error);
        }
    };
    const openDatesDialogue = (row) => {
        setDatesDialog(true);
        setItem({ ...row });
    }
    const handleCloseDates = () => {
        setItem({});
        setDatesDialog(false);
    }
    const openDescriptionDialogue = (row) => {
        setDescriptionDialog(true);
        setItem({ ...row });
    }
    const viewMoreTemplate = (row) => {
        if (row.status === "pending") {
            return (
                <Button
                    label="View More"
                    className="p-button-link"
                    onClick={() => navigate(`/skillpost/${row._id}`)}
                />
            );
        } else {
            return (
                <p>Skill Post is linked To a user already</p>
            )
        }

    };
    const actionBodyTemplateDescription = (row) => {
        return (
            <div
                className="actions"
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                }}
            >
                <Button
                    icon="pi pi-book"
                    tooltip="Skills"
                    tooltipOptions={{ position: "bottom" }}
                    className="p-button-rounded p-button-text p-button-info mr-4 custom-crud-btn"
                    onClick={() => openDescriptionDialogue(row)}
                />
            </div>
        );
    }
    const actionBodyTemplateDates = (row) => {
        return (
            <div
                className="actions"
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                }}
            >
                <Button
                    icon="pi pi-calendar"
                    tooltip="Dates"
                    tooltipOptions={{ position: "bottom" }}
                    className="p-button-rounded p-button-text p-button-info mr-4 custom-crud-btn"
                    onClick={() => openDatesDialogue(row)}
                />
            </div>
        );
    }
    const TitleColumnValue = (row) => {
        if (row?.title && row?.title.length > 20) {
            return `${row?.title.substring(0, 20) + "..."}`;
        } else {
            return `${row?.title}`;
        }
    }
    const PriceColumnValue = (row) => {
        if (row?.price) {
            return `${row?.price}`;
        } else {
            return "Price Not Set Up Yet";
        }
    }
    const StatusColumnValue = (row) => {
        const statusTypeMapping = {
            pending: "orange",
            in_progress: "blue",
            completed: "green",
            cancelled: "red",
        };

        const badgeType = statusTypeMapping[row?.status] || "red";
        return <Badge type={badgeType}>{row?.status}</Badge>;
    };
    const offerTypeColumnValue = (row) => {
        if (row?.offerType === "exchange") {
            return "Exchange";
        } else if (row?.offerType === "monetary") {
            return "Monetary";
        } else {
            return "Not Set Up Yet";
        }
    }
    const ExchangeSkillColumnValue = (row) => {
        if (row?.exchangeSkill) {
            return `${row?.exchangeSkill?.name}`;
        } else {
            return "Exchange Skill Not Set Up Yet";
        }
    }
    const LinkedUserColumnValue = (row) => {
        if (row?.linkedUserId) {
            return `${row?.linkedUserId?.email}`;
        } else {
            return "Linked User Not Set Up Yet";
        }
    }
    const SuggestionsColumnValue = (row) => {
        return `${row?.suggestions}`;
    }
    return (
        <>
            {item && datesDialogue && (
                <Dates
                    open={datesDialogue}
                    handleClose={handleCloseDates}
                    value={item}
                    title={`Dates of ${item.title}`} />
            )}
            {item && descriptionDialogue && (
                <Description
                    open={descriptionDialogue}
                    handleClose={() => setDescriptionDialog(false)}
                    value={item}
                    title={`Description of ${item.title}`}
                />
            )}
            {skillPosts && skillPosts.length > 0 && (
                <>

                    <DataTable value={skillPosts} paginator rows={rows} className='datatable-custom' filterDisplay="row" totalRecords={skillPosts.length} first={first} onPage={onPage} emptyMessage="No SkillPost found">

                        <Column
                            field="title"
                            header="Title"
                            headerClassName='custom-column-header' className='custom-table-cell'
                            body={TitleColumnValue}
                        />
                        <Column body={actionBodyTemplateDescription} header="Description" headerClassName='custom-column-header' className='custom-table-cell' />
                        <Column body={PriceColumnValue} header="Price" headerClassName='custom-column-header' className='custom-table-cell' />
                        <Column field="offerType" header="Offer Type" headerClassName='custom-column-header' className='custom-table-cell' body={offerTypeColumnValue} />
                        <Column field="exchangeSkill" header="Exchange Skill" headerClassName='custom-column-header' className='custom-table-cell' body={ExchangeSkillColumnValue} />
                        <Column field="suggestions" header="Propositions" headerClassName='custom-column-header' className='custom-table-cell' body={SuggestionsColumnValue} />
                        <Column field="status" header="Status" headerClassName='custom-column-header' className='custom-table-cell' body={StatusColumnValue} />
                        <Column field="linkedUserId" header="Linked User" headerClassName='custom-column-header' className='custom-table-cell' body={LinkedUserColumnValue} />
                        <Column body={actionBodyTemplateDates} header="Dates" headerClassName='custom-column-header' className='custom-table-cell' />
                        <Column body={viewMoreTemplate} style={{width:"100%"}} header="View and Edit" headerClassName='custom-column-header' className='custom-table-cell' />
                    </DataTable>
                </>
            )}
        </>
    )
}
export default SkillPostsTable;
