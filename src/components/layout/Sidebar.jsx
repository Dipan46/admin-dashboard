import { LayoutDashboard, FileText, Trash2, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Sidebar.module.css";

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();

    const navItems = [
        { name: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> },
        { name: "All Blogs", path: "/blogs", icon: <FileText size={20} /> },
        { name: "Trash", path: "/trash", icon: <Trash2 size={20} /> },
    ];

    return (
        <>
            {isOpen && (
                <div className={styles.mobileOverlay} onClick={toggleSidebar} />
            )}

            <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
                <div className={styles.sidebarHeader}>
                    <h1 className="text-lg" style={{ color: "white" }}>
                        Admin
                    </h1>
                    <button onClick={toggleSidebar} className={styles.closeBtn}>
                        <X size={24} />
                    </button>
                </div>

                <nav className={styles.sidebarNav}>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => {
                                if (window.innerWidth < 768) toggleSidebar();
                            }}
                            className={`${styles.navLink} ${
                                location.pathname === item.path
                                    ? styles.active
                                    : ""
                            }`}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
