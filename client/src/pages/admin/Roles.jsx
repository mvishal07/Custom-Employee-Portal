import { useEffect, useState } from "react";
import {
    FiShield,
    FiPlus,
    FiCheck,
} from "react-icons/fi";
import api from "../../services/api";

const Roles = () => {
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const [rolesResponse, permissionsResponse] =
                await Promise.all([
                    api.get("/roles"),
                    api.get("/permissions"),
                ]);

            setRoles(rolesResponse.data.roles || []);
            setPermissions(
                permissionsResponse.data.permissions || []
            );
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const rolePermissions = (role) => {
        return (
            role.permissions ||
            role.permissionNames ||
            []
        );
    };

    return (
        <div>
            <div className="admin-page-header">
                <div>
                    <span className="eyebrow">
                        ADMINISTRATION
                    </span>

                    <h1>Roles & Permissions</h1>

                    <p>
                        Control what each role can access.
                    </p>
                </div>

                <button className="primary-button">
                    <FiPlus />
                    Create role
                </button>
            </div>

            {loading ? (
                <div className="loading-card">
                    Loading roles...
                </div>
            ) : (
                <div className="roles-layout">
                    <div className="roles-list">
                        <div className="table-card">
                            <div className="table-header">
                                <h2>Roles</h2>
                            </div>

                            {roles.map((role) => (
                                <button
                                    className={`role-item ${
                                        selectedRole?.id ===
                                        role.id
                                            ? "selected"
                                            : ""
                                    }`}
                                    key={role.id}
                                    onClick={() =>
                                        setSelectedRole(role)
                                    }
                                >
                                    <div className="role-icon">
                                        <FiShield />
                                    </div>

                                    <div>
                                        <strong>
                                            {role.name}
                                        </strong>

                                        <span>
                                            {role.description ||
                                                "Portal role"}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="permissions-panel">
                        <div className="table-card">
                            {!selectedRole ? (
                                <div className="empty-state">
                                    <FiShield />
                                    <h3>
                                        Select a role
                                    </h3>
                                    <p>
                                        Choose a role to view
                                        its permissions.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="permission-header">
                                        <div>
                                            <span className="eyebrow">
                                                ROLE
                                            </span>

                                            <h2>
                                                {
                                                    selectedRole.name
                                                }
                                            </h2>
                                        </div>

                                        <button className="primary-button">
                                            Save changes
                                        </button>
                                    </div>

                                    <div className="permission-grid">
                                        {permissions.map(
                                            (permission) => {
                                                const name =
                                                    permission.name;

                                                const active =
                                                    rolePermissions(
                                                        selectedRole
                                                    ).includes(name);

                                                return (
                                                    <div
                                                        className={`permission-item ${
                                                            active
                                                                ? "enabled"
                                                                : ""
                                                        }`}
                                                        key={
                                                            permission.id
                                                        }
                                                    >
                                                        <div>
                                                            <strong>
                                                                {
                                                                    permission.name
                                                                }
                                                            </strong>

                                                            <span>
                                                                {permission.description ||
                                                                    "Access permission"}
                                                            </span>
                                                        </div>

                                                        <div
                                                            className={`permission-check ${
                                                                active
                                                                    ? "active"
                                                                    : ""
                                                            }`}
                                                        >
                                                            {active && (
                                                                <FiCheck />
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Roles;