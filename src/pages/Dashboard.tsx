import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import UserCard from "../components/UserCard";
import AddUserModel from "../components/AddUserModel";
import "../App.css";

const API_URL = import.meta.env.VITE_API_URL;

interface User {
    userid: string;
    userName: string;
    email: string;
    role: string;
}

function Dashboard() {
    const [user1, setUser1] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showAddUser, setShowAddUser] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);

    // =========================
    // GET USERS
    // =========================
    const fetchData = async (allUsers= false) => {
    try {
        setLoading(true);
         const url = allUsers
            ? `${API_URL}/api/User/GetUsers?pageNumber=1&pageSize=1000`
            : `${API_URL}/api/User/GetUsers?pageNumber=${pageNumber}&pageSize=${pageSize}`;
        const response = await fetch(`${url}&_=${Date.now()}`, {
    cache: "no-store"
});

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        console.log("FULL API RESPONSE:", data);

        setUser1(data.users);
        setTotalUsers(data.totalCount);
        setTotalPages(data.toalPages);

    } catch (error) {
        console.error("API ERROR:", error);
    } finally {
        setLoading(false);
    }
};

    // =========================
    // LOAD USERS ON PAGE LOAD
    // =========================
   useEffect(() => {
    if (search.trim() !== "") {
        fetchData(true);
    } else {
        fetchData(false);
    }
}, [pageNumber, search]);

    // =========================
    // SEARCH
    // =========================
    const filteredUsers = user1.filter((user) =>
        user.userName
            .toLowerCase()
            .includes(search.toLowerCase()) ||

        user.email
            .toLowerCase()
            .includes(search.toLowerCase()) ||

        user.role
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    // =========================
    // DELETE USER
    // =========================
   const deleteUser = async (userid: string) => {

    const confirmDelete = window.confirm(
        "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) {
        return;
    }

    try {

        const token = localStorage.getItem("token");

        console.log("JWT token:", token);
        console.log("Deleting userid:", userid);

        if (!token) {
            alert("You are not logged in.");
            return;
        }

        const response = await fetch(
            `${API_URL}/api/User/${userid}`,
            {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("Delete status:", response.status);

        const responseText = await response.text();

        console.log(
            "Delete API response:",
            responseText
        );

        if (!response.ok) {
            throw new Error(
                `HTTP ${response.status}: ${responseText}`
            );
        }

        alert("User deleted successfully");

        await fetchData();

    } catch (error) {

        console.error(
            "Delete user failed:",
            error
        );

        alert(`Failed to delete user: ${error}`);

    }
};

    // =========================
    // OPEN ADD USER MODAL
    // =========================
    const handleAddUser = () => {
        setEditingUser(null);
        setShowAddUser(true);
    };

    // =========================
    // OPEN EDIT USER MODAL
    // =========================
    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setShowAddUser(true);
    };

    // =========================
    // CLOSE MODAL
    // =========================
    const handleCloseModal = () => {
        setShowAddUser(false);
        setEditingUser(null);
    };

    return (
        <div className="app">

            {/* =========================
                NAVBAR
            ========================= */}
            <Navbar />

            <main className="main-container">

                {/* =========================
                    HEADER
                ========================= */}
                <div className="page-header">

                    <div>
                        <p className="page-label">
                            ADMINISTRATION
                        </p>

                        <h1>
                            User Management
                        </h1>

                        <p className="page-descriptionn">
                            Manage users, roles and account information.
                        </p>
                    </div>

                    <button
                        className="add-user-btn"
                        onClick={handleAddUser}
                    >
                        + Add User
                    </button>
                    

                </div>

                {/* =========================
                    STATS
                ========================= */}
                <div className="stats-container">

                    {/* TOTAL USERS */}
                    <div className="stat-card">

                        <div className="stat-icon">
                            👥
                        </div>

                        <div>
                            <p>Total Users</p>

                            <h2>
                                {user1.length}
                            </h2>
                        </div>

                    </div>

                    {/* ADMINS */}
                    <div className="stat-card">

                        <div className="stat-icon">
                            🛡️
                        </div>

                        <div>
                            <p>Admins</p>

                            <h2>
                                {
                                    user1.filter(
                                        user =>
                                            user.role
                                                .toLowerCase() === "admin"
                                    ).length
                                }
                            </h2>
                        </div>

                    </div>

                    {/* ACTIVE USERS */}
                    <div className="stat-card">

                        <div className="stat-icon">
                            ✓
                        </div>

                        <div>
                            <p>Active Users</p>

                            <h2>
                                {user1.length}
                            </h2>
                        </div>

                    </div>

                </div>

                {/* =========================
                    USER SECTION
                ========================= */}
                <section className="users-section">

                    {/* SECTION HEADER */}
                    <div className="section-header">

                        <div>

                            <h2>
                                All Users
                            </h2>

                            <p>
                                {filteredUsers.length} users found
                            </p>

                        </div>

                        {/* SEARCH */}
                        <div className="search-box">

                            <span>
                                ⌕
                            </span>

                            <input
                                type="text"
                                placeholder="Search users..."
                                value={search}
                                onChange={(e) =>{
                                    setSearch(e.target.value);
                                     setPageNumber(1);
                                }}
                            />

                        </div>

                    </div>

                    {/* =========================
                        LOADING
                    ========================= */}
                    {loading ? (

                        <div className="loading">

                            <div className="spinner"></div>

                            <p>
                                Loading users...
                            </p>

                        </div>

                    ) : filteredUsers.length === 0 ? (

                        /* =========================
                           NO USERS
                        ========================= */
                        <div className="empty-state">

                            <h3>
                                No users found
                            </h3>

                            <p>
                                Try changing your search.
                            </p>

                        </div>

                    ) : (

                       <div>

        {/* =========================
           USER GRID
        ========================= */}
        <div className="user-grid">

            {filteredUsers.map((user) => (

                <UserCard
                    key={user.userid}
                    userid={user.userid}
                    userName={user.userName}
                    email={user.email}
                    role={user.role}
                    onEdit={() => handleEditUser(user)}
                    onDelete={() => deleteUser(user.userid)}
                />

            ))}

        </div>


        {/* =========================
           PAGINATION
        ========================= */}
        <div className="pagination">

            <button
                onClick={() =>
                    setPageNumber(prev => prev - 1)
                }
                disabled={pageNumber === 1}
            >
                Previous
            </button>

            {Array.from(
                { length: totalPages },
                (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() =>
                            setPageNumber(index + 1)
                        }
                        className={
                            pageNumber === index + 1
                                ? "active-page"
                                : ""
                        }
                    >
                        {index + 1}
                    </button>
                )
            )}

            <button
                onClick={() =>
                    setPageNumber(prev => prev + 1)
                }
                disabled={pageNumber === totalPages}
            >
                Next
            </button>

        </div>

    </div>

                        )}                     

            

                </section>

            </main>

            {/* =========================
                ADD / EDIT USER MODAL
            ========================= */}
            {showAddUser && (

                <AddUserModel

                    onClose={handleCloseModal}

                    onAddUser={fetchData}

                    user={editingUser}

                />

            )}

        </div>
        
    );
}

export default Dashboard;