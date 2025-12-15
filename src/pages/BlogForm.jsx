import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBlogs } from "../context/BlogContext";
import { Save, X, Upload, AlertCircle } from "lucide-react";
import styles from "./BlogForm.module.css";

const BlogForm = () => {
    const { addBlog, updateBlog, blogs } = useBlogs();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const initialState = {
        title: "",
        description: "",
        category: "Technology",
        author: "",
        publishDate: new Date().toISOString().split("T")[0],
        status: "Draft",
        image: null,
    };

    const [formData, setFormData] = useState(initialState);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState("");
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            const blogToEdit = blogs.find((b) => b.id === id);
            if (blogToEdit) {
                setFormData(blogToEdit);
                setPreview(blogToEdit.image);
            } else {
                navigate("/blogs");
            }
        }
    }, [id, blogs, isEditMode, navigate]);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = "";
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () =>
            window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [isDirty]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setIsDirty(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!["image/jpeg", "image/png"].includes(file.type)) {
            setError("JPG/PNG only.");
            return;
        }
        if (file.size > 1024 * 1024) {
            setError("Max 1MB.");
            return;
        }
        setError("");
        setIsDirty(true);
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData((prev) => ({ ...prev, image: reader.result }));
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.author || !formData.description) {
            setError("All fields required.");
            return;
        }
        if (isEditMode) updateBlog(id, formData);
        else addBlog(formData);
        setIsDirty(false);
        navigate("/blogs");
    };

    return (
        <div className={`container-max ${styles.formContainer}`}>
            <div className="page-header">
                <h1 className="text-lg">
                    {isEditMode ? "Edit Blog" : "Create New Blog"}
                </h1>
                <button
                    onClick={() => {
                        if (
                            isDirty &&
                            !window.confirm("Unsaved changes. Leave?")
                        )
                            return;
                        navigate("/blogs");
                    }}
                    className="btn btn-secondary"
                >
                    <X size={20} />
                </button>
            </div>

            {error && (
                <div className="error-box">
                    <AlertCircle size={20} /> {error}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="card"
                style={{ padding: "2rem" }}
            >
                <div className="form-grid form-grid-2 form-group">
                    <div>
                        <label className="form-label">Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Enter title"
                        />
                    </div>
                    <div>
                        <label className="form-label">Author *</label>
                        <input
                            type="text"
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Author name"
                        />
                    </div>
                </div>

                <div className="form-grid form-grid-3 form-group">
                    <div>
                        <label className="form-label">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="form-select"
                        >
                            <option>Technology</option>
                            <option>Lifestyle</option>
                            <option>Education</option>
                            <option>Health</option>
                        </select>
                    </div>
                    <div>
                        <label className="form-label">Publish Date</label>
                        <input
                            type="date"
                            name="publishDate"
                            value={formData.publishDate}
                            onChange={handleChange}
                            className="form-input"
                        />
                    </div>
                    <div>
                        <label className="form-label">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="form-select"
                        >
                            <option>Draft</option>
                            <option>Published</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Cover Image (Max 1MB)</label>
                    <div
                        className="flex"
                        style={{ gap: "1.5rem", alignItems: "flex-start" }}
                    >
                        <label className={styles.uploadLabel}>
                            <Upload size={24} color="#94a3b8" />
                            <span className={styles.uploadText}>
                                Click to upload
                            </span>
                            <input
                                type="file"
                                hidden
                                accept="image/png, image/jpeg"
                                onChange={handleImageChange}
                            />
                        </label>
                        {preview && (
                            <img
                                src={preview}
                                alt="Preview"
                                className={styles.previewImage}
                            />
                        )}
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Description *</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="form-textarea"
                        placeholder="Write content..."
                    ></textarea>
                </div>

                <div className={styles.formFooter}>
                    <button
                        type="button"
                        onClick={() => navigate("/blogs")}
                        className="btn btn-secondary"
                    >
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                        <Save size={18} /> Save Blog
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BlogForm;
