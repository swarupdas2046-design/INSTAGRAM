import React, { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { AuthContext } from "../../authProvider";
// import { AuthContext } from "../../AuthProvider";

// ==============================================================================
// 🧭 NAVBAR / SIDEBAR COMPONENT - INSTAGRAM CLONE (INTEGRATED EDITION)
// Features:
// - Desktop fixed left sidebar, hover to expand (72px -> 240px)
// - Mobile fixed bottom bar
// - Real user profile image from AuthContext
// - Real navigation linked to app routes
// ==============================================================================

const Navbar = () => {
  const { user, userLogout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  // Active tab kaise determine karein - current route se
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === "/app" || path === "/app/") return "home";
    if (path.startsWith("/app/explore")) return "reels";
    if (path.startsWith("/app/search")) return "search";
    if (path.startsWith("/app/createPost")) return "create";
    if (path.startsWith("/app/profile")) return "profile";
    return "home";
  };
  const activeTab = getActiveTab();

  const userProfileImage =
    user?.profileImage ||
    "https://ik.imagekit.io/swarup2046/USER_DEFAULT_IMG.avif?updatedAt=1784907094992";

  const navItems = [
    {
      id: "home",
      label: "Home",
      badge: null,
      action: () => navigate("/app"),
      icon: (isActive) => (
        <svg className={`w-6 h-6 transition-transform duration-200 ${isActive ? "scale-105 stroke-[2.5]" : "stroke-2"}`} fill={isActive ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: "search",
      label: "Search",
      badge: null,
      action: () => navigate("/app/search"),
      icon: (isActive) => (
        <svg className={`w-6 h-6 transition-transform duration-200 ${isActive ? "scale-105 stroke-[2.5]" : "stroke-2"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      id: "reels",
      label: "Explore",
      badge: null,
      action: () => navigate("/app/explore"),
      icon: (isActive) => (
        <svg className={`w-6 h-6 transition-transform duration-200 ${isActive ? "scale-105 stroke-[2.5]" : "stroke-2"}`} fill={isActive ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M10 8l6 4-6 4V8z" fill="currentColor" />
          <line x1="2" y1="7" x2="22" y2="7" />
          <line x1="2" y1="17" x2="22" y2="17" />
        </svg>
      ),
    },
    {
      id: "create",
      label: "Create",
      badge: null,
      action: () => navigate("/app/createPost"),
      icon: (isActive) => (
        <svg className={`w-6 h-6 transition-transform duration-200 ${isActive ? "scale-105 stroke-[2.5]" : "stroke-2"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    {
      id: "profile",
      label: "Profile",
      badge: null,
      action: () => navigate(`/app/profile/${user?.username || ""}`),
      isAvatar: true,
      icon: (isActive) => (
        <div className={`w-6 h-6 rounded-full overflow-hidden transition-all duration-200 ${isActive ? "ring-2 ring-white ring-offset-2 ring-offset-black" : "hover:ring-1 hover:ring-zinc-400"}`}>
          <img src={userProfileImage} alt="Profile" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "https://ik.imagekit.io/swarup2046/USER_DEFAULT_IMG.avif?updatedAt=1784907094992"; }} />
        </div>
      ),
    },
  ];

  const bottomItems = [
    {
      id: "more",
      label: "Log out",
      action: async () => {
        await userLogout();
        navigate("/", { replace: true });
      },
      icon: (
        <svg className="w-6 h-6 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* ====================================================================== */}
      {/* 🖥️ DESKTOP LEFT SIDEBAR */}
      {/* ====================================================================== */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`hidden md:flex fixed top-0 left-0 bottom-0 z-50 bg-black border-r border-zinc-900 text-white flex-col justify-between py-6 px-3 select-none transition-all duration-300 ease-in-out ${isHovered ? "w-[240px] shadow-2xl shadow-black/80" : "w-[72px]"}`}
      >
        {/* Logo */}
        <div>
          <button
            type="button"
            onClick={() => navigate("/app")}
            className="flex items-center gap-4 w-full p-2.5 rounded-xl hover:bg-zinc-900/60 transition-colors cursor-pointer group"
          >
            <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className={`text-xl font-bold tracking-tight text-white transition-all duration-300 overflow-hidden whitespace-nowrap ${isHovered ? "opacity-100 max-w-[150px]" : "opacity-0 max-w-0"}`}>
              Instagram
            </span>
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex flex-col gap-1.5 my-auto w-full">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={item.action}
                className={`relative flex items-center gap-4 w-full p-3 rounded-xl transition-all duration-200 cursor-pointer text-left ${isActive ? "bg-[#262626] text-white font-semibold" : "text-zinc-200 hover:bg-zinc-900/70 hover:text-white"}`}
              >
                <div className="relative flex-shrink-0 flex items-center justify-center w-6 h-6">
                  {item.icon(isActive)}
                </div>
                <span className={`text-sm tracking-wide transition-all duration-300 overflow-hidden whitespace-nowrap ${isHovered ? "opacity-100 max-w-[140px]" : "opacity-0 max-w-0"} ${isActive ? "font-semibold text-white" : "font-normal text-zinc-300"}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Bottom: Logout */}
        <div className="flex flex-col gap-1.5 pt-2 border-t border-zinc-900/80">
          {bottomItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={item.action}
              className="flex items-center gap-4 w-full p-3 rounded-xl transition-all duration-200 cursor-pointer text-left text-zinc-300 hover:bg-zinc-900/70 hover:text-white"
            >
              <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">{item.icon}</div>
              <span className={`text-sm tracking-wide transition-all duration-300 overflow-hidden whitespace-nowrap ${isHovered ? "opacity-100 max-w-[140px]" : "opacity-0 max-w-0"}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </aside>

      {/* ====================================================================== */}
      {/* 📱 MOBILE BOTTOM NAV */}
      {/* ====================================================================== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-t border-zinc-900 h-14 flex items-center justify-around px-3 select-none">
        {/* Home */}
        <button type="button" onClick={() => navigate("/app")} className="p-2 transition-transform active:scale-90">
          <svg className={`w-6 h-6 stroke-2 ${activeTab === "home" ? "text-white fill-none stroke-current" : "text-zinc-400 fill-none stroke-current"}`} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>

        {/* Search */}
        <button type="button" onClick={() => navigate("/app/search")} className="p-2 transition-transform active:scale-90">
          <svg className={`w-6 h-6 ${activeTab === "search" ? "text-white stroke-[2.5]" : "text-zinc-400 stroke-2"} fill-none stroke-current`} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        {/* Explore/Reels */}
        <button type="button" onClick={() => navigate("/app/explore")} className="p-2 transition-transform active:scale-90">
          <svg className={`w-6 h-6 ${activeTab === "reels" ? "text-white stroke-2" : "text-zinc-400 stroke-2"} fill-none stroke-current`} viewBox="0 0 24 24">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M10 8l6 4-6 4V8z" fill="currentColor" />
            <line x1="2" y1="7" x2="22" y2="7" />
            <line x1="2" y1="17" x2="22" y2="17" />
          </svg>
        </button>

        {/* Create */}
        <button type="button" onClick={() => navigate("/app/createPost")} className="p-2 transition-transform active:scale-90">
          <div className={`w-6 h-6 border-2 rounded-lg flex items-center justify-center ${activeTab === "create" ? "border-white text-white" : "border-zinc-400 text-zinc-400"}`}>
            <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </button>

        {/* Profile */}
        <button type="button" onClick={() => navigate(`/app/profile/${user?.username || ""}`)} className="p-2 transition-transform active:scale-90">
          <div className={`w-6 h-6 rounded-full overflow-hidden ${activeTab === "profile" ? "ring-2 ring-white ring-offset-1 ring-offset-black" : "ring-1 ring-zinc-700"}`}>
            <img src={userProfileImage} alt="Profile" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "https://ik.imagekit.io/swarup2046/USER_DEFAULT_IMG.avif?updatedAt=1784907094992"; }} />
          </div>
        </button>
      </nav>
    </>
  );
};

export default Navbar;
