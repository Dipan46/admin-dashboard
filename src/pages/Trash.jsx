import { useBlogs } from "../context/BlogContext";
import { RefreshCw, Trash2, AlertTriangle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import styles from "./Trash.module.css";

const Trash = () => {
    const { trashedBlogs, restoreBlog, permanentlyDeleteBlog } = useBlogs();

    if (trashedBlogs.length === 0) {
        return (
            <div className={styles.emptyStateContainer}>
                <div className={styles.emptyIconCircle}>
                    <Trash2 size={32} />
                </div>
                <h2 className="text-lg">Trash is Empty</h2>
                <p className="text-muted" style={{ marginBottom: "1.5rem" }}>
                    Items are automatically removed after 30 days.
                </p>
                <Link to="/blogs" className={`btn ${styles.backBtn}`}>
                    <ArrowLeft size={18} /> Back to Blogs
                </Link>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="text-lg">Trash Bin</h1>
                    <p
                        className="text-muted"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                        }}
                    >
                        <AlertTriangle size={14} color="#ca8a04" /> Auto-delete
                        after 30 days.
                    </p>
                </div>
            </div>

            <div className="card">
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr className={styles.dangerHeader}>
                                <th className={styles.dangerHeaderText}>
                                    Title
                                </th>
                                <th className={styles.dangerHeaderText}>
                                    Category
                                </th>
                                <th className={styles.dangerHeaderText}>
                                    Deleted Date
                                </th>
                                <th
                                    className={styles.dangerHeaderText}
                                    style={{ textAlign: "right" }}
                                >
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {trashedBlogs.map((blog) => (
                                <tr key={blog.id}>
                                    <td>
                                        <span
                                            className="line-clamp"
                                            style={{ fontWeight: 500 }}
                                        >
                                            {blog.title}
                                        </span>
                                    </td>
                                    <td>{blog.category}</td>
                                    <td className="text-muted">
                                        {new Date(
                                            blog.deletedAt
                                        ).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() =>
                                                    restoreBlog(blog.id)
                                                }
                                                className={`btn ${styles.btnRestore}`}
                                            >
                                                <RefreshCw size={16} /> Restore
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (
                                                        window.confirm(
                                                            "Delete permanently?"
                                                        )
                                                    )
                                                        permanentlyDeleteBlog(
                                                            blog.id
                                                        );
                                                }}
                                                className="btn btn-danger"
                                            >
                                                <Trash2 size={16} /> Delete
                                                Forever
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Trash;
