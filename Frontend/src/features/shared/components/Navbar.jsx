import React, { useState } from "react";
import { useNavigate } from "react-router";

/**
 * ==============================================================================
 * 🧭 NAVBAR / SIDEBAR COMPONENT - INSTAGRAM CLONE (PREMIUM EDITION)
 * ==============================================================================
 * 📌 FEATURES & BEHAVIOR:
 * 1. Desktop Left Sidebar (Screens >= md):
 *    - Default Rest State: Narrow panel (~72px) showing ONLY clean vertical icons.
 *    - Smooth Hover Expansion: Mouse hover par smoothly 240px expand hota hai aur
 *      text labels seamlessly fade-in hote hain.
 *    - Active & Hover State: Dark pill shape (`bg-[#262626]`), subtle scale effect.
 *    - Notification Badges: Red count badge '1' on Messages, Red alert dot on Notifications.
 *    - Bottom Fixed Links: 'More' menu aur 'Also from Meta' links.
 * 2. Mobile Fixed Bottom Bar (Screens < md):
 *    - Desktop sidebar auto-hide (`hidden md:flex`).
 *    - Screen base par fixed bottom bar (`h-14`) with evenly spaced touch icons:
 *      Home, Search, Reels, Create, Notifications, Profile.
 * 3. 100% Pure React + Tailwind CSS with detailed Hindi + English documentation.
 * ==============================================================================
 */

