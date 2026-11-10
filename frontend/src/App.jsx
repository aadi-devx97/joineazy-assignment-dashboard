
import { useContext } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { AppContext } from "./context/AppContextDefinition";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import StudentsPage from "./pages/StudentsPage";
import AssignmentsPage from "./pages/AssignmentsPage";
import MyAssignmentsPage from "./pages/MyAssignmentsPage";

// Protect routes according to the user's role.
function ProtectedRoute({ allowedRole, children }) {
  const { currentUser } = useContext(AppContext);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== allowedRole) {
    return (
      <Navigate
        to={currentUser.role === "professor" ? "/professor" : "/student"}
        replace
      />
    );
  }

  return children;
}

function App() {
  const { currentUser } = useContext(AppContext);

  const dashboardPath = currentUser
    ? currentUser.role === "professor"
      ? "/professor"
      : "/student"
    : "/login";

  return (
    <BrowserRouter>
      <Routes>
        {/* Default route */}
        <Route
          path="/"
          element={<Navigate to={dashboardPath} replace />}
        />

        {/* Login */}
        <Route
          path="/login"
          element={
            currentUser ? (
              <Navigate to={dashboardPath} replace />
            ) : (
              <LoginPage />
            )
          }
        />

        {/* Registration */}
        <Route
          path="/register"
          element={
            currentUser ? (
              <Navigate to={dashboardPath} replace />
            ) : (
              <RegisterPage />
            )
          }
        />

        {/* Professor routes */}
        <Route
          path="/professor"
          element={
            <ProtectedRoute allowedRole="professor">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/professor/assignments"
          element={
            <ProtectedRoute allowedRole="professor">
              <AssignmentsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/professor/students"
          element={
            <ProtectedRoute allowedRole="professor">
              <StudentsPage />
            </ProtectedRoute>
          }
        />

        {/* Student routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/assignments"
          element={
            <ProtectedRoute allowedRole="student">
              <MyAssignmentsPage />
            </ProtectedRoute>
          }
        />

        {/* Unknown routes */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
