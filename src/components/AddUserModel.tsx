import { useEffect, useState } from "react";
import "../App.css";

interface User {
    userid: string;
    userName: string;
    email: string;
    role: string;
}

interface AddUserModelProps {
    onClose: () => void;
    onAddUser: () => void;
    user?: User | null;
}

export default function AddUserModel({
    onClose,
    onAddUser,
    user
}: AddUserModelProps) {

    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("User");
    const [password, setPassword] = useState("");
    const [loader, setLoader] = useState(false);

    // =========================
    // LOAD USER DATA FOR EDIT
    // =========================
   useEffect(() => {

    if (user) {

        setUserName(user.userName);
        setEmail(user.email);
        setRole(user.role);
        setPassword("");

    } else {

        setUserName("");
        setEmail("");
        setRole("User");
        setPassword("");

    }

}, [user]);

    // =========================
    // SUBMIT
    // =========================
    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        setLoader(true);
        
        try {

            // =====================================
            // EDIT USER
            // =====================================
            if (user) {
                const token = localStorage.getItem("token");
                if(!token)
                {
                    alert("You are not logged in");
                     return;
                }
              const response = await fetch(
                `https://localhost:7192/api/User/${user.userid}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        userName,
                        email,
                        role,
                        password
                    })
                }
            );
              console.log(
                "Update status:",
                response.status
            );
                if (!response.ok) {
                    throw new Error(
                        `HTTP error: ${response.status}`
                    );
                }

                const data = await response.json();

                console.log(
                    "Update user response:",
                    data
                );

                alert("User updated successfully");

            }

            // =====================================
            // ADD USER
            // =====================================
            else {
                const token = localStorage.getItem("token");

            if (!token) {
                alert("You are not logged in");
                return;
            }
                const response = await fetch(
                    "https://localhost:7192/api/User",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            userName,
                            email,
                            role,
                            password
                        })
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        `HTTP error: ${response.status}`
                    );
                }

                const data = await response.json();

                console.log(
                    "Add user response:",
                    data
                );

                alert("User added successfully");
            }

            // Refresh user list
            await onAddUser();

            // Close modal
            onClose();

        } catch (error) {

            console.error(
                "Save user failed:",
                error
            );

            alert(
                user
                    ? "Failed to update user"
                    : "Failed to add user"
            );

        } finally {

            setLoader(false);

        }
    };

    return (
        <div className="model-overlay">

            <div className="model">

                <div className="model-header">

                    <div>

                        {/* =========================
                            TITLE
                        ========================= */}

                        <h2>
                            {user
                                ? "Edit User"
                                : "Add User"}
                        </h2>

                        <p>
                            {user
                                ? "Update user information"
                                : "Create new user"}
                        </p>

                        <button
                            type="button"
                            className="close-btn"
                            onClick={onClose}
                        >
                            Close
                        </button>

                    </div>

                    {/* =========================
                        FORM
                    ========================= */}

                    <form onSubmit={handleSubmit}>

                        {/* USERNAME */}

                        <div className="form-group">

                            <label>
                                UserName
                            </label>

                            <input
                                type="text"
                                value={userName}
                                onChange={(e) =>
                                    setUserName(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter your username"
                                required
                            />

                        </div>


                        {/* EMAIL */}

                        <div className="form-group">

                            <label>
                                Email
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter your email"
                                required
                            />

                        </div>


                        {/* PASSWORD */}

                        <div className="form-group">

                            <label>
                                Password
                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(
                                        e.target.value
                                    )
                                }
                                placeholder={
                                    user
                                        ? "Enter new password"
                                        : "Enter your password"
                                }

                                required={!user}
                            />

                        </div>


                        {/* ROLE */}

                        <div className="form-group">

                            <label>
                                Role
                            </label>

                            <select
                                value={role}
                                onChange={(e) =>
                                    setRole(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="User">
                                    User
                                </option>

                                <option value="Admin">
                                    Admin
                                </option>

                            </select>

                        </div>


                        {/* BUTTONS */}

                        <div>

                            {/* CANCEL */}

                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={onClose}
                                disabled={loader}
                            >
                                Cancel
                            </button>


                            {/* SAVE */}

                            <button
                                type="submit"
                                className="save-btn"
                                disabled={loader}
                            >

                                {loader
                                    ? user
                                        ? "Updating..."
                                        : "Creating..."
                                    : user
                                        ? "Update User"
                                        : "Create User"}

                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>
    );
}