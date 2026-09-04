import { FiMenu, FiBell } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const Header = ({ setMobileOpen }) => {
    const { user } = useAuth();

    return (
        <header className="top-header">
            <button
                className="menu-button"
                onClick={() => setMobileOpen(true)}
            >
                <FiMenu />
            </button>

            <div className="header-right">
                <button className="notification-button">
                    <FiBell />
                    <span></span>
                </button>

                <div className="header-user">
                    <div className="avatar">
                        {user?.name?.charAt(0)?.toUpperCase()}
                    </div>

                    <div>
                        <strong>{user?.name}</strong>
                        <small>{user?.email}</small>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;