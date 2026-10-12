import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router";
import { AuthContext } from "../features/authProvider";
// import { AuthContext } from "../features/AuthProvider";

// ==============================================================================
// 🔒 PROTECTED MAIN LAYOUT
// Hinglish: Yeh layout check karta hai ki user logged in hai ya nahi.
// Loading ke dauraan spinner dikhata hai taaki redirect flicker na ho.
// ==============================================================================
const ProtectedMainLayout = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-pink-500/20 border-t-pink-500 rounded-full animate-spin" />
      </div>
    );
  }

  // User logged in nahi hai toh login page pe redirect
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedMainLayout;
