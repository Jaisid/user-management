import { useState, type FormEvent } from "react";

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loader, setLoader] = useState(false);

  const handlePasswordChange = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not logged in.");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User ID not found");
      return;
    }

    if (!currentPassword || !newPassword) {
      alert("Please enter both password fields.");
      return;
    }

    try {
      setLoader(true);

      const response = await fetch(`http://localhost:5187/api/User/${userId}/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();
      console.log("Change password response", data);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      alert("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      console.error("Change password failed:", error);
      alert(error instanceof Error ? error.message : "Failed to change password");
    } finally {
      setLoader(false);
    }
  };

  return (
    <form onSubmit={handlePasswordChange}>
      <div>
        <label htmlFor="currentPassword">Current Password</label>
        <input
          id="currentPassword"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Enter current password"
        />
      </div>

      <div>
        <label htmlFor="newPassword">New Password</label>
        <input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
        />
      </div>

      <button type="submit" disabled={loader}>
        {loader ? "Changing..." : "Change Password"}
      </button>
    </form>
  );
}

export default ChangePassword;