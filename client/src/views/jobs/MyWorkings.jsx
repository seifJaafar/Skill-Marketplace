import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GetJobsByProvider } from "../../actions/job.action";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { FilterMatchMode, FilterOperator } from 'primereact/api';

import { markJobAsDone } from "../../actions/payement.action";
import { toast } from "react-hot-toast";
import Badge from "../../partials/Badge";
import "../../assets/Datatable.css";

function MyWorkings({ onPay }) {
    const [jobs, setJobs] = useState([]);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const navigate = useNavigate();
    const handleMarkJobAsDone = async (jobId) => {
        try {
            const response = await markJobAsDone({ jobId });
            if (response.error) {
                toast.error(response.error);
            } else if (response.message === 'Job marked as done and payment processed') {
                toast.success("Job marked as done and payment processed");
                window.location.reload();
            }
        } catch (error) {
            console.error("Error marking job as done:", error);
        }
    }

    const fetchProviderJobs = async () => {
        try {
            const response = await GetJobsByProvider();
            console.log(response)
            setJobs(response);
        } catch (error) {
            console.error("Error fetching Client Jobs:", error);
        }
    };





    useEffect(() => {
        fetchProviderJobs();
    }, []);

    const onPage = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };
    const viewMoreTemplate = (row) => {
        return (
            <Button
                label={"skillPost"}
                className="p-button-link"
                onClick={() => navigate(`/skillpost/${row.skillPostId?._id}`)}
            />
        );
    };

    const ProviderUsername = (row) => {
        return <p>{row.providerId?.username}</p>;
    };

    const offerTypeTemplate = (row) => {
        return row.skillPostId?.offerType;
    };

    const isPaidTemplate = (row) => {
        return (
            <Badge type={row.isPaid ? "green" : "red"}>{row.isPaid ? "Paid" : "Not Paid"}</Badge>
        );
    };

    const statusTemplate = (row) => {
        const statusTypeMapping = {
            pending: "orange",
            released: "green",
            refunded: "red",
        };

        const badgeType = statusTypeMapping[row?.status] || "red";
        return <Badge type={badgeType}>{row?.status}</Badge>;
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
            </div>
        );
    };
    const header = renderHeader();
    const createdAtTemplate = (row) => {
        return <p>{new Date(row.createdAt).toDateString()}</p>;
    };

    const providerMarkedComplete = (row) => {
        return <Badge type={row.providerCompleted ? "green" : "red"}>{row.providerCompleted ? "Completed" : "Not Completed"}</Badge>;
    };

    const clientMarkedComplete = (row) => {
        return <Badge type={row.clientCompleted ? "green" : "red"}>{row.clientCompleted ? "Received" : "Not Finished"}</Badge>;
    };

    const priceTemplate = (row) => {
        return <p>{row.skillPostId?.price}</p>;
    };

    const markJobDoneTemplate = (row) => {
        if (!row.providerCompleted) {
            return (
                <Button
                    label="Mark as Done"
                    onClick={() => handleMarkJobAsDone(row._id)}
                    className="p-button p-button-success"
                />
            )
        } else {
            return <p>Project Done</p>
        }

    }
    return (
        <>
            {jobs && jobs.length > 0 && (
                <div className="table-container">
                    <DataTable value={jobs} 
                        globalFilter={filters.global.value}
                        globalFilterFields={['providerId.username']}
                        header={header}
                        paginator sortField="createdAt" sortOrder={-1} rows={rows} className='datatable-custom' filterDisplay="row" totalRecords={jobs.length} first={first} onPage={onPage} emptyMessage="No SkillPost found">
                        <Column field="skillpost._id" header='Post' body={viewMoreTemplate}></Column>
                        <Column field="providerId.username" header='Provider' body={ProviderUsername}></Column>
                        <Column field="skillPostId.offerType" header='Offer Type' body={offerTypeTemplate}></Column>
                        <Column field="isPaid" header='Paid' body={isPaidTemplate}></Column>
                        <Column field="price" header='Price' body={priceTemplate}></Column>
                        <Column field="status" header='Status' body={statusTemplate}></Column>
                        <Column field="createdAt" sortable header='Agreement Date' body={createdAtTemplate}></Column>
                        <Column field="providerCompleted" header='Provider Completed' body={providerMarkedComplete}></Column>
                        <Column field="clientCompleted" header='Project received' body={clientMarkedComplete}></Column>
                        <Column header='Mark as Done' body={markJobDoneTemplate}></Column>
                    </DataTable>
                </div>
            )}


        </>
    );
}

export default MyWorkings;
