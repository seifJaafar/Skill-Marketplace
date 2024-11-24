import React, { useState, useEffect } from "react";
import { Col, Tab, Tabs } from "react-bootstrap";

import { GetSkills } from "../../actions/skills.action"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from 'primereact/api';

import { InputText } from 'primereact/inputtext';
import AddSkill from "./AddSkill";
import Description from "./popups/Description";
import DelSkill from "./popups/DellSkill";
import UpdateSkillMenu from "./popups/UpdateSkillMenu";
import { useMediaQuery } from "react-responsive";
import "../../assets/styles/Profile.css"
import "../../assets/styles/Datatable.css"
function Skills() {
    const [SkillsData, setSkillsData] = useState([]);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [descriptionDialogue, setDescriptionDialog] = useState(false);
    const [updDialogue, setUpdtDialog] = useState(false);
    const [suppDialogue, setSuppDialog] = useState(false);
    const [item, setItem] = useState({});
    const [dateFilter, setDateFilter] = useState(null);
    const isMobile = useMediaQuery({ maxWidth: 992 });
    const [key, setKey] = useState("1");


    const fetchSkills = async () => {
        try {
            const response = await GetSkills();
            if (response) {
                setSkillsData(response);
            } else {
                console.error("Skills data is missing or invalid");
            }
        } catch (error) {
            console.error("Error fetching skills:", error);

        }
    };
    useEffect(() => {
        fetchSkills();
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
    const openDescriptionDialogue = (row) => {
        setDescriptionDialog(true);
        setItem({ ...row });
    }
    const handleClose = () => {
        setItem({});
        setDescriptionDialog(false);
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
                    tooltip="Update user"
                    tooltipOptions={{ position: "bottom" }}
                    className="p-button-rounded p-button-text p-button-info mr-4 custom-crud-btn"
                    onClick={() => openUpdtDialogue(row)}
                />

                <Button
                    icon="pi pi-trash"
                    tooltip="Delete User"
                    tooltipOptions={{ position: "bottom" }}
                    className="p-button-rounded p-button-text p-button-danger mr-0 custom-crud-btn"
                    onClick={() => openSuppDialogue(row)}
                />
            </div>
        );
    };
    const NameValueRender = (row) => {
        return `${row?.name}`;
    }

    const header = renderHeader();
    return (
        <div className='layout-main'>
            <div className='layout-content'>
                <Tabs activeKey={key} onSelect={(k) => setKey(k)} className={`d-flex flex-wrap justify-content-center ${isMobile ? "flex-column mt-5" : ""}`} style={{ maxWidth: "100%" }}>
                    <Tab eventKey="1" title={"Skills Table"} >
                        <div className='header-fileInput'>
                            <h1 style={{ fontWeight: "600" }}>Manage Skills</h1>

                        </div>
                        <div className="table-container">
                            {item && updDialogue && (
                                <UpdateSkillMenu
                                    open={updDialogue}
                                    handleClose={handleCloseUpdt}
                                    value={item}
                                    title={`Updating Skill ${item?.name}`}
                                />
                            )}
                            {item && suppDialogue && (
                                <DelSkill
                                    open={suppDialogue}
                                    handleClose={handleCloseDel}
                                    value={item}
                                    title={`Delete the Skill ${item.name}`}
                                />
                            )}
                            {item && descriptionDialogue && (
                                <Description
                                    open={descriptionDialogue}
                                    handleClose={() => setDescriptionDialog(false)}
                                    value={item}
                                    title={`Description of ${item.name}`}
                                />
                            )}
                            {SkillsData && SkillsData.length > 0 && (
                                <>
                                    <div className="table-container">
                                        <DataTable value={SkillsData} paginator rows={rows} className='datatable-custom' filterDisplay="row" totalRecords={SkillsData.length} first={first} onPage={onPage} filters={filters} globalFilterFields={['name']} header={header} emptyMessage="No Skill was found">
                                            <Column field="name" filterField="name" header="Name" body={NameValueRender} />
                                            <Column body={actionBodyTemplateDescription} header="Description" headerClassName='custom-column-header' className='custom-table-cell' />
                                            <Column body={actionBodyTemplate} headerClassName='custom-column-header' className='custom-table-cell' />
                                        </DataTable>
                                    </div>
                                </>
                            )}
                        </div>
                    </Tab>
                    <Tab eventKey="2" title={"New Skill"} >
                        <AddSkill />
                    </Tab>
                </Tabs>
            </div>
        </div>
    )
}
export default Skills;