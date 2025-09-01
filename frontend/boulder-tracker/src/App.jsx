import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import SessionsPage from "./pages/SessionsPage.jsx";
import ClimbsPage from "./pages/ClimbsPage.jsx";
import AccountPage from "./pages/AccountPage.jsx";
import SessionDetailsPage from "./pages/SessionDetailsPage.jsx";

function App() {
    const ProtectedRoute = ({ children }) => {
        const token = localStorage.getItem("token");
        // return token ? children : <Navigate to="/login" />;
        return children;
    };

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/sessions"
                    element={
                        <ProtectedRoute>
                            <SessionsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/climbs"
                    element={
                        <ProtectedRoute>
                            <ClimbsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/account"
                    element={
                        <ProtectedRoute>
                            <AccountPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/sessions/:id"
                    element={
                        <ProtectedRoute>
                            <SessionDetailsPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
