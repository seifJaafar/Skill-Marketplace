import React from "react";

function Spinner() {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                minWidth: "100vw",
            }}
        >
            <div
                style={{
                    transform: "scale(8)",
                }}
            >
                <div className="spinner-border text-warning" role="status">
                    <span className="sr-only"></span>
                </div>
            </div>
        </div>
    );
}

export default Spinner;