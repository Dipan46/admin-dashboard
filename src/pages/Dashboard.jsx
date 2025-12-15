import { useBlogs } from "../context/BlogContext";
import {
    FileText,
    CheckCircle,
    Edit3,
    Trash2,
    ArrowRight,
    Eye,
} from "lucide-react";
import { Link } from "react-router-dom";
import styles from "./Dashboard.module.css";

const StatCard = ({ title, count, icon: Icon, iconClass, link }) => (
    <Link to={link} className={`card ${styles.statCard}`}>
        <div>
            <p className="text-muted">{title}</p>
            <p className={styles.statCount}>{count}</p>
        </div>
        <div className={`${styles.statIcon} ${iconClass}`}>
            <Icon size={24} />
        </div>
    </Link>
);

const Dashboard = () => {
    const { activeBlogs, trashedBlogs } = useBlogs();

    const totalBlogs = activeBlogs.length;
    const publishedCount = activeBlogs.filter(
        (b) => b.status === "Published"
    ).length;
    const draftCount = activeBlogs.filter((b) => b.status === "Draft").length;
    const trashCount = trashedBlogs.length;

    const recentBlogs = [...activeBlogs]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-lg">Dashboard Overview</h1>
                <p className="text-muted">
                    Welcome back, Admin. Here's what's happening.
                </p>
            </div>

            <div className={styles.statsGrid}>
                <StatCard
                    title="Total Blogs"
                    count={totalBlogs}
                    icon={FileText}
                    iconClass={styles.iconBlue}
                    link="/blogs"
                />
                <StatCard
                    title="Published"
                    count={publishedCount}
                    icon={CheckCircle}
                    iconClass={styles.iconGreen}
                    link="/blogs"
                />
                <StatCard
                    title="Drafts"
                    count={draftCount}
                    icon={Edit3}
                    iconClass={styles.iconYellow}
                    link="/blogs"
                />
                <StatCard
                    title="In Trash"
                    count={trashCount}
                    icon={Trash2}
                    iconClass={styles.iconRed}
                    link="/trash"
                />
            </div>

            <div className="card">
                <div className={styles.recentHeader}>
                    <h2 className="text-lg">Recent Blogs</h2>
                    <Link
                        to="/blogs"
                        className="btn btn-secondary"
                        style={{ fontSize: "0.8rem" }}
                    >
                        View All <ArrowRight size={14} />
                    </Link>
                </div>
                <div>
                    {recentBlogs.length > 0 ? (
                        recentBlogs.map((blog) => (
                            <div key={blog.id} className={styles.recentRow}>
                                <div className="flex items-center gap-2">
                                    {blog.image ? (
                                        <img
                                            src={blog.image}
                                            className="img-thumb"
                                            alt=""
                                        />
                                    ) : (
                                        <div
                                            className="img-thumb"
                                            style={{
                                                background: "#f1f5f9",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <FileText
                                                size={20}
                                                color="#94a3b8"
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <h3 style={{ fontWeight: 500 }}>
                                            {blog.title}
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="text-muted"
                                                style={{ fontSize: "0.75rem" }}
                                            >
                                                {new Date(
                                                    blog.createdAt
                                                ).toLocaleDateString()}
                                            </span>
                                            <span
                                                className={`badge ${
                                                    blog.status === "Published"
                                                        ? "badge-published"
                                                        : "badge-draft"
                                                }`}
                                            >
                                                {blog.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Link
                                        to={`/blogs/view/${blog.id}`}
                                        title="View"
                                        className={styles.actionBtn}
                                        style={{
                                            background: "#eff6ff",
                                            color: "#2563eb",
                                        }}
                                    >
                                        <Eye size={18} />
                                    </Link>
                                    <Link
                                        to={`/blogs/edit/${blog.id}`}
                                        title="Edit"
                                        className={styles.actionBtn}
                                        style={{
                                            background: "#f1f5f9",
                                            color: "#64748b",
                                        }}
                                    >
                                        <Edit3 size={18} />
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div
                            style={{
                                padding: "2rem",
                                textAlign: "center",
                                color: "#64748b",
                            }}
                        >
                            No blogs created yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
