import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

interface AuthContextType {
    token: string | null;
    loginUser: (data: any) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

export function AuthProvider({
    children
}: {
    children: React.ReactNode;
}) {

    const [token, setToken] = useState<string | null>(
        localStorage.getItem("token")
    );

    const loginUser = (data: any) => {

        console.log("Saving login response:", data);

        const jwtToken =
            data.token ||
            data.accessToken;

        if (!jwtToken) {
            console.error("JWT token not found");
            return;
        }

        // Store JWT
        localStorage.setItem(
            "token",
            jwtToken
        );

        // Store user information
        localStorage.setItem(
            "user",
            JSON.stringify({
                userId: data.userId,
                userName: data.userName,
                email: data.email,
                role: data.role
            })
        );

        setToken(jwtToken);
    };

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
    };

    // Check JWT expiration
    useEffect(() => {

        if (!token) {
            return;
        }

        try {

            const payload = JSON.parse(
                atob(token.split(".")[1])
            );

            const expiryTime =
                payload.exp * 1000;

            const currentTime =
                Date.now();

            const remainingTime =
                expiryTime - currentTime;

            console.log(
                "Session remaining:",
                Math.floor(remainingTime / 1000),
                "seconds"
            );

            if (remainingTime <= 0) {

                logout();
                return;
            }

            const timer = setTimeout(() => {

                alert(
                    "Your session has expired. Please login again."
                );

                logout();

            }, remainingTime);

            return () => clearTimeout(timer);

        } catch (error) {

            console.error(
                "Invalid JWT token",
                error
            );

            logout();
        }

    }, [token]);

    return (
        <AuthContext.Provider
            value={{
                token,
                loginUser,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {

    const context = useContext(AuthContext);

    if (!context) {

        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}