import { BrowserRouter, Route, Routes } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import ProtectedUserRoute from "./components/ProtectedUserRoute";
import Home from "./pages/Home";
import ReportIssue from "./pages/ReportIssue";
import AnalysisResult from "./pages/AnalysisResult";
import ComplaintSubmitted from "./pages/ComplaintSubmitted";
import TrackComplaint from "./pages/TrackComplaint";
import ComplaintDetails from "./pages/ComplaintDetails";
import About from "./pages/About";
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import Complaints from "./pages/admin/Complaints";
import AdminComplaintDetails from "./pages/admin/ComplaintDetails";
import Departments from "./pages/admin/Departments";
import Analytics from "./pages/admin/Analytics";
import Settings from "./pages/admin/Settings";
import NotFound from "./pages/NotFound";
import UserLogin from "./pages/user/UserLogin";
import UserRegister from "./pages/user/UserRegister";
import UserDashboard from "./pages/user/UserDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<UserLogin />} />
        <Route path="/login/citizen" element={<UserLogin />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/register/citizen" element={<UserRegister />} />
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />

          <Route element={<ProtectedUserRoute />}>
            <Route path="/report" element={<ReportIssue />} />
            <Route path="/analysis" element={<AnalysisResult />} />
            <Route
              path="/complaint-submitted"
              element={<ComplaintSubmitted />}
            />
            <Route path="/track" element={<TrackComplaint />} />
            <Route path="/complaint/:id" element={<ComplaintDetails />} />
            <Route path="/dashboard" element={<UserDashboard />} />
          </Route>
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route element={<ProtectedAdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/complaints" element={<Complaints />} />
            <Route
              path="/admin/complaints/:id"
              element={<AdminComplaintDetails />}
            />
            <Route path="/admin/departments" element={<Departments />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/admin/settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
