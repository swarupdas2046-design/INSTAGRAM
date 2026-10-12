import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router';
import { AuthContext } from '../features/authProvider';
// import { AuthContext } from '../features/AuthProvider';

// ==============================================================================
// 🔓 PROTECTED AUTH LAYOUT
// Hinglish: Agar user pehle se logged in hai toh auth pages (login, register)
// pe jaane ki zaroorat nahi - directly app pe redirect karte hain.
// ==============================================================================
const ProtectedAuthLayout = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-pink-500/20 border-t-pink-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Already logged in hai toh app pe redirect karo
  if (user) {
    return <Navigate to="/app" replace />;
  }

  return <Outlet />;
}

export default ProtectedAuthLayout
