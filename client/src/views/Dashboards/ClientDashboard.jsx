import SIdebarClient from "../../partials/SIdebarClient";
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from "../../partials/SidebarContext";
import MessengerComponent from "../Messenger/MessengerComponent";
import "../../assets/layout.css"

function ClientDashboard({ user }) {
    return (
        <>
            <SidebarProvider>
                <SIdebarClient user={user} />
                <Outlet />
                <MessengerComponent user={user} />
            </SidebarProvider>
        </>
    )
}
export default ClientDashboard;