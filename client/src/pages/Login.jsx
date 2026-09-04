import { useState } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            await login(email, password);
            navigate("/dashboard");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Invalid email or password"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-left">
                <div className="login-brand">
                    <div className="brand-logo">EP</div>
                    <span>Employee Portal</span>
                </div>

                <div className="login-hero">
                    <span className="eyebrow">ONE SECURE WORKSPACE</span>

                    <h1>
                        Your work.
                        <br />
                        <span>All in one place.</span>
                    </h1>

                    <p>
                        Securely access the tools and resources you need
                        through your organization's employee portal.
                    </p>

                    <div className="feature-list">
                        <div>
                            <span>✓</span>
                            Role-based access
                        </div>

                        <div>
                            <span>✓</span>
                            Secure authentication
                        </div>

                        <div>
                            <span>✓</span>
                            Integrated Zoho services
                        </div>
                    </div>
                </div>

                <div className="login-footer">
                    © 2026 Employee Portal
                </div>
            </div>

            <div className="login-right">
                <div className="login-card">
                    <div className="mobile-login-logo">
                        <div className="brand-logo">EP</div>
                    </div>

                    <span className="login-welcome">
                        WELCOME BACK
                    </span>

                    <h2>Sign in to your account</h2>

                    <p className="login-subtitle">
                        Enter your portal credentials to continue.
                    </p>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email address</label>

                            <div className="input-wrapper">
                                <FiMail />

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    placeholder="you@company.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Password</label>

                            <div className="input-wrapper">
                                <FiLock />

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Enter your password"
                                    required
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword ? (
                                        <FiEyeOff />
                                    ) : (
                                        <FiEye />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="login-options">
                            <label className="remember">
                                <input type="checkbox" />
                                Remember me
                            </label>

                            <button
                                type="button"
                                className="forgot-password"
                            >
                                Forgot password?
                            </button>
                        </div>

                        <button
                            className="login-button"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                "Signing in..."
                            ) : (
                                <>
                                    Sign in
                                    <FiArrowRight />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="security-note">
                        🔒 Your connection is secured and your access
                        is managed by your organization.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;