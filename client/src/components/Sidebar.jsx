import {
    FiGrid,
    FiUsers,
    FiShield,
    FiActivity,
    FiLogOut,
    FiX,
} from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
    const { user, logout, hasRole } = useAuth();

    return (
        <>
            {mobileOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
                <div className="sidebar-header">
                    <div className="brand">
                        <div className="brand-logo">EP</div>

                        <div>
                            <h2>Employee Portal</h2>
                            <span>Zoho Workspace</span>
                        </div>
                    </div>

                    <button
                        className="mobile-close"
                        onClick={() => setMobileOpen(false)}
                    >
                        <FiX />
                    </button>
                </div>

                <div className="sidebar-section">
                    <span className="section-title">MAIN</span>

                    <NavLink
                        to="/dashboard"
                        className="sidebar-link"
                        onClick={() => setMobileOpen(false)}
                    >
                        <FiGrid />
                        <span>Dashboard</span>
                    </NavLink>
                </div>

                {hasRole("Admin") && (
                    <div className="sidebar-section">
                        <span className="section-title">ADMINISTRATION</span>

                        <NavLink
                            to="/admin/users"
                            className="sidebar-link"
                            onClick={() => setMobileOpen(false)}
                        >
                            <FiUsers />
                            <span>Users</span>
                        </NavLink>

                        <NavLink
                            to="/admin/roles"
                            className="sidebar-link"
                            onClick={() => setMobileOpen(false)}
                        >
                            <FiShield />
                            <span>Roles & Permissions</span>
                        </NavLink>

                        <NavLink
                            to="/admin/audit"
                            className="sidebar-link"
                            onClick={() => setMobileOpen(false)}
                        >
                            <FiActivity />
                            <span>Audit Logs</span>
                        </NavLink>
                    </div>
                )}

                <div className="sidebar-bottom">
                    <div className="sidebar-user">
                        <div className="avatar">
                            {user?.name?.charAt(0)?.toUpperCase()}
                        </div>

                        <div className="sidebar-user-info">
                            <strong>{user?.name}</strong>
                            <span>{user?.roles?.join(", ")}</span>
                        </div>
                    </div>

                    <button
                        className="logout-button"
                        onClick={logout}
                    >
                        <FiLogOut />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;