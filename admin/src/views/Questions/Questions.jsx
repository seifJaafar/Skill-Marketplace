import React, { useState, useEffect } from "react";
import { Col, Tab, Tabs } from "react-bootstrap";

import Answers from "./popups/Answers";
import UpdateQuestionMenu from "./popups/UpdateQuestionMenu";
import DelQuestion from "./popups/DelQuestion";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { FilterMatchMode } from 'primereact/api';
import { useLocation } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { useMediaQuery } from "react-responsive";
import "../../assets/styles/Profile.css"
import "../../assets/styles/Datatable.css"
import AddQuestion from "./AddQuestion";
function Questions() {
    const location = useLocation();
    const { questions } = location.state || {};
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [AnswersDialogue, setAnswersDialogue] = useState(false);
    const [updDialogue, setUpdtDialog] = useState(false);
    const [suppDialogue, setSuppDialog] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [item, setItem] = useState({});
    const [dateFilter, setDateFilter] = useState(null);
    const isMobile = useMediaQuery({ maxWidth: 992 });
    const [key, setKey] = useState("1");



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
    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <Button type="button" className="p-button-submit" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
                <InputText value={globalFilterValue} className="w40" onChange={onGlobalFilterChange} placeholder="Search" />
            </div>

        );
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
    const openAnswersDialogue = (row) => {
        setAnswersDialogue(true);
        setItem({ ...row });
    }
    const handleClose = () => {
        setItem({});
        setAnswersDialogue(false);
    };
    const onPage = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };
    const clearFilter = () => {
        initFilters();
    };


    const actionBodyTemplateAnswers = (row) => {
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
                    icon="pi pi-question"
                    tooltip="Answers"
                    tooltipOptions={{ position: "bottom" }}
                    className="p-button-rounded p-button-text p-button-info mr-4 custom-crud-btn"
                    onClick={() => openAnswersDialogue(row)}
                />
            </div>
        );
    }
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
    const TextValueRender = (row) => {
        return `${row?.questionText}`;
    }
    const correctAnswerIndexRender = (row) => {
        return `${row?.correctAnswerIndex}`
    }
    const header = renderHeader();
    return (
        <div className='layout-main'>
            <div className='layout-content'>
                <Tabs activeKey={key} onSelect={(k) => setKey(k)} className={`d-flex flex-wrap justify-content-center ${isMobile ? "flex-column mt-5" : ""}`} style={{ maxWidth: "100%" }}>
                    <Tab eventKey="1" title={"Questions Table"} >
                        <div className='header-fileInput'>
                            <h1 style={{ fontWeight: "600" }}>Manage Questions</h1>

                        </div>
                        <div className="table-container">
                            {item && updDialogue && (
                                <UpdateQuestionMenu
                                    open={updDialogue}
                                    handleClose={handleCloseUpdt}
                                    value={item}
                                    title={`Updating Question ${item?.questionText}`}
                                />
                            )}
                            {item && suppDialogue && (
                                <DelQuestion
                                    open={suppDialogue}
                                    handleClose={handleCloseDel}
                                    value={item}
                                    title={`Delete the Question ${item.questionText}`}
                                />
                            )}
                            {item && AnswersDialogue && (
                                <Answers
                                    open={AnswersDialogue}
                                    handleClose={() => setAnswersDialogue(false)}
                                    value={item}
                                    title={`Answers of : ${item?.questionText}`}
                                />
                            )}
                            {questions && questions.length > 0 ? (
                                <div className="table-container">
                                    <DataTable
                                        value={questions}
                                        paginator
                                        rows={rows}
                                        className='datatable-custom'
                                        filterDisplay="row"
                                        totalRecords={questions.length}
                                        first={first}
                                        onPage={onPage}
                                        filters={filters}
                                        globalFilterFields={['name']}
                                        header={header}
                                        emptyMessage="No Quiz was found">
                                        <Column field="Question" filterField="Question" header="QuestionText" body={TextValueRender} />
                                        <Column field="Options" Header="Answers" body={actionBodyTemplateAnswers} />
                                        <Column field="correctAnswerIndex" header="correct Answer Index" body={correctAnswerIndexRender} />
                                        <Column body={actionBodyTemplate} headerClassName='custom-column-header' className='custom-table-cell' />
                                    </DataTable>
                                </div>
                            ) : (
                                <div className="no-data">
                                    <h1>No Questions found</h1>
                                </div>
                            )}

                        </div>
                    </Tab>
                    {questions && questions.length < 5 && (
                        <Tab eventKey="2" title={"New Question"} >
                            <AddQuestion />
                        </Tab>
                    )}

                </Tabs>
            </div>
        </div>
    )
}
export default Questions;