import SideBar from "../partials/Sidebar";
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from "../partials/SidebarContext";
import "../assets/styles/layout.css"

function Dashboard() {
    return (
        <>
            <SidebarProvider>
                <SideBar />
                <Outlet />
            </SidebarProvider>
        </>
    )
}
export default Dashboard;