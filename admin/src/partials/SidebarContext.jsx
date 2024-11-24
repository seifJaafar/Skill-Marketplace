import React, { createContext, useState } from 'react';

export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);

    const toggleSidebar = () => {
        console.log('toggle');
        setCollapsed(!collapsed);
        console.log(collapsed);
    };

    return (
        <SidebarContext.Provider value={{ collapsed, toggleSidebar }}>
            {children}
        </SidebarContext.Provider>
    );
};