import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadUser = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await api.get("/auth/me");

            setUser(response.data.user);
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );
        } catch (error) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    const login = async (email, password) => {
        const response = await api.post("/auth/login", {
            email,
            password,
        });

        localStorage.setItem("token", response.data.token);
        localStorage.setItem(
            "user",
            JSON.stringify(response.data.user)
        );

        setUser(response.data.user);

        return response.data;
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    const hasRole = (role) => {
        return user?.roles?.includes(role);
    };

    const hasPermission = (permission) => {
        return user?.permissions?.includes(permission);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                hasRole,
                hasPermission,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);