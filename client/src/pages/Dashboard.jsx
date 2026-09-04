import { useEffect, useState } from "react";
import {
    FiUsers,
    FiArrowUpRight,
    FiBriefcase,
    FiHeadphones,
    FiDollarSign,
    FiExternalLink,
} from "react-icons/fi";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const serviceDetails = {
    people: {
        title: "Zoho People",
        description: "HR management and employee services",
        icon: <FiUsers />,
        color: "purple",
        url: "https://people.zoho.in",
    },
    crm: {
        title: "Zoho CRM",
        description: "Sales and customer relationship management",
        icon: <FiBriefcase />,
        color: "blue",
        url: "https://crm.zoho.in",
    },
    desk: {
        title: "Zoho Desk",
        description: "Support tickets and case management",
        icon: <FiHeadphones />,
        color: "orange",
        url: "https://desk.zoho.in",
    },
    books: {
        title: "Zoho Books",
        description: "Financial and accounting operations",
        icon: <FiDollarSign />,
        color: "green",
        url: "https://books.zoho.in",
    },
};

const Dashboard = () => {
    const { user } = useAuth();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadServices = async () => {
            try {
                const response = await api.get("/zoho/services");
                setServices(response.data.services || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadServices();
    }, []);

    return (
        <div>
            <div className="page-heading">
                <div>
                    <span className="eyebrow">DASHBOARD</span>

                    <h1>
                        Good morning, {user?.name?.split(" ")[0]} 👋
                    </h1>

                    <p>
                        Here's everything you have access to today.
                    </p>
                </div>
            </div>

            <div className="welcome-banner">
                <div>
                    <span>YOUR WORKSPACE</span>

                    <h2>
                        Access your authorized Zoho applications
                    </h2>

                    <p>
                        Your access is automatically controlled based
                        on your assigned role and permissions.
                    </p>
                </div>

                <div className="banner-shape">
                    EP
                </div>
            </div>

            <div className="section-heading">
                <div>
                    <h2>Applications</h2>
                    <p>Services available to your account</p>
                </div>

                <span className="service-count">
                    {services.length} available
                </span>
            </div>

            {loading ? (
                <div className="loading-card">
                    <div className="spinner"></div>
                    <p>Loading applications...</p>
                </div>
            ) : services.length === 0 ? (
                <div className="empty-state">
                    <div>🔐</div>
                    <h3>No applications assigned</h3>
                    <p>
                        Contact your administrator to request
                        application access.
                    </p>
                </div>
            ) : (
                <div className="service-grid">
                    {services.map((service) => {
                        const details =
                            serviceDetails[service.service] ||
                            serviceDetails[service.name];

                        if (!details) return null;

                        return (
                            <div
                                className="service-card"
                                key={service.service || service.name}
                            >
                                <div className="service-card-top">
                                    <div
                                        className={`service-icon ${details.color}`}
                                    >
                                        {details.icon}
                                    </div>

                                    <span className="authorized">
                                        Authorized
                                    </span>
                                </div>

                                <h3>{details.title}</h3>

                                <p>{details.description}</p>

                                <button
                                    className="service-button"
                                    onClick={() =>
                                        window.open(
                                            service.url ||
                                            details.url,
                                            "_blank"
                                        )
                                    }
                                >
                                    Open application
                                    <FiExternalLink />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="security-banner">
                <div className="security-icon">✓</div>

                <div>
                    <strong>Access controlled by RBAC</strong>

                    <p>
                        Your application access is determined by your
                        organization's roles and permissions.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;