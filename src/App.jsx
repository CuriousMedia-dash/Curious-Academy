import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Home from "./pages/Home";
import StartHere from "./pages/StartHere";
import LearningHub from "./pages/LearningHub";
import Playbooks from "./pages/Playbooks";
import Policies from "./pages/Policies";
import MeetTeam from "./pages/MeetTeam";

// Pages every signed-in employee can see
const employeePages = [
  { path: "/", element: <Home /> },
  { path: "/start-here", element: <StartHere /> },
  { path: "/learning-hub", element: <LearningHub /> },
  { path: "/playbooks", element: <Playbooks /> },
  { path: "/policies", element: <Policies /> },
  { path: "/team", element: <MeetTeam /> },
];

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          {employeePages.map(({ path, element }) => (
            <Route key={path} path={path} element={<ProtectedRoute>{element}</ProtectedRoute>} />
          ))}

          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <Admin />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
