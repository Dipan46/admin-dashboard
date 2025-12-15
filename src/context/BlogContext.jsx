import { createContext, useContext, useState, useEffect } from "react";

const BlogContext = createContext();

export const useBlogs = () => {
    const context = useContext(BlogContext);
    if (!context)
        throw new Error("useBlogs must be used within a BlogProvider");
    return context;
};

const STORAGE_KEY = "edwid_blog_data";
const TRASH_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000; // 30 Days

export const BlogProvider = ({ children }) => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load Data & Auto Purge Logic (Brain Task)
    useEffect(() => {
        const loadData = () => {
            try {
                const savedData = localStorage.getItem(STORAGE_KEY);
                if (savedData) {
                    const parsedBlogs = JSON.parse(savedData);
                    const now = new Date().getTime();

                    // Remove items in trash older than 30 days
                    const cleanBlogs = parsedBlogs.filter((blog) => {
                        if (!blog.deletedAt) return true;
                        const deletedTime = new Date(blog.deletedAt).getTime();
                        return now - deletedTime < TRASH_EXPIRY_MS;
                    });

                    setBlogs(cleanBlogs);

                    if (cleanBlogs.length !== parsedBlogs.length) {
                        localStorage.setItem(
                            STORAGE_KEY,
                            JSON.stringify(cleanBlogs)
                        );
                    }
                }
            } catch (error) {
                console.error("Failed to load blogs:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Persist to LocalStorage
    useEffect(() => {
        if (!loading) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(blogs));
        }
    }, [blogs, loading]);

    // CRUD Operations
    const addBlog = (blogData) => {
        const newBlog = {
            id: crypto.randomUUID(),
            ...blogData,
            createdAt: new Date().toISOString(),
            deletedAt: null,
        };
        setBlogs((prev) => [newBlog, ...prev]);
    };

    const updateBlog = (id, updatedData) => {
        setBlogs((prev) =>
            prev.map((blog) =>
                blog.id === id ? { ...blog, ...updatedData } : blog
            )
        );
    };

    const deleteBlog = (id) => {
        setBlogs((prev) =>
            prev.map((blog) =>
                blog.id === id
                    ? {
                          ...blog,
                          deletedAt: new Date().toISOString(),
                          status: "Archived",
                      }
                    : blog
            )
        );
    };

    const restoreBlog = (id) => {
        setBlogs((prev) =>
            prev.map((blog) =>
                blog.id === id
                    ? { ...blog, deletedAt: null, status: "Draft" }
                    : blog
            )
        );
    };

    const permanentlyDeleteBlog = (id) => {
        setBlogs((prev) => prev.filter((blog) => blog.id !== id));
    };

    return (
        <BlogContext.Provider
            value={{
                blogs,
                activeBlogs: blogs.filter((b) => !b.deletedAt),
                trashedBlogs: blogs.filter((b) => b.deletedAt),
                addBlog,
                updateBlog,
                deleteBlog,
                restoreBlog,
                permanentlyDeleteBlog,
                loading,
            }}
        >
            {children}
        </BlogContext.Provider>
    );
};
