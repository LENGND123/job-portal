import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes, useLocation } from "react-router-dom";
import api from "./lib/api";
import { logout, setUser } from "./redux/authSlice";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import Browse from "./pages/Browse";
import JobDescription from "./pages/JobDescription";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Companies from "./pages/admin/Companies";
import CompanySetup from "./pages/admin/CompanySetup";
import AdminJobs from "./pages/admin/AdminJobs";
import PostJob from "./pages/admin/PostJob";
import Applicants from "./pages/admin/Applicants";

function SessionSync() {
  const dispatch = useDispatch();
  useEffect(() => {
    let cancelled = false;
    api
      .get("/api/v1/user/me")
      .then((res) => {
        if (!cancelled) dispatch(setUser(res.data.user));
      })
      .catch((error) => {
        if (!cancelled && error.response?.status === 401) dispatch(logout());
      });
    return () => {
      cancelled = true;
    };
  }, [dispatch]);
  return null;
}

export default function App() {
  const location = useLocation();
  const hideFooter = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="flex min-h-screen flex-col">
      <SessionSync />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/description/:id" element={<JobDescription />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<ProtectedRoute role="student"><Profile /></ProtectedRoute>} />
          <Route path="/admin/companies" element={<ProtectedRoute role="recruiter"><Companies /></ProtectedRoute>} />
          <Route path="/admin/companies/:id" element={<ProtectedRoute role="recruiter"><CompanySetup /></ProtectedRoute>} />
          <Route path="/admin/jobs" element={<ProtectedRoute role="recruiter"><AdminJobs /></ProtectedRoute>} />
          <Route path="/admin/jobs/create" element={<ProtectedRoute role="recruiter"><PostJob /></ProtectedRoute>} />
          <Route path="/admin/jobs/:id" element={<ProtectedRoute role="recruiter"><PostJob /></ProtectedRoute>} />
          <Route path="/admin/jobs/:id/applicants" element={<ProtectedRoute role="recruiter"><Applicants /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {hideFooter ? null : <Footer />}
    </div>
  );
}
