import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import Spinner from "../components/Spinner";
import { GetUserByToken } from "../actions/user.action";
/*import "core-js/stable/atob"; */
import { jwtDecode } from "jwt-decode";
import Register from "../views/register/Register";
import QuizComponent from "../views/quiz/QuizComponent";
import Login from "../views/login/Login"
import SkillProviderDashboard from "../views/Dashboards/SkillProviderDashboard";
import SkillPost from "../views/SkillPosts/SkillPost";
import SkillPostInformation from "../views/SkillPosts/SkillPostInformation";
import ResetPassword from "../views/ResetPassword/ResetPassword";
import Jobs from "../views/jobs/Jobs";

function MainRoutesComponent() {
  const [user, setUser] = useState({});
  const [is_connected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(true);
  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser({});
    setIsConnected(false);
    setLoading(true);
    fetchData();
  };

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
        {is_connected && user && user.role === "skillprovider" && <SkillProviderRoutes user={user} />}
        {/*is_connected && user && user.role == "employee" && <EmployeeRoutes user={user} /> */}
      </BrowserRouter>
    </div>
  );

}

const NotSignedRoutes = () => {
  return (
    <Routes>
      {/*
      <Route path="/resetPassword" element={<ResetPassword />} /> */}
      <Route path="/quiz/:skillID" element={<QuizComponent />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/resetPassword" element={<ResetPassword />} />
      <Route path="/*" element={<Navigate to="/login" />} />
    </Routes>
  );
};
const SkillProviderRoutes = (props) => {
  const { user } = props;

  return (
    <Routes>
      <Route element={<SkillProviderDashboard user={user._id} />} >
        <Route path="/skillposts" element={<SkillPost skills={user.skills} name={user.username} />} />
        <Route path="/skillpost/:id" element={<SkillPostInformation userId={user._id} />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/*" element={<Navigate to="/skillposts" />} />
      </Route>

    </Routes>
  );
};
/*const EmployeeRoutes = (props) => {
  const { user } = props;
  return (
    <Routes>
      <Route element={<EmployeeDashboard />} >
        <Route path="/UploadData" element={<AddData />} />
        <Route path="/references" element={<References role={user.role} Laboratoire={null} />} />
        <Route path="/reference/:refid" element={<ProduitsByRefrence />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/*" element={<Navigate to="/UploadData" />} />
      </Route>
    </Routes>
  ); 
}; */
export default MainRoutesComponent;;