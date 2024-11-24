import SideBar from "../../partials/Sidebar";
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from "../../partials/SidebarContext";


function SkillProviderDashboard() {
    return (
        <>
            <SidebarProvider>
                <SideBar />
                <Outlet />
            </SidebarProvider>
        </>
    )
}
export default SkillProviderDashboard;