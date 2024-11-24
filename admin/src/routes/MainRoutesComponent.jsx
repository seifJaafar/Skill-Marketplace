import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import Spinner from "../components/Spinner";
import Login from "../views/login/Login";
import { GetUserByToken } from "../actions/user.action";
import { jwtDecode } from "jwt-decode";
import ResetPassword from "../views/ResetPassword/ResetPassword";
import Dashboard from "../views/Dashboard";
import Users from "../views/Users/Users";
import Skills from "../views/Skills/Skills";
import Quizes from "../views/Quizes/Quizes";
import Questions from "../views/Questions/Questions";
function MainRoutesComponent() {
    const [user, setUser] = useState({});
    const [is_connected, setIsConnected] = useState(false)
    const [loading, setLoading] = useState(true);
    const decodeToken = (token) => {
        try {
            const decoded = jwtDecode(token)
            return decoded;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    };
    const fetchData = async () => {
        try {
            const token = localStorage.getItem('accessToken');

            if (!token || token === 'null') {
                console.log("no token")
                setIsConnected(false);
            } else {
                const decodedToken = decodeToken(token);
                if (decodedToken.exp < Date.now() / 1000) {
                    console.log("token expired")
                    localStorage.removeItem('accessToken');
                    setIsConnected(false);
                    setUser({});
                }
                const { Backuser, is_connected } = await GetUserByToken();
                setUser(Backuser);
                setIsConnected(is_connected);

            }
        } catch (error) {
            console.error("Error fetching user:", error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {

        fetchData();

    }, []);
    if (loading) {
        return <Spinner />;
    }
    return (
        <div style={{ position: "relative" }}>
            <BrowserRouter>
                {!is_connected && <NotSignedRoutes />}
                {is_connected && user && user.role === "admin" && <AdminRoutes />}

            </BrowserRouter>
        </div>
    );

}

const NotSignedRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/resetPassword" element={<ResetPassword />} />
            <Route path="/*" element={<Navigate to="/login" />} />
        </Routes>
    );
};
const AdminRoutes = () => {
    return (
        <Routes>
            <Route element={<Dashboard />} >
                <Route path="/users" element={<Users />} />
                <Route path="/skills" element={<Skills />} />
                <Route path="/quizes" element={<Quizes />} />
                <Route path="/quiz/questions/:QuizID" element={<Questions />} />
                <Route path="/*" element={<Navigate to="/users" />} />
            </Route>
        </Routes>
    );
};

export default MainRoutesComponent;