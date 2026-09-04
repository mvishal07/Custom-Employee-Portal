import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = ({ children }) => {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="app-layout">
            <Sidebar
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            <div className="main-area">
                <Header setMobileOpen={setMobileOpen} />

                <main className="page-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;