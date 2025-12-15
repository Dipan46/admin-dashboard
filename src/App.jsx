import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import { BlogProvider } from "./context/BlogContext";
import BlogForm from "./pages/BlogForm";
import BlogList from "./pages/BlogList";
import BlogDetails from "./pages/BlogDetails"; // <-- Import new page
import Trash from "./pages/Trash";
import Dashboard from "./pages/Dashboard";

function App() {
    return (
        <BlogProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<MainLayout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="blogs" element={<BlogList />} />
                        <Route path="blogs/new" element={<BlogForm />} />
                        <Route
                            path="blogs/view/:id"
                            element={<BlogDetails />}
                        />
                        <Route path="blogs/edit/:id" element={<BlogForm />} />
                        <Route path="trash" element={<Trash />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </BlogProvider>
    );
}

export default App;
