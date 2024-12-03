import React, { useState, useEffect } from "react";
import { Col, Tab, Tabs } from "react-bootstrap";
import { GetQuizzes } from "../../actions/quiz.action";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import UpdateQuizMenu from "./popups/UpdateQuizMenu";
import AddQuiz from "./AddQuiz";
import DelQuiz from "./popups/DelQuiz";
import "../../assets/styles/Profile.css";
import "../../assets/styles/Datatable.css";

function Quizes() {
    const [QuizesData, setQuizesData] = useState([]);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [updDialogue, setUpdtDialog] = useState(false);
    const [suppDialogue, setSuppDialog] = useState(false);
    const [item, setItem] = useState({});
    const [dateFilter, setDateFilter] = useState(null);
    const isMobile = useMediaQuery({ maxWidth: 992 });
    const [key, setKey] = useState("1");
    const navigate = useNavigate();  // Initialize navigate

    const fetchQuizes = async () => {
        try {
            const response = await GetQuizzes();
            if (response) {
                console.log(response)
                setQuizesData(response);
            } else {
                console.error("quizes data is missing or invalid");
            }
        } catch (error) {
            console.error("Error fetching quizes:", error);
        }
    };

    useEffect(() => {
        fetchQuizes();
    }, []);

    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        });
        setGlobalFilterValue('');
        setDateFilter(null);
    };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };
    const openUpdtDialogue = (row) => {
        setUpdtDialog(true);
        setItem({ ...row });
    };
    const openSuppDialogue = (row) => {
        setSuppDialog(true);
        setItem({ ...row });
    };
    const handleCloseUpdt = () => {
        setItem({});
        setUpdtDialog(false);
    };
    const handleCloseDel = () => {
        setItem({});
        setSuppDialog(false);
    };
    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <Button type="button" className="p-button-submit" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
                <InputText value={globalFilterValue} className="w40" onChange={onGlobalFilterChange} placeholder="Search" />
            </div>
        );
    };

    const onPage = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    const clearFilter = () => {
        initFilters();
    };

    const NameValueRender = (row) => {
        return `${row?.title}`;
    };

    const SkillValueRender = (row) => {
        return `${row?.skill?.name}`;
    };

    const QuestionsValueRender = (row) => {
        return (
            <Button
                label="Edit Questions"
                onClick={() => navigate(`/quiz/questions/${row._id}`, { state: { questions: row.questions } })}
                className="p-button-link"
            />
        );
    };
    const actionBodyTemplate = (row) => {
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
                    icon="pi pi-pencil"
                    tooltip="Update Question"
                    tooltipOptions={{ position: "bottom" }}
                    className="p-button-rounded p-button-text p-button-info mr-4 custom-crud-btn"
                    onClick={() => openUpdtDialogue(row)}

                />

                <Button
                    icon="pi pi-trash"
                    tooltip="Delete Question"
                    tooltipOptions={{ position: "bottom" }}
                    className="p-button-rounded p-button-text p-button-danger mr-0 custom-crud-btn"
                    onClick={() => openSuppDialogue(row)}

                />
            </div>
        );
    };
    const header = renderHeader();

    return (
        <div className='layout-main'>
            <div className='layout-content'>
                <Tabs activeKey={key} onSelect={(k) => setKey(k)} className={`d-flex flex-wrap justify-content-center ${isMobile ? "flex-column mt-5" : ""}`} style={{ maxWidth: "100%" }}>
                    <Tab eventKey="1" title={"Quizes Table"} >
                        <div className='header-fileInput'>
                            <h1 style={{ fontWeight: "600" }}>Manage Quizes</h1>
                        </div>
                        {item && updDialogue && (
                            <UpdateQuizMenu
                                open={updDialogue}
                                handleClose={handleCloseUpdt}
                                value={item}
                                header={`Updating Quiz ${item?.title}`}
                            />
                        )}
                        {item && suppDialogue && (
                            <DelQuiz
                                open={suppDialogue}
                                handleClose={handleCloseDel}
                                value={item}
                                title={`Delete the Quiz ${item?.title}`}
                            />
                        )}
                        <div className="table-container">
                            {QuizesData && QuizesData.length > 0 && (
                                <div className="table-container">
                                    <DataTable
                                        value={QuizesData}
                                        paginator
                                        rows={rows}
                                        className='datatable-custom'
                                        filterDisplay="row"
                                        totalRecords={QuizesData.length}
                                        first={first}
                                        onPage={onPage}
                                        filters={filters}
                                        globalFilterFields={['title', 'skill.name']}
                                        header={header}
                                        emptyMessage="No Quiz was found">
                                        <Column field="title" filterField="title" header="Title" body={NameValueRender} />
                                        <Column field="skill" filterField="skill" header="Skill" body={SkillValueRender} />
                                        <Column field="Questions" header="Questions" body={QuestionsValueRender} />
                                        <Column body={actionBodyTemplate} headerClassName='custom-column-header' className='custom-table-cell' />

                                    </DataTable>
                                </div>
                            )}
                        </div>
                    </Tab>
                    <Tab eventKey="2" title={"New Quiz"} >
                        <AddQuiz />
                    </Tab>
                </Tabs>
            </div>
        </div>
    );
}

export default Quizes;
