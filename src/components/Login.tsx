import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { login } from "../services/AuthService";
import { useAuth } from "../context/AuthContext";
import type { LoginRequest } from "../types/Auth";

export default function Login() {

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginRequest>();

    const { loginUser } = useAuth();

    const navigate = useNavigate();

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function onSubmit(data: LoginRequest) {

        setLoading(true);
        setError("");

        try {

            const result = await login(data);

            console.log("Login result:", result);

            loginUser(result);

            navigate("/dashboard");

        } catch (e: any) {

            console.error("Login failed:", e);

            setError(
                e.response?.data?.message ||
                "Invalid email or password."
            );

        } finally {

            setLoading(false);

        }
    }

    return (
        <div className="auth-page">

            <form
                className="card auth-card"
                onSubmit={handleSubmit(onSubmit)}
            >

                <div className="logo">
                    U
                </div>

                <h1>
                    Welcome back
                </h1>

                <p className="muted">
                    Sign in to your account
                </p>

                {error && (
                    <div className="alert error">
                        {error}
                    </div>
                )}

                <label>
                    Email
                </label>

                <input
                    type="email"
                    {...register("email", {
                        required: "Email is required"
                    })}
                />

                {errors.email && (
                    <small className="field-error">
                        {errors.email.message}
                    </small>
                )}

                <label>
                    Password
                </label>

                <input
                    type="password"
                    {...register("password", {
                        required: "Password is required"
                    })}
                />

                {errors.password && (
                    <small className="field-error">
                        {errors.password.message}
                    </small>
                )}

                <button
                    className="btn btn-primary full"
                    disabled={loading}
                >
                    {loading
                        ? "Signing in..."
                        : "Sign In"}
                </button>

                <p className="center muted">

                    Don't have an account?{" "}

                    <Link to="/register">
                        Register
                    </Link>

                </p>

            </form>

        </div>
    );
}