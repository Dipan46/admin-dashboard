import { useState } from "react";
import { Link } from "react-router-dom";
import { useBlogs } from "../context/BlogContext";
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Filter,
    Eye,
    FileText,
    Image as ImageIcon,
} from "lucide-react";
import styles from "./BlogList.module.css";

const BlogList = () => {
    const { activeBlogs, deleteBlog } = useBlogs();
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Filter Logic
    const filteredBlogs = activeBlogs.filter((blog) => {
        const matchesSearch =
            blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            blog.author.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter
            ? blog.category === categoryFilter
            : true;
        return matchesSearch && matchesCategory;
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentBlogs = filteredBlogs.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="text-lg">All Blogs</h1>
                    <p className="text-muted">
                        Manage and organize your blog posts
                    </p>
                </div>
                <Link to="/blogs/new" className="btn btn-primary">
                    <Plus size={20} /> Add New Blog
                </Link>
            </div>

            <div className="card mb-6">
                <div className="filters-bar">
                    <div className="search-wrapper">
                        <Search className="search-icon" size={20} />
                        <input
                            type="text"
                            className="form-input search-input"
                            placeholder="Search title or author..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter size={18} color="#64748b" />
                        <select
                            className="form-select"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            style={{ width: "auto" }}
                        >
                            <option value="">All Categories</option>
                            <option value="Technology">Technology</option>
                            <option value="Lifestyle">Lifestyle</option>
                            <option value="Education">Education</option>
                            <option value="Health">Health</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th style={{ width: "40%" }}>Blog Details</th>
                                <th>Category</th>
                                <th>Author</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th style={{ textAlign: "right" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentBlogs.length > 0 ? (
                                currentBlogs.map((blog) => (
                                    <tr key={blog.id}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                {blog.image ? (
                                                    <img
                                                        src={blog.image}
                                                        alt={blog.title}
                                                        className="img-thumb"
                                                        style={{
                                                            border: "1px solid #e2e8f0",
                                                        }}
                                                    />
                                                ) : (
                                                    <div
                                                        className="img-thumb"
                                                        style={{
                                                            background:
                                                                "#f1f5f9",
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "center",
                                                            border: "1px solid #e2e8f0",
                                                        }}
                                                    >
                                                        <ImageIcon
                                                            size={18}
                                                            className="text-muted"
                                                        />
                                                    </div>
                                                )}
                                                <span
                                                    className={`line-clamp ${styles.blogTitle}`}
                                                >
                                                    {blog.title}
                                                </span>
                                            </div>
                                        </td>
                                        <td>{blog.category}</td>
                                        <td>{blog.author}</td>
                                        <td
                                            className="text-muted"
                                            style={{ fontSize: "0.875rem" }}
                                        >
                                            {blog.publishDate}
                                        </td>
                                        <td>
                                            <span
                                                className={`badge ${
                                                    blog.status === "Published"
                                                        ? "badge-published"
                                                        : "badge-draft"
                                                }`}
                                            >
                                                {blog.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    to={`/blogs/view/${blog.id}`}
                                                    className={styles.btnView}
                                                    title="View Details"
                                                >
                                                    <Eye size={16} />
                                                </Link>
                                                <Link
                                                    to={`/blogs/edit/${blog.id}`}
                                                    className={styles.btnEdit}
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        if (
                                                            window.confirm(
                                                                "Move to trash?"
                                                            )
                                                        )
                                                            deleteBlog(blog.id);
                                                    }}
                                                    className={styles.btnDelete}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className={styles.emptyContainer}
                                    >
                                        <div className={styles.emptyContent}>
                                            <FileText size={32} />
                                            <p>No blogs found.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {filteredBlogs.length > 0 && (
                    <div className="pagination">
                        <span className="text-muted">
                            Showing {startIndex + 1}-
                            {Math.min(
                                startIndex + itemsPerPage,
                                filteredBlogs.length
                            )}{" "}
                            of {filteredBlogs.length}
                        </span>
                        <div className="pagination-controls">
                            <button
                                onClick={() =>
                                    handlePageChange(currentPage - 1)
                                }
                                disabled={currentPage === 1}
                                className="page-btn"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            {Array.from(
                                { length: totalPages },
                                (_, i) => i + 1
                            ).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`page-btn ${
                                        currentPage === page ? "active" : ""
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() =>
                                    handlePageChange(currentPage + 1)
                                }
                                disabled={currentPage === totalPages}
                                className="page-btn"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogList;
