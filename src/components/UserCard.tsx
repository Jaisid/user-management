interface UserCardProps {
    userid: string;
    userName: string;
    email: string;
    role: string;
    onEdit?: ()=>void;
    onDelete?: () => void;
}

export default function UserCard({
    userid,
    userName,
    email,
    role,
    onEdit,
    onDelete
}: UserCardProps) {

    const initials = userName
        .split(" ")
        .map(name => name[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

    return (
        <div className="user-card">
            <div className="card-top">

                <div className="avatar">
                    {initials}
                </div>

                <span
                    className={
                        role.toLowerCase() === "admin"
                            ? "role admin"
                            : "role user"
                    }
                >
                    {role}
                </span>

            </div>

            <div className="user-info">

                <h3>{userName}</h3>

                <p className="email">
                    {email}
                </p>

            </div>

            <div className="user-id">

                <span>User ID</span>

                <p title={userid}>
                    {userid.substring(0, 8)}...
                </p>

            </div>

            <div className="card-footer">

                <span className="status">
                    <span className="status-dot"></span>
                    Active
                </span>
                <div className="card-actions">
                    <button
                    className="edit-btn"
                    onClick={onEdit}>
                        Edit
                    </button>
                    <button
                    className="delete-btn"
                    onClick={onDelete}
                    >
                    Delete
                    </button>
                </div>

            </div>

        </div>
    );
}