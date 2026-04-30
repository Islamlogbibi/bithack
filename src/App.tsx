import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";

import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Student pages
import StudentDashboard from "./pages/student/Dashboard";
import StudentSchedule from "./pages/student/Schedule";
import StudentGrades from "./pages/student/Grades";
import StudentAttendance from "./pages/student/Attendance";
import StudentResources from "./pages/student/Resources";
import AIAssistant from "./pages/student/AIAssistant";
import AbsenceJustification from "./pages/student/AbsenceJustification";
import StudentQRScan from "./pages/student/QRScan";
import StudentProfile from "./pages/student/Profile";

// Teacher pages
import TeacherDashboard from "./pages/teacher/Dashboard";
import QRAttendance from "./pages/teacher/QRAttendance";
import TeacherGrades from "./pages/teacher/Grades";
import TeacherWorkload from "./pages/teacher/Workload";
import TeacherResources from "./pages/teacher/Resources";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminValidations from "./pages/admin/Validations";
import AdminSchedule from "./pages/admin/Schedule";
import AdminAlerts from "./pages/admin/Alerts";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            {/* Student routes */}
            <Route
              path="/student"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="schedule" element={<StudentSchedule />} />
              <Route path="grades" element={<StudentGrades />} />
              <Route path="attendance" element={<StudentAttendance />} />
              <Route path="absence-justification" element={<AbsenceJustification />} />
              <Route path="qr-scan" element={<StudentQRScan />} />
              <Route path="profile" element={<StudentProfile />} />
              <Route path="resources" element={<StudentResources />} />
              <Route path="ai-assistant" element={<AIAssistant />} />
            </Route>

            {/* Teacher routes */}
            <Route
              path="/teacher"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<TeacherDashboard />} />
              <Route path="qr-attendance" element={<QRAttendance />} />
              <Route path="grades" element={<TeacherGrades />} />
              <Route path="workload" element={<TeacherWorkload />} />
              <Route path="resources" element={<TeacherResources />} />
            </Route>

            {/* Admin routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="validations" element={<AdminValidations />} />
              <Route path="schedule" element={<AdminSchedule />} />
              <Route path="alerts" element={<AdminAlerts />} />
            </Route>

            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
