import { useParams, Link, useNavigate } from "react-router-dom";
import { useBlogs } from "../context/BlogContext";
import { ArrowLeft, Edit2, Calendar, User, Tag } from "lucide-react";
import styles from "./BlogDetails.module.css";

const BlogDetails = () => {
    const { id } = useParams();
    const { blogs } = useBlogs();
    const navigate = useNavigate();

    const blog = blogs.find((b) => b.id === id);

    if (!blog) {
        return (
            <div className={styles.notFound}>
                <h2>Blog not found</h2>
                <Link
                    to="/blogs"
                    className="btn btn-primary"
                    style={{ marginTop: "1rem" }}
                >
                    Back to List
                </Link>
            </div>
        );
    }

    return (
        <div className={`container-max ${styles.detailsContainer}`}>
            <div className="page-header">
                <button
                    onClick={() => navigate(-1)}
                    className="btn btn-secondary"
                >
                    <ArrowLeft size={18} /> Back
                </button>
                <Link to={`/blogs/edit/${blog.id}`} className="btn btn-primary">
                    <Edit2 size={18} /> Edit Blog
                </Link>
            </div>

            <div className="card" style={{ padding: "0", overflow: "hidden" }}>
                {blog.image && (
                    <div className={styles.bannerContainer}>
                        <img
                            src={blog.image}
                            alt={blog.title}
                            className={styles.bannerImage}
                        />
                    </div>
                )}

                <div className={styles.contentWrapper}>
                    <div className={styles.headerRow}>
                        <span
                            className={`badge ${
                                blog.status === "Published"
                                    ? "badge-published"
                                    : "badge-draft"
                            }`}
                        >
                            {blog.status}
                        </span>
                        <span
                            className="text-muted"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                            }}
                        >
                            <Calendar size={16} /> {blog.publishDate}
                        </span>
                    </div>

                    <h1 className={styles.title}>{blog.title}</h1>

                    <div className={styles.metaInfo}>
                        <div className={styles.metaItem}>
                            <User size={18} /> <span>{blog.author}</span>
                        </div>
                        <div className={styles.metaItem}>
                            <Tag size={18} /> <span>{blog.category}</span>
                        </div>
                    </div>

                    <div className={styles.description}>{blog.description}</div>
                </div>
            </div>
        </div>
    );
};

export default BlogDetails;
