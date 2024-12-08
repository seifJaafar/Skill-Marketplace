import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import Spinner from "../components/Spinner";
import { GetUserByToken } from "../actions/user.action";
import { useNavigate } from "react-router-dom";
/*import "core-js/stable/atob"; */
import { jwtDecode } from "jwt-decode";
import Register from "../views/register/Register";
import QuizComponent from "../views/quiz/QuizComponent";
import Login from "../views/login/Login"
import SkillProviderDashboard from "../views/Dashboards/SkillProviderDashboard";
import ClientDashboard from "../views/Dashboards/ClientDashboard";
import SkillExpertDashboard from "../views/Dashboards/SkillExpertDashboard";
import SkillPost from "../views/SkillPosts/SkillPost";
import SkillPostInformation from "../views/SkillPosts/SkillPostInformation";
import ResetPassword from "../views/ResetPassword/ResetPassword";
import Jobs from "../views/jobs/Jobs";
import Profile from "../views/profile/Profile";
import LeaderBoard from "../views/LeaderBoard/LeaderBoard";
import PublicProfile from "../views/PublicProfile/PublicProfile";
import Shop from "../views/courses/Shop";
import CourseDeatailsWrapper from "../views/courses/CourseDeatailsWrapper";
import Enrollements from "../views/Enrollements/Enrollements";
import AddChapter from "../views/courses/AddChapter";
import LearningComponent from "../views/Enrollements/LearningComponent";
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
        {is_connected && user && user.role === "client" && <ClientRoutes user={user} />}
        {is_connected && user && user.role === "skillexpert" && <SkillExpertRoutes user={user} />}
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
const ClientRoutes = (props) => {
  const { user } = props;
  return (
    <Routes>
      <Route element={<ClientDashboard user={user} />} >
        <Route path="/skillposts" element={<SkillPost skills={user.skills} name={user.username} userRole={user.role} />} />
        <Route path="/skillpost/:id" element={<SkillPostInformation userId={user._id} />} />
        <Route path="/profile/:id" element={<PublicProfile userId={user._id} />} />
        <Route path="/profile" element={<Profile user={user} />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/leaderboard" element={<LeaderBoard user={user} />} />
        <Route path="/*" element={<Navigate to="/shop" />} />
      </Route>
    </Routes>
  );
}

const SkillExpertRoutes = (props) => {
  const { user } = props;
  return (
    <Routes>
      <Route element={<SkillExpertDashboard user={user} />} >
        <Route path="/skillposts" element={<SkillPost skills={user.skills} name={user.username} userRole={user.role} />} />
        <Route path="/skillpost/:id" element={<SkillPostInformation userId={user._id} />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/profile/:id" element={<PublicProfile userId={user._id} />} />
        <Route path="/profile" element={<Profile user={user} />} />
        <Route path="/quiz/:skillID" element={<QuizComponent />} />
        <Route path="/leaderboard" element={<LeaderBoard user={user} />} />
        <Route path="/shop" element={<Shop user={user} />} />
        <Route path="/course/:id" element={<CourseDeatailsWrapper user={user} />} />
        <Route path="/addChapter/:id" element={<AddChapter userId={user._id} />} />
        <Route path="/*" element={<Navigate to="/skillposts" />} />
      </Route>
    </Routes>

  )
}
const SkillProviderRoutes = (props) => {
  const { user } = props;
  const navigate = useNavigate();
  useEffect(() => {
    // Check if user has pending skills in localStorage and if quizCompleted is false
    const pendingSkills = JSON.parse(localStorage.getItem("pendingSkills"));
    if (pendingSkills && pendingSkills.length > 0 && !user.quizCompleted) {
      navigate(`/quiz/${pendingSkills[0]}`, { state: { skills: pendingSkills, userID: user._id } });
    }
  }, [user]);

  return (
    <Routes>
      <Route element={<SkillProviderDashboard user={user} />} >
        <Route path="/skillposts" element={<SkillPost skills={user.skills} name={user.username} userRole={user.role} />} />
        <Route path="/skillpost/:id" element={<SkillPostInformation userId={user._id} />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/profile/:id" element={<PublicProfile userId={user._id} />} />
        <Route path="/profile" element={<Profile user={user} />} />
        <Route path="/quiz/:skillID" element={<QuizComponent />} />
        <Route path="/leaderboard" element={<LeaderBoard user={user} />} />
        <Route path="/shop" element={<Shop user={user} />} />
        <Route path="/course/:id" element={<CourseDeatailsWrapper userId={user} />} />
        <Route path='/mycourses' element={<Enrollements user={user} />} />
        <Route path='/learn/:id' element={<LearningComponent />} />
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