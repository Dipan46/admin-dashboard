import { useLocation } from "react-router-dom";
import { Menu, User } from "lucide-react";
import styles from "./Navbar.module.css";

const Navbar = ({ toggleSidebar }) => {
    const location = useLocation();

    const getPageTitle = (pathname) => {
        if (pathname === "/") return "Dashboard";
        if (pathname === "/blogs") return "All Blogs";
        if (pathname === "/blogs/new") return "Create New Blog";
        if (pathname.includes("/blogs/edit")) return "Edit Blog";
        if (pathname.includes("/blogs/view")) return "Blog Details";
        if (pathname === "/trash") return "Trash Bin";
        return "Dashboard";
    };

    return (
        <header className={styles.navbar}>
            <div className="flex items-center gap-2">
                <button onClick={toggleSidebar} className={styles.menuBtn}>
                    <Menu size={24} />
                </button>
                <h2 className="text-lg font-semibold">
                    {getPageTitle(location.pathname)}
                </h2>
            </div>

            <div className={styles.userBadge}>
                <div className={styles.avatarCircle}>
                    <User size={18} />
                </div>
                <span>Admin User</span>
            </div>
        </header>
    );
};

export default Navbar;