const Navbar = () => {
  // ============================================================================
  // 🧭 1. STATE MANAGEMENT
  // ============================================================================
  // Currently active navigation tab (Default: 'search' to match design reference)
  const [activeTab, setActiveTab] = useState("search");

  // Desktop hover expansion state (Programmatic & CSS group sync)
  const [isHovered, setIsHovered] = useState(false);

  const navigate = useNavigate()
  // User Profile picture for avatar icons
  const userProfileImage =
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80";

  // ============================================================================
  // 📋 2. NAVIGATION ITEMS DATA MATRIX
  // ============================================================================
  // Core Middle Navigation Items
  const navItems = [
    {
      id: "home",
      label: "Home",
      badge: null,
      icon: (isActive) => (
        <svg
          className={`w-6 h-6 transition-transform duration-200 ${
            isActive ? "scale-105 stroke-[2.5]" : "stroke-2"
          }`}
          fill={isActive ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      id: "reels",
      label: "Reels",
      badge: null,
      icon: (isActive) => (
        <svg
          className={`w-6 h-6 transition-transform duration-200 ${
            isActive ? "scale-105 stroke-[2.5]" : "stroke-2"
          }`}
          fill={isActive ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M10 8l6 4-6 4V8z" fill="currentColor" />
          <line x1="2" y1="7" x2="22" y2="7" />
          <line x1="2" y1="17" x2="22" y2="17" />
        </svg>
      ),
    },
    {
      id: "messages",
      label: "Messages",
      badge: "1", // Red number badge in design
      icon: (isActive) => (
        <svg
          className={`w-6 h-6 transition-transform duration-200 ${
            isActive ? "scale-105 stroke-[2.5]" : "stroke-2"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {/* Messenger / Paper-plane Send Glyph */}
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
          />
        </svg>
      ),
    },
    {
      id: "search",
      label: "Search",
      badge: null,
      icon: (isActive) => (
        <svg
          className={`w-6 h-6 transition-transform duration-200 ${
            isActive ? "scale-105 stroke-[2.5]" : "stroke-2"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      ),
    },
    {
      id: "notifications",
      label: "Notifications",
      badge: "dot", // Red circular dot in design
      icon: (isActive) => (
        <svg
          className={`w-6 h-6 transition-transform duration-200 ${
            isActive ? "scale-105 fill-current" : "fill-none stroke-2"
          }`}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
    },
    {
      id: "create",
      label: "Create",
      badge: null,
      icon: (isActive) => (
        <svg 
          className={`w-6 h-6 transition-transform duration-200 ${
            isActive ? "scale-105 stroke-[2.5]" : "stroke-2"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
      ),
    },
    {
      id: "profile",
      label: "Profile",
      badge: null,
      isAvatar: true,
      icon: (isActive) => (
        <div
          className={`w-6 h-6 rounded-full overflow-hidden transition-all duration-200 ${
            isActive
              ? "ring-2 ring-white ring-offset-2 ring-offset-black"
              : "hover:ring-1 hover:ring-zinc-400"
          }`}
        >
          <img
            src={userProfileImage}
            alt="Profile Avatar"
            className="w-full h-full object-cover"
          />
        </div>
      ),
    },
  ];

  // Bottom Footer Navigation Items
  const bottomItems = [
    {
      id: "more",
      label: "More",
      icon: (
        <svg
          className="w-6 h-6 stroke-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      ),
    },
    {
      id: "meta",
      label: "Also from Meta",
      icon: (
        <svg
          className="w-6 h-6 fill-none stroke-current stroke-2"
          viewBox="0 0 24 24"
        >
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* 
        ======================================================================
        🖥️ DESKTOP LEFT SIDEBAR (SCREENS >= md)
        - Rest State: w-[72px] (Narrow icon-only column)
        - Hover State: w-[240px] (Smoothly expands and fades in text labels)
        - Fixed to far left: fixed top-0 bottom-0 left-0
        ======================================================================
      */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`hidden md:flex fixed top-0 left-0 bottom-0 z-50 bg-black border-r border-zinc-900 text-white flex-col justify-between py-6 px-3 select-none transition-all duration-300 ease-in-out ${
          isHovered ? "w-[240px] shadow-2xl shadow-black/80" : "w-[72px]"
        }`}
      >
        {/* 
          --------------------------------------------------------------------
          📷 TOP LOGO: INSTAGRAM CAMERA GLYPH
          --------------------------------------------------------------------
        */}
        <div>
          <button
            type="button"
            aria-label="Instagram Home"
            onClick={() => setActiveTab("home")}
            className="flex items-center gap-4 w-full p-2.5 rounded-xl hover:bg-zinc-900/60 transition-colors cursor-pointer group"
          >
            {/* Camera Logo Glyph from Screenshot */}
            <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
              <svg
                className="w-6 h-6 stroke-current stroke-2 fill-none"
                viewBox="0 0 24 24"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                <line
                  x1="17.5"
                  y1="6.5"
                  x2="17.51"
                  y2="6.5"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Wordmark (Smoothly fades in when expanded) */}
            <span
              className={`text-xl font-bold tracking-tight text-white transition-all duration-300 overflow-hidden whitespace-nowrap ${
                isHovered ? "opacity-100 max-w-[150px]" : "opacity-0 max-w-0"
              }`}
            >
              Instagram
            </span>
          </button>
        </div>

        {/* 
          --------------------------------------------------------------------
          🗂️ MIDDLE NAVIGATION LINKS (Home, Reels, Messages, Search, etc.)
          --------------------------------------------------------------------
        */}
        <nav className="flex flex-col gap-1.5 my-auto w-full">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>{ 
                    setActiveTab(item.id)
                    if (item.id == "create") navigate("/createPost") 
                }}
                className={`relative flex items-center gap-4 w-full p-3 rounded-xl transition-all duration-200 cursor-pointer text-left ${
                  isActive
                    ? "bg-[#262626] text-white font-semibold"
                    : "text-zinc-200 hover:bg-zinc-900/70 hover:text-white"
                }`}
              >
                {/* Icon Container with Notification Badge */}
                <div className="relative flex-shrink-0 flex items-center justify-center w-6 h-6">
                  {item.icon(isActive)}

                  {/* 1. Red Number Notification Badge (Messages Counter: '1') */}
                  {item.badge === "1" && (
                    <span className="absolute -top-1.5 -right-2 bg-[#ff3040] text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center border-2 border-black animate-pulse">
                      1
                    </span>
                  )}

                  {/* 2. Red Alert Dot (Notifications/Heart) */}
                  {item.badge === "dot" && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#ff3040] rounded-full border border-black shadow-sm" />
                  )}
                </div>

                {/* Text Label (Smooth fade-in on hover expansion) */}
                <span
                  className={`text-sm tracking-wide transition-all duration-300 overflow-hidden whitespace-nowrap ${
                    isHovered
                      ? "opacity-100 max-w-[140px]"
                      : "opacity-0 max-w-0"
                  } ${isActive ? "font-semibold text-white" : "font-normal text-zinc-300"}`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* 
          --------------------------------------------------------------------
          ⚙️ BOTTOM LINKS: 'More' & 'Also from Meta'
          --------------------------------------------------------------------
        */}
        <div className="flex flex-col gap-1.5 pt-2 border-t border-zinc-900/80">
          {bottomItems.map((item) => {
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-4 w-full p-3 rounded-xl transition-all duration-200 cursor-pointer text-left ${
                  isActive
                    ? "bg-[#262626] text-white font-semibold"
                    : "text-zinc-300 hover:bg-zinc-900/70 hover:text-white"
                }`}
              >
                {/* Bottom Icon */}
                <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
                  {item.icon}
                </div>

                {/* Bottom Label */}
                <span
                  className={`text-sm tracking-wide transition-all duration-300 overflow-hidden whitespace-nowrap ${
                    isHovered
                      ? "opacity-100 max-w-[140px]"
                      : "opacity-0 max-w-0"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* 
        ======================================================================
        📱 MOBILE FIXED BOTTOM NAVIGATION BAR (SCREENS < md)
        - Height: h-14 (56px)
        - Even distribution: flex justify-around items-center
        - Fixed to bottom of screen: fixed bottom-0 left-0 right-0 z-50
        - Icons: Home, Search, Reels, Create, Activity (Heart), Profile
        ======================================================================
      */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-t border-zinc-900 h-14 flex items-center justify-around px-3 select-none">
        {/* 1. Mobile Home Icon (Pink Outline when active, matching Image 1) */}
        <button
          type="button"
          aria-label="Home"
          onClick={() => setActiveTab("home")}
          className="p-2 transition-transform active:scale-90 focus:outline-none"
        >
          <svg
            className={`w-6 h-6 stroke-2 ${
              activeTab === "home"
                ? "text-[#d62976] fill-none stroke-current"
                : "text-white fill-none stroke-current"
            }`}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </button>

        {/* 2. Mobile Search Icon */}
        <button
          type="button"
          aria-label="Search"
          onClick={() => setActiveTab("search")}
          className="p-2 transition-transform active:scale-90 focus:outline-none"
        >
          <svg
            className={`w-6 h-6 stroke-2 ${
              activeTab === "search"
                ? "text-white stroke-[2.5]"
                : "text-zinc-400 stroke-2"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>

        {/* 3. Mobile Reels Icon */}
        <button
          type="button"
          aria-label="Reels"
          onClick={() => setActiveTab("reels")}
          className="p-2 transition-transform active:scale-90 focus:outline-none"
        >
          <svg
            className={`w-6 h-6 ${
              activeTab === "reels"
                ? "text-white stroke-2"
                : "text-zinc-400 stroke-2"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M10 8l6 4-6 4V8z" fill="currentColor" />
            <line x1="2" y1="7" x2="22" y2="7" />
            <line x1="2" y1="17" x2="22" y2="17" />
          </svg>
        </button>

        {/* 4. Mobile Create Icon (+) */}
        <button
          type="button"
          aria-label="Create Post"
          onClick={() => setActiveTab("create")}
          className="p-2 transition-transform active:scale-90 focus:outline-none"
        >
          <div className="w-6 h-6 border-2 border-current rounded-lg flex items-center justify-center text-white">
            <svg
              className="w-4 h-4 stroke-[2.5]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
        </button>

        {/* 5. Mobile Activity / Notifications Icon (Heart) */}
        <button
          type="button"
          aria-label="Notifications"
          onClick={() => setActiveTab("notifications")}
          className="relative p-2 transition-transform active:scale-90 focus:outline-none"
        >
          <svg
            className={`w-6 h-6 ${
              activeTab === "notifications"
                ? "text-white fill-current"
                : "text-zinc-400 fill-none stroke-current stroke-2"
            }`}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          {/* Mobile Red Alert Dot */}
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#ff3040] rounded-full border border-black" />
        </button>

        {/* 6. Mobile Profile Icon (Circular Avatar) */}
        <button
          type="button"
          aria-label="Profile"
          onClick={() => setActiveTab("profile")}
          className="p-2 transition-transform active:scale-90 focus:outline-none"
        >
          <div
            className={`w-6 h-6 rounded-full overflow-hidden transition-all ${
              activeTab === "profile"
                ? "ring-2 ring-white ring-offset-1 ring-offset-black"
                : "hover:ring-1 hover:ring-zinc-400"
            }`}
          >
            <img
              src={userProfileImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </button>
      </nav>
    </>
  );
};

export default Navbar;
