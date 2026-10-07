import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import { AuthProvider, useAuth } from "./context/AuthContext";

function ProtectedRoute() {

    const { token } = useAuth();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <Dashboard />;
}

function App() {
    return (
        <AuthProvider>

            <Routes>

                {/* Login */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* Protected Dashboard */}
                <Route
                    path="/dashboard"
                    element={<ProtectedRoute />}
                />

                {/* Default */}
                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

                {/* Unknown URL */}
                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

            </Routes>

        </AuthProvider>
    );
}

export default App;