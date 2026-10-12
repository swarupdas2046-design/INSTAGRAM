import { createRoot } from "react-dom/client";
import "./index.css";
import AppRoutes from "./routes/AppRoutes.jsx";
import { ToastContainer } from "react-toastify";
import AuthProvider from "./features/AuthProvider.jsx";
import PostContextProvider from "./features/post/PostContextProvider.jsx";
createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <PostContextProvider>
      <AppRoutes />
      <ToastContainer />
    </PostContextProvider>
  </AuthProvider>,
);
