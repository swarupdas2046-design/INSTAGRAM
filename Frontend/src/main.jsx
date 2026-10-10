import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";
import { ToastContainer } from "react-toastify";
import AuthProvider from "./features/authProvider.jsx";
createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <AppRoutes />
    <ToastContainer />
  </AuthProvider>,
);
