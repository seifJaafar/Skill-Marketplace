import { useState, useContext } from "react";
import { Link } from 'react-router-dom';
import { SidebarContext } from './SidebarContext';
import NavList from "./NavMenu";
import "../assets/Sidebar.css";
import { Knob } from 'primereact/knob';
function SideBar({ user }) {
    const [selected, setSelected] = useState('Dashboard');
    const { collapsed } = useContext(SidebarContext);
    const logout = () => {
        localStorage.removeItem('accessToken');
        window.location.reload();
    };
    return (
        <>
            <div className="d-flex flex-column justify-content-between">
                <aside id="sidebar" className={`sidebar ${collapsed ? ' collapsed' : ''}`}>
                    <div>
                        <h1 className="sidebar-header text-center">Skill Marketplace</h1>
                        <ul className="sidebar-nav" id="sidebar-nav">
                            {NavList.map((item) => {
                                return (
                                    
                                    <li key={item._id} className={selected === item.name ? 'selected' : ''}>
                                        <Link className="nav-link" to={item.link} onClick={() => setSelected(item.name)}>
                                            <i className={item.icon}></i>
                                            <span>{item.name}</span>
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                    <div>
                        {user.role === "skillprovider" && (
                            <ul className="sidebar-nav w-4" id="sidebar-nav">
                                <li className={selected === "Settings" ? 'selected' : ''} >
                                    <Knob value={user.points} readOnly max={1000} />
                                </li>
                            </ul>
                        )}

                        <ul className="sidebar-nav" id="sidebar-nav">
                            <li className={selected === "Settings" ? 'selected' : ''}>
                                <Link className="nav-link" to={`/profile/${user._id}`}>
                                    <i className="fa-solid fa-user"></i>
                                    <span>Profile</span>
                                </Link>
                            </li>
                            <li className={selected === "Settings" ? 'selected' : ''}>
                                <Link className="nav-link" to="/profile">
                                    <i className="fa-solid fa-cog"></i>
                                    <span>Account Settings</span>
                                </Link>
                            </li>
                            <li className={selected === "logout" ? 'selected' : ''}>
                                <Link className="nav-link" to="/" onClick={() => { logout() }}>
                                    <i className="fa-solid fa-sign-out"></i>
                                    <span>Logout</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </aside>
            </div>
        </>
    )
}
export default SideBar;