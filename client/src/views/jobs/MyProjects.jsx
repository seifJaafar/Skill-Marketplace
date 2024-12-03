import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GetJobsByClient } from "../../actions/job.action";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { createPaymentIntent, markJobAsPaid } from "../../actions/payement.action";
import { toast } from "react-hot-toast";
import Badge from "../../partials/Badge";
import "../../assets/Datatable.css";

function MyProjects({ onPay }) {
    const [jobs, setJobs] = useState([]);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const fetchClientJobs = async () => {
        try {
            const response = await GetJobsByClient();
            setJobs(response);
        } catch (error) {
            console.error("Error fetching Client Jobs:", error);
        }
    };





    useEffect(() => {
        fetchClientJobs();
    }, []);

    const onPage = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };
    const viewMoreTemplate = (row) => {
        return (
            <Button
                label={row.skillPostId?.title || "View More"}
                className="p-button-link"
                style={{ maxWidth: "200px", overflowWrap: "break-word", wordBreak: "break-word", whiteSpace: "normal" }}
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
    const createdAtTemplate = (row) => {
        return <p>{new Date(row.createdAt).toDateString()}</p>;
    };

    const providerMarkedComplete = (row) => {
        return <Badge type={row.providerMarkedComplete ? "green" : "red"}>{row.providerMarkedComplete ? "Completed" : "Not Completed"}</Badge>;
    };

    const clientMarkedComplete = (row) => {
        return <Badge type={row.clientMarkedComplete ? "green" : "red"}>{row.clientMarkedComplete ? "Received" : "Not Finished"}</Badge>;
    };

    const priceTemplate = (row) => {
        return <p>{row.skillPostId?.price}</p>;
    };

    const payButtonTemplate = (row) => {
        if (row.skillPostId?.offerType === 'monetary' && !row.isPaid) {
            return (
                <Button
                    label="Pay"
                    onClick={() => onPay(row._id)}
                    className="p-button p-button-success"
                    loading={loading}
                />
            );
        }
        return null;
    };

    return (
        <>
            {jobs && jobs.length > 0 && (
                <div className="table-container">
                    <DataTable value={jobs} paginator rows={rows} className='datatable-custom' filterDisplay="row" totalRecords={jobs.length} first={first} onPage={onPage} emptyMessage="No SkillPost found">
                        <Column field="skillpost._id" header='Post' body={viewMoreTemplate}></Column>
                        <Column field="providerId.username" header='Provider' body={ProviderUsername}></Column>
                        <Column field="skillPostId.offerType" header='Offer Type' body={offerTypeTemplate}></Column>
                        <Column field="isPaid" header='Paid' body={isPaidTemplate}></Column>
                        <Column field="price" header='Price' body={priceTemplate}></Column>
                        <Column field="status" header='Status' body={statusTemplate}></Column>
                        <Column field="createdAt" header='Agreement Date' body={createdAtTemplate}></Column>
                        <Column field="providerCompleted" header='Provider Completed' body={providerMarkedComplete}></Column>
                        <Column field="clientCompleted" header='Project received' body={clientMarkedComplete}></Column>
                        <Column header='Pay' body={payButtonTemplate}></Column>
                    </DataTable>
                </div>
            )}


        </>
    );
}

export default MyProjects;
