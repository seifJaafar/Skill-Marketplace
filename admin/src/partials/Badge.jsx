import React from "react";
import "../assets/styles/Badge.css";
function Badge({ children, type = "green" }) {
    const types = {
        green: "qualified",
        orange: "proposal",
        blue: "new",
        purple: "renewal",
        red: "unqualified",
    };

    // Provide a fallback if `type` is not found in `types`
    const badgeStatus = types[type] || types.green;

    return <span className={`customer-badge status-${badgeStatus}`}>{children}</span>;
}

export default Badge;
