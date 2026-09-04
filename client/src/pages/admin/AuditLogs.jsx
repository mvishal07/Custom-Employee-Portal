import { useEffect, useState } from "react";
import { FiActivity, FiClock } from "react-icons/fi";
import api from "../../services/api";

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadLogs = async () => {
            try {
                const response =
                    await api.get("/audit-logs");

                setLogs(response.data.logs || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadLogs();
    }, []);

    return (
        <div>
            <div className="admin-page-header">
                <div>
                    <span className="eyebrow">
                        ADMINISTRATION
                    </span>

                    <h1>Audit Logs</h1>

                    <p>
                        Monitor authentication and portal activity.
                    </p>
                </div>
            </div>

            <div className="table-card">
                <div className="table-header">
                    <div className="table-title-icon">
                        <FiActivity />
                    </div>

                    <div>
                        <h2>Activity history</h2>
                        <p>Recent portal events</p>
                    </div>
                </div>

                {loading ? (
                    <div className="table-loading">
                        Loading activity...
                    </div>
                ) : logs.length === 0 ? (
                    <div className="empty-state">
                        <FiClock />
                        <h3>No activity yet</h3>
                        <p>
                            Portal activity will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="audit-list">
                        {logs.map((log) => (
                            <div
                                className="audit-item"
                                key={log.id}
                            >
                                <div className="audit-icon">
                                    <FiActivity />
                                </div>

                                <div className="audit-content">
                                    <strong>
                                        {log.action}
                                    </strong>

                                    <span>
                                        User ID:{" "}
                                        {log.user_id || "System"}
                                    </span>
                                </div>

                                <time>
                                    {log.created_at
                                        ? new Date(
                                              log.created_at
                                          ).toLocaleString()
                                        : "-"}
                                </time>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuditLogs;