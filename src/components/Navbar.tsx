import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {

    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <header className="app-navbar">

            <div className="app-navbar-brand">
                My Company
            </div>

            <div className="app-navbar-links">

                <button
                    className="app-navbar-link"
                    onClick={() => navigate("/dashboard")}
                >
                    Dashboard
                </button>

                <button
                    className="app-navbar-link"
                >
                    Users
                </button>

                <button
                    className="app-navbar-logout"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>

        </header>
    );
}