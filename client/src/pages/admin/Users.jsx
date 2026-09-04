import { useEffect, useState } from "react";
import { FiPlus, FiTrash2, FiUser } from "react-icons/fi";
import api from "../../services/api";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        roleId: "",
    });

    const loadData = async () => {
        try {
            const [usersResponse, rolesResponse] =
                await Promise.all([
                    api.get("/users"),
                    api.get("/roles"),
                ]);

            setUsers(usersResponse.data.users || []);
            setRoles(rolesResponse.data.roles || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const createUser = async (e) => {
        e.preventDefault();

        try {
            await api.post("/users", {
                name: form.name,
                email: form.email,
                password: form.password,
                roleId: form.roleId
                    ? Number(form.roleId)
                    : undefined,
            });

            setShowModal(false);

            setForm({
                name: "",
                email: "",
                password: "",
                roleId: "",
            });

            loadData();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Unable to create user"
            );
        }
    };

    const deleteUser = async (id) => {
        if (!window.confirm("Delete this user?")) return;

        try {
            await api.delete(`/users/${id}`);
            loadData();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Unable to delete user"
            );
        }
    };

    return (
        <div>
            <div className="admin-page-header">
                <div>
                    <span className="eyebrow">
                        ADMINISTRATION
                    </span>

                    <h1>User Management</h1>

                    <p>
                        Create and manage employee portal accounts.
                    </p>
                </div>

                <button
                    className="primary-button"
                    onClick={() => setShowModal(true)}
                >
                    <FiPlus />
                    Add user
                </button>
            </div>

            <div className="stats-row">
                <div className="stat-card">
                    <div className="stat-icon">
                        <FiUsersIcon />
                    </div>

                    <div>
                        <span>Total users</span>
                        <strong>{users.length}</strong>
                    </div>
                </div>
            </div>

            <div className="table-card">
                <div className="table-header">
                    <div>
                        <h2>All users</h2>
                        <p>Manage employee access</p>
                    </div>
                </div>

                {loading ? (
                    <div className="table-loading">
                        Loading users...
                    </div>
                ) : users.length === 0 ? (
                    <div className="empty-table">
                        No users found.
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th>Roles</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>
                                            <div className="table-user">
                                                <div className="avatar">
                                                    {user.name
                                                        ?.charAt(0)
                                                        ?.toUpperCase()}
                                                </div>

                                                <strong>
                                                    {user.name}
                                                </strong>
                                            </div>
                                        </td>

                                        <td>{user.email}</td>

                                        <td>
                                            <span
                                                className={`status ${
                                                    user.status ===
                                                    "active"
                                                        ? "active"
                                                        : "inactive"
                                                }`}
                                            >
                                                {user.status}
                                            </span>
                                        </td>

                                        <td>
                                            {user.roles?.join(", ") ||
                                                "Employee"}
                                        </td>

                                        <td>
                                            <button
                                                className="icon-delete"
                                                onClick={() =>
                                                    deleteUser(
                                                        user.id
                                                    )
                                                }
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showModal && (
                <div
                    className="modal-overlay"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2>Create user</h2>

                        <p>
                            Add a new employee to the portal.
                        </p>

                        <form onSubmit={createUser}>
                            <div className="form-group">
                                <label>Full name</label>
                                <input
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            name: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            email: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    value={form.password}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            password: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Role</label>

                                <select
                                    value={form.roleId}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            roleId: e.target.value,
                                        })
                                    }
                                >
                                    <option value="">
                                        Select role
                                    </option>

                                    {roles.map((role) => (
                                        <option
                                            key={role.id}
                                            value={role.id}
                                        >
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={() =>
                                        setShowModal(false)
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="primary-button"
                                >
                                    Create user
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const FiUsersIcon = () => <FiUser />;

export default Users;