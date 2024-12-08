import SideBar from "../../partials/Sidebar";
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from "../../partials/SidebarContext";
import MessengerComponent from "../Messenger/MessengerComponent";
import "../../assets/layout.css"

function SkillProviderDashboard({ user }) {
    return (
        <>
            <SidebarProvider>
                <SideBar user={user} />
                <Outlet />
                <MessengerComponent user={user} />
            </SidebarProvider>
        </>
    )
}
export default SkillProviderDashboard;