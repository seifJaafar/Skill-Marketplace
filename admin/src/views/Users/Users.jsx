import React, { useState, useEffect } from "react";
import { Col, Tab, Tabs } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { GetAllUsers } from "../../actions/user.action"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Calendar } from 'primereact/calendar';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { InputText } from 'primereact/inputtext';
import Badge from "../../partials/Badge";
import UpdateUserMenu from "./popups/UpdateUserMenu";
import AddUser from "./AddUser";
import DelUser from "./popups/DelUser";
import Skills from "./popups/Skills";
import { useMediaQuery } from "react-responsive";
import "../../assets/styles/Profile.css"
import "../../assets/styles/Datatable.css"
function Users() {
    const [users, setUsers] = useState([]);

    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        approved: { value: null, matchMode: FilterMatchMode.EQUALS },
        quizCompleted: { value: null, matchMode: FilterMatchMode.EQUALS },
        createdAt: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [updDialogue, setUpdtDialog] = useState(false);
    const [suppDialogue, setSuppDialog] = useState(false);
    const [skillsDialogue, setSkillsDialogue] = useState(false);
    const [item, setItem] = useState({});
    const [dateFilter, setDateFilter] = useState(null);
    const isMobile = useMediaQuery({ maxWidth: 992 });
    const [key, setKey] = useState("1");


    const getData = async () => {
        try {

            const { usersBack } = await GetAllUsers();
            if (usersBack.error) {
                toast.error(usersBack.error);
            } else {
                setUsers(usersBack)
            }
        } catch (err) {
            console.error(err);
        }
    }
    useEffect(() => {
        getData();
    }, []);
    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            approved: { value: null, matchMode: FilterMatchMode.EQUALS },
            quizCompleted: { value: null, matchMode: FilterMatchMode.EQUALS },
            createdAt: { value: null, matchMode: FilterMatchMode.CONTAINS }

        });
        setGlobalFilterValue('');
        setDateFilter(null);
    };
    const approvedRowFilterTemplate = (options) => {
        return (
            <>
                <TriStateCheckbox
                    value={options.value}
                    onChange={(e) => options.filterApplyCallback(e.value)}
                />
                <span> filter Data</span>
            </>

        );
    };
    const quizRowFilterTemplate = (options) => {
        return (
            <>
                <TriStateCheckbox
                    value={options.value}
                    onChange={(e) => options.filterApplyCallback(e.value)}
                />
                <span> filter Data</span>
            </>

        );
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
    const EmailColumnValue = (row) => {
        return `${row?.email}`;
    };
    const githubProfileColumnValue = (row) => {
        if (row.role === 'skillexpert') {
            return <a href={row?.githubProfile} target="_blank">{row?.githubProfile}</a>;
        } else {
            return <Badge type="orange">Not Expert</Badge>
        }
    }
    const linkedinProfileColumnValue = (row) => {
        if (row.role === 'skillexpert') {
            return <a href={row?.linkedinProfile} target="_blank">{row?.linkedinProfile}</a>;
        }
        else {
            return <Badge type="orange">Not Expert</Badge>
        }
    }
    const RoleColumnValue = (row) => {
        return `${row?.role}`;
    };
    const PointsColumnValue = (row) => {
        return `${row?.points}`;
    }
    const QuizCompletedValue = (row) => {
        if (row.role === 'skillprovider') {
            return <Badge type={row.quizCompleted ? "green" : "red"}>{row.quizCompleted ? "Completed" : "Incompleted"}</Badge>
        } else {
            return <Badge type="orange">Not Provider</Badge>
        }
    }
    const openUpdtDialogue = (row) => {
        setUpdtDialog(true);
        setItem({ ...row });
    };
    const openSkillsDialogue = (row) => {
        setSkillsDialogue(true);
        setItem({ ...row });
    }
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
    const actionBodyTemplateSkills = (row) => {
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
                    icon="pi pi-cog"
                    tooltip="Skills"
                    tooltipOptions={{ position: "bottom" }}
                    className="p-button-rounded p-button-text p-button-info mr-4 custom-crud-btn"
                    onClick={() => openSkillsDialogue(row)}
                />
            </div>
        );
    }
    const header = renderHeader();
    return (
        <div className='layout-main'>
            <div className='layout-content'>
                <Tabs activeKey={key} onSelect={(k) => setKey(k)} className={`d-flex flex-wrap justify-content-center ${isMobile ? "flex-column mt-5" : ""}`} style={{ maxWidth: "100%" }}>
                    <Tab eventKey="1" title={"Accounts Table"} >
                        <div className='header-fileInput'>
                            <h1 style={{ fontWeight: "600" }}>Manage Accounts</h1>

                        </div>
                        <div className="table-container">

                            {item && updDialogue && (
                                <UpdateUserMenu
                                    open={updDialogue}
                                    handleClose={handleCloseUpdt}
                                    value={item}
                                    title={`Updating user ${item?.username}`}
                                />
                            )}
                            {item && suppDialogue && (
                                <DelUser
                                    open={suppDialogue}
                                    handleClose={handleCloseDel}
                                    value={item}
                                    title={`Delete the user ${item.username}`}
                                />
                            )}
                            {item && skillsDialogue && (
                                <Skills
                                    open={skillsDialogue}
                                    handleClose={() => setSkillsDialogue(false)}
                                    value={item}
                                    title={`skills of ${item.username}`}
                                />
                            )}
                            {users && users.length > 0 && (
                                <>
                                    <div className="table-container">
                                        <DataTable value={users} paginator rows={rows} className='datatable-custom' filterDisplay="row" totalRecords={users.length} first={first} onPage={onPage} filters={filters} globalFilterFields={['email', 'username', 'phone', 'approved', 'createdAt', 'quizCompleted']} header={header} emptyMessage="Aucun utilisateur trouvé">

                                            <Column
                                                field="email"
                                                header="Email"
                                                headerClassName='custom-column-header' className='custom-table-cell'
                                                body={EmailColumnValue}
                                            />
                                            <Column field="phone" header="Phone" headerClassName='custom-column-header' className='custom-table-cell' body={(row) => { return (row.phone) }} />
                                            <Column field="username" header="Username" headerClassName='custom-column-header' className='custom-table-cell' body={(row) => { return row.username }} />
                                            <Column field="role" header="Role" body={RoleColumnValue} sortable headerClassName='custom-column-header' className='custom-table-cell' />
                                            <Column field="approved" dataType="boolean" filterField="approved" header="Approuvé" filter
                                                filterElement={approvedRowFilterTemplate} sortable headerClassName='custom-column-header' className='custom-table-cell' body={(row) => <Badge type={row.approved ? "green" : "red"}>{row.approved ? "Approved" : "Not Approved"}</Badge>} />
                                            <Column field="points" header="Points" body={PointsColumnValue} sortable headerClassName='custom-column-header' className='custom-table-cell' />
                                            <Column body={actionBodyTemplateSkills} header="Skills" headerClassName='custom-column-header' className='custom-table-cell' />
                                            <Column field='createdAt' filterField='createdAt' header="Created At" sortable headerClassName='custom-column-header' className='custom-table-cell' body={(row) => { return row?.createdAt }} />
                                            <Column field="quizCompleted" dataType="boolean" filterField="quizCompleted" header="quizCompleted" filter
                                                filterElement={quizRowFilterTemplate} sortable headerClassName='custom-column-header' className='custom-table-cell' body={QuizCompletedValue} />
                                            <Column field="githubProfile" header="Github Profile" headerClassName='custom-column-header' className='custom-table-cell' body={githubProfileColumnValue} />
                                            <Column field="linkedinProfile" header="Linkedin Profile" headerClassName='custom-column-header' className='custom-table-cell' body={linkedinProfileColumnValue} />
                                            <Column body={actionBodyTemplate} headerClassName='custom-column-header' className='custom-table-cell' />
                                        </DataTable>
                                    </div>
                                </>
                            )}
                        </div>
                    </Tab>
                    <Tab eventKey="2" title={"New Account"} >
                        <AddUser />
                    </Tab>
                </Tabs>
            </div>
        </div>
    )
}
export default Users;