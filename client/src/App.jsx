import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import Users from "./pages/admin/Users";
import Roles from "./pages/admin/Roles";
import AuditLogs from "./pages/admin/AuditLogs";

const AdminRoute = ({ children }) => {
    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!user.roles?.includes("Admin")) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <Dashboard />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/users"
                        element={
                            <ProtectedRoute>
                                <AdminRoute>
                                    <Layout>
                                        <Users />
                                    </Layout>
                                </AdminRoute>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/roles"
                        element={
                            <ProtectedRoute>
                                <AdminRoute>
                                    <Layout>
                                        <Roles />
                                    </Layout>
                                </AdminRoute>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/audit"
                        element={
                            <ProtectedRoute>
                                <AdminRoute>
                                    <Layout>
                                        <AuditLogs />
                                    </Layout>
                                </AdminRoute>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/"
                        element={
                            <Navigate
                                to="/dashboard"
                                replace
                            />
                        }
                    />

                    <Route
                        path="*"
                        element={
                            <Navigate
                                to="/dashboard"
                                replace
                            />
                        }
                    />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;