import { useContext } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { AppContext } from "./context/AppContextDefinition";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import StudentsPage from "./pages/StudentsPage";
import AssignmentsPage from "./pages/AssignmentsPage";
import MyAssignmentsPage from "./pages/MyAssignmentsPage";

function ProtectedRoute({ allowedRole, children }) {
  const { currentUser } = useContext(AppContext);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== allowedRole) {
    return (
      <Navigate
        to={currentUser.role === "admin" ? "/admin" : "/student"}
        replace
      />
    );
  }

  return children;
}

function App() {
  const { currentUser } = useContext(AppContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Navigate
              to={
                currentUser
                  ? currentUser.role === "admin"
                    ? "/admin"
                    : "/student"
                  : "/login"
              }
              replace
            />
          }
        />

        <Route
          path="/login"
          element={
            currentUser ? (
              <Navigate
                to={currentUser.role === "admin" ? "/admin" : "/student"}
                replace
              />
            ) : (
              <LoginPage />
            )
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

        <Route
          path="/admin/assignments"
          element={
            <ProtectedRoute allowedRole="admin">
              <AssignmentsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/students"
          element={
            <ProtectedRoute allowedRole="admin">
              <StudentsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;