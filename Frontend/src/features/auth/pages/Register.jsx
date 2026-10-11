import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/userAuth";

// ==========================================
// 📸 REGISTER PAGE STORY ASSETS (FRESH & DISTINCT FROM LOGIN)
// ==========================================
// Register page ke liye alag, vibrant creator & community photos:
const REGISTER_STORY_ASSETS = {
  // Center Card: Creative friends laughing together at sunset / festival
  centerStory:
    "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80",
  // Left Card: Stylish fashion creator capturing aesthetic moments
  leftStory:
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
  // Right Card: Creative traveler exploring city streets
  rightStory:
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
  // Story creator avatar on bottom right
  storyAvatar:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
};

const Register = () => {
  // ==========================================
  // 🧭 1. HOOKS & ORIGINAL LOGIC (PRESERVED)
  // ==========================================
  // Navigation hook - login page (/) ya dashboard (/app) par redirect karne ke liye
  const navigate = useNavigate();

  // Custom Authentication hook - loading status aur userRegister function
  const { loading, userRegister } = useAuth();

  // Password hide/show toggle karne ke liye local UI state
  const [showPassword, setShowPassword] = useState(false);

  // React Hook Form initialization - realtime 'onChange' mode
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
  });

  // ==========================================
  // ⚡ 2. FORM SUBMIT HANDLER (ORIGINAL LOGIC PRESERVED)
  // ==========================================
  // Aapka original FormSubmit function: username, email aur password extract karke userRegister ko pass karta hai.
  const FormSubmit = async (data) => {
    try {
      const { username, email, password } = data;

      // Server registration API call
      const response = await userRegister(username, email, password);

      if (!response) return;

      console.log("Registration Response:----->", response);
      // Success hone par direct main application feed (/app) par redirect
      navigate("/app");
      reset();
    } catch (error) {
      console.log("Registration Error:", error);
    }
  };

  // ==========================================
  // ⏳ 3. LOADING STATE VIEW (PRESERVED & STYLED)
  // ==========================================
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 rounded-full border-4 border-pink-500/20 border-t-pink-500 animate-spin mb-4" />
        <h1 className="text-lg font-semibold tracking-wide text-zinc-400">
          Creating your account...
        </h1>
      </div>
    );
  }

  // Dynamic Birthday dropdown data
  const currentYear = new Date().getFullYear();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from({ length: 100 }, (_, i) => currentYear - 13 - i);

  return (
    <div className="min-h-screen w-full bg-[#0a0a0c] text-white flex flex-col justify-between font-sans selection:bg-pink-500 selection:text-white">
      {/* 
        ======================================================================
        🖥️ MAIN CONTAINER (DESKTOP: SPLIT 2 COLUMNS, MOBILE: STACKED)
        - Desktop par Login page ki tarah exact 2-column layout
        - Left: Fresh creative hero story art
        - Right: Instagram register form
        ======================================================================
      */}
      <div className="flex-1 w-full grid grid-cols-1 lg:grid-cols-2">
        {/* 
          ====================================================================
          🎨 LEFT HERO SECTION (CREATIVE COMMUNITY THEME WITH FRESH IMAGES)
          - Design Reference: Login page ka exact sibling view
          - Headline: "Share what you love with your creative community."
          - 3 Realistic creator story cards with interactive stickers
          ====================================================================
        */}
        <div className="hidden lg:flex flex-col items-center justify-center p-10 xl:p-14 bg-black border-r border-zinc-900/80 relative overflow-hidden select-none">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute w-135 h-135 bg-linear-to-tr from-purple-600/10 via-pink-600/10 to-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

          {/* 
            ------------------------------------------------------------------
            📝 HERO HEADLINE (FRESH THEME MATCHING LOGIN COLOR SCHEME)
            "Share what you love with your"
            "creative community."
            ------------------------------------------------------------------
          */}
          <div className="text-center z-10 max-w-3xl mb-10">
            <h1 className="text-4xl xl:text-[46px] font-bold text-white tracking-tight leading-tight">
              Share what you love with your{" "}
              <span className="text-[#ff7849]">creative </span>
              <span className="text-[#e1306c]">community</span>
              <span className="text-white">.</span>
            </h1>

            {/* Custom dual-tone accent matching login page */}
            <div className="mt-2 text-4xl xl:text-[46px] font-bold tracking-tight"></div>
          </div>

          {/* 
            ==================================================================
            📱 3 REALISTIC CREATOR STORY CARDS WITH ACTUAL MODEL PHOTOS
            ==================================================================
          */}
          <div className="relative w-95 h-100 flex items-center justify-center my-2 z-10">
            {/* 
              ----------------------------------------------------------------
              1. LEFT STORY CARD (Tilted Left, Fashion Creator + 3D Sparkle Sticker)
              ----------------------------------------------------------------
            */}
            <div className="absolute w-44 h-72 rounded-[28px] overflow-hidden -rotate-12 -translate-x-20 translate-y-3 shadow-2xl border border-white/15 bg-zinc-900 transition-all duration-500 hover:-rotate-6 hover:scale-105 z-10">
              <img
                src={REGISTER_STORY_ASSETS.leftStory}
                alt="Creator Left"
                className="w-full h-full object-cover object-center filter brightness-95"
              />

              {/* Story Progress Bar */}
              <div className="absolute top-2.5 left-3 right-3 h-[2.5px] bg-white/40 rounded-full overflow-hidden">
                <div className="w-3/4 h-full bg-white rounded-full" />
              </div>

              {/* Bottom Reply Bar */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5">
                <div className="flex-1 h-7 rounded-full border border-white/60 bg-black/30 backdrop-blur-md px-2.5 flex items-center">
                  <span className="text-[9px] text-white/70">Send message</span>
                </div>
              </div>
            </div>

            {/* Floating 3D Gradient Star/Sparkle Sticker on Left Edge */}
            <div className="absolute -left-2 top-1/2 -translate-y-8 z-30 drop-shadow-[0_10px_20px_rgba(255,122,0,0.5)] transition-transform duration-300 hover:scale-125">
              <div className="w-11 h-11 rounded-2xl bg-linear-to-tr from-[#ff7a00] to-[#ff0169] flex items-center justify-center p-2 rotate-[-8deg]">
                <svg
                  className="w-6 h-6 text-white fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
            </div>

            {/* 
              ----------------------------------------------------------------
              2. CENTER STORY CARD (Hero Layer, Creative Friends Celebrating)
              ----------------------------------------------------------------
            */}
            <div className="absolute w-48 h-80 rounded-4xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/20 bg-zinc-900 z-20 transition-all duration-500 hover:scale-105">
              <img
                src={REGISTER_STORY_ASSETS.centerStory}
                alt="Creative Community Story"
                className="w-full h-full object-cover object-center"
              />

              {/* Gradient Bottom Shadow */}
              <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

              {/* Top Progress Bar */}
              <div className="absolute top-3 left-4 right-4 h-[2.5px] bg-white/40 rounded-full overflow-hidden">
                <div className="w-full h-full bg-white rounded-full" />
              </div>

              {/* Floating Reaction Bubble (🔥✨📸) */}
              <div className="absolute top-4 left-3 bg-white text-black px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1 text-xs font-semibold animate-bounce duration-1000">
                <span>🔥</span>
                <span>✨</span>
                <span>📸</span>
              </div>

              {/* Bottom Reply Bar & Heart Like Button */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
                <div className="flex-1 h-8 rounded-full border-2 border-white/80 bg-black/20 backdrop-blur-md px-3 flex items-center">
                  <span className="text-[10px] text-white/80 font-medium">
                    Send message...
                  </span>
                </div>
                <button
                  type="button"
                  className="text-white hover:text-pink-500 transition-colors p-1"
                >
                  <svg
                    className="w-5 h-5 fill-none stroke-current stroke-2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* 
              ----------------------------------------------------------------
              3. RIGHT STORY CARD (Tilted Right, Urban Creator + Close Friends Tag)
              ----------------------------------------------------------------
            */}
            <div className="absolute w-44 h-72 rounded-[28px] overflow-hidden rotate-12 translate-x-20 translate-y-4 shadow-2xl border border-white/15 bg-zinc-900 transition-all duration-500 hover:rotate-6 hover:scale-105 z-10">
              <img
                src={REGISTER_STORY_ASSETS.rightStory}
                alt="Creator Right"
                className="w-full h-full object-cover object-center filter brightness-95"
              />

              {/* Progress Bar */}
              <div className="absolute top-2.5 left-3 right-3 h-[2.5px] bg-white/40 rounded-full overflow-hidden">
                <div className="w-1/2 h-full bg-white rounded-full" />
              </div>

              {/* Close Friends Green Badge */}
              <div className="absolute top-3 right-3 bg-[#00c950] text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                <span>★</span>
                <span>✓</span>
              </div>

              {/* Bottom Reply Bar */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5">
                <div className="flex-1 h-7 rounded-full border border-white/60 bg-black/30 backdrop-blur-md px-2 flex items-center">
                  <span className="text-[9px] text-white/70">Reply</span>
                </div>
                <svg
                  className="w-4 h-4 text-white fill-none stroke-current stroke-2"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
            </div>

            {/* Creator Avatar with Rainbow Story Ring */}
            <div className="absolute right-0 bottom-6 z-30 p-0.5 bg-linear-to-tr from-amber-500 via-pink-500 to-purple-600 rounded-full shadow-lg">
              <img
                src={REGISTER_STORY_ASSETS.storyAvatar}
                alt="Creator Profile"
                className="w-9 h-9 rounded-full border-2 border-black object-cover"
              />
            </div>
          </div>
        </div>

        {/* 
          ====================================================================
          🔐 RIGHT COLUMN / REGISTRATION FORM CONTAINER
          - Matches exact styling, input aesthetics, and spacing of Login page
          ====================================================================
        */}
        <div className="flex flex-col items-center justify-center p-6 sm:p-10 lg:p-14 bg-[#0a0a0c] lg:bg-[#121214]/50 relative">
          {/* 
            ------------------------------------------------------------------
            📱 MOBILE-ONLY BRAND HEADER & STORY CARD PREVIEW
            ------------------------------------------------------------------
          */}
          <div className="lg:hidden flex flex-col items-center text-center w-full max-w-sm mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
              Instagram
            </h1>

            <div className="mb-3">
              <h2 className="text-xl font-bold text-white">
                Share what you love with your
              </h2>
              <div className="text-xl font-bold">
                <span className="text-[#ff7849]">creative </span>
                <span className="text-[#e1306c]">community</span>
                <span className="text-white">.</span>
              </div>
            </div>

            {/* Mobile Story Preview Card */}
            <div className="relative w-40 h-56 rounded-3xl overflow-hidden shadow-2xl border border-white/20 my-2">
              <img
                src={REGISTER_STORY_ASSETS.centerStory}
                alt="Community Mobile Story"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 bg-white text-black px-2 py-0.5 rounded-full text-[9px] font-bold shadow">
                🔥✨📸
              </div>
              <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1">
                <div className="flex-1 h-5 rounded-full border border-white/80 bg-black/40 backdrop-blur-md px-2 flex items-center">
                  <span className="text-[8px] text-white/80">
                    Send message...
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 
            ------------------------------------------------------------------
            📝 REGISTER FORM CONTAINER
            ------------------------------------------------------------------
          */}
          <div className="w-full max-w-[380px] sm:max-w-[420px]">
            {/* Header matching Login page styling */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Create a new account
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1.5 font-normal">
                Sign up to share photos and videos with your friends.
              </p>
            </div>

            {/* ==============================================================
                🎯 REACT HOOK FORM (Aapka original FormSubmit mapped hai)
               ============================================================== */}
            <form onSubmit={handleSubmit(FormSubmit)} className="space-y-3">
              {/* 1. MOBILE NUMBER OR EMAIL INPUT */}
              <div className="space-y-1">
                <input
                  {...register("email", {
                    required: "Mobile number or email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Please enter a valid email address",
                    },
                  })}
                  type="email"
                  id="email"
                  autoComplete="email"
                  placeholder="your email"
                  className={`w-full bg-[#18181b] hover:bg-[#202024] focus:bg-[#222226] border text-white text-sm rounded-xl px-4 py-3 placeholder:text-zinc-500 focus:outline-none transition-all duration-200 ${
                    errors.email
                      ? "border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-red-400 font-medium px-1 pt-0.5 animate-fadeIn">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* 2. FULL NAME INPUT */}
              {/* <div className="space-y-1">
                <input
                  {...register("fullName")}
                  type="text"
                  id="fullName"
                  autoComplete="name"
                  placeholder="Full name"
                  className="w-full bg-[#18181b] hover:bg-[#202024] focus:bg-[#222226] border border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white text-sm rounded-xl px-4 py-3 placeholder:text-zinc-500 focus:outline-none transition-all duration-200"
                />
              </div> */}

              {/* 3. USERNAME INPUT (MAPPED TO ORIGINAL "username" FIELD) */}
              <div className="space-y-1">
                <input
                  {...register("username", {
                    required: "Username is required",
                    minLength: {
                      value: 3,
                      message: "Username must be at least 3 characters",
                    },
                  })}
                  type="text"
                  id="username"
                  autoComplete="username"
                  placeholder="Username"
                  className={`w-full bg-[#18181b] hover:bg-[#202024] focus:bg-[#222226] border text-white text-sm rounded-xl px-4 py-3 placeholder:text-zinc-500 focus:outline-none transition-all duration-200 ${
                    errors.username
                      ? "border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  }`}
                />
                {errors.username && (
                  <p className="text-xs text-red-400 font-medium px-1 pt-0.5 animate-fadeIn">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* 4. PASSWORD INPUT WITH SHOW/HIDE TOGGLE */}
              <div className="space-y-1">
                <div className="relative">
                  <input
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    type={showPassword ? "text" : "password"}
                    id="password"
                    autoComplete="new-password"
                    placeholder="Password"
                    className={`w-full bg-[#18181b] hover:bg-[#202024] focus:bg-[#222226] border text-white text-sm rounded-xl px-4 py-3 pr-12 placeholder:text-zinc-500 focus:outline-none transition-all duration-200 ${
                      errors.password
                        ? "border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        : "border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    }`}
                  />
                  {/* Show/Hide Button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-xs font-semibold focus:outline-none p-1 transition-colors"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-400 font-medium px-1 pt-0.5 animate-fadeIn">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* 5. BIRTHDAY SELECTION ROW */}
              <div className="pt-1 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label
                    htmlFor="birthMonth"
                    className="font-semibold text-zinc-300"
                  >
                    Birthday
                  </label>
                  <span className="text-[11px] text-zinc-500">
                    You must be at least 13 years old
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {/* Month */}
                  <div className="relative">
                    <select
                      id="birthMonth"
                      {...register("birthMonth")}
                      defaultValue="Month"
                      className="w-full bg-[#18181b] hover:bg-[#202024] border border-zinc-800 text-white text-xs sm:text-sm rounded-xl px-3 py-2.5 appearance-none focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                    >
                      <option value="Month" disabled>
                        Month
                      </option>
                      {months.map((m, idx) => (
                        <option
                          key={idx}
                          value={m}
                          className="bg-[#18181b] text-white"
                        >
                          {m}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                      <svg
                        className="w-3.5 h-3.5 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>

                  {/* Day */}
                  <div className="relative">
                    <select
                      id="birthDay"
                      {...register("birthDay")}
                      defaultValue="Day"
                      className="w-full bg-[#18181b] hover:bg-[#202024] border border-zinc-800 text-white text-xs sm:text-sm rounded-xl px-3 py-2.5 appearance-none focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                    >
                      <option value="Day" disabled>
                        Day
                      </option>
                      {days.map((d) => (
                        <option
                          key={d}
                          value={d}
                          className="bg-[#18181b] text-white"
                        >
                          {d}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                      <svg
                        className="w-3.5 h-3.5 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>

                  {/* Year */}
                  <div className="relative">
                    <select
                      id="birthYear"
                      {...register("birthYear")}
                      defaultValue="Year"
                      className="w-full bg-[#18181b] hover:bg-[#202024] border border-zinc-800 text-white text-xs sm:text-sm rounded-xl px-3 py-2.5 appearance-none focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                    >
                      <option value="Year" disabled>
                        Year
                      </option>
                      {years.map((y) => (
                        <option
                          key={y}
                          value={y}
                          className="bg-[#18181b] text-white"
                        >
                          {y}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                      <svg
                        className="w-3.5 h-3.5 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* 6. TERMS DISCLAIMER */}
              <p className="text-[11px] text-zinc-400 text-center leading-relaxed pt-1">
                By signing up, you agree to our{" "}
                <a
                  href="#terms"
                  className="font-semibold text-zinc-200 hover:text-white transition-colors"
                >
                  Terms
                </a>
                ,{" "}
                <a
                  href="#privacy"
                  className="font-semibold text-zinc-200 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>{" "}
                and{" "}
                <a
                  href="#cookies"
                  className="font-semibold text-zinc-200 hover:text-white transition-colors"
                >
                  Cookies Policy
                </a>
                .
              </p>

              {/* 7. SUBMIT BUTTON ("Sign up") */}
              {/* Responsive: Mobile par iconic gradient, Desktop par bold Instagram blue / royal action */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#d62976] via-[#962fbf] to-[#4f5bd5] lg:bg-none lg:bg-[#0064e0] lg:hover:bg-[#0073ff] active:scale-[0.98] text-white font-semibold py-3 rounded-xl text-sm shadow-md transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Sign up"
                  )}
                </button>
              </div>
            </form>

            {/* 8. OR DIVIDER */}
            <div className="flex items-center gap-3 my-5">
              <div className="h-px flex-1 bg-zinc-800" />
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                OR
              </span>
              <div className="h-px flex-1 bg-zinc-800" />
            </div>

            {/* 9. LOG IN REDIRECT BUTTON */}
            <div>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="w-full bg-transparent hover:bg-zinc-900 active:scale-[0.98] border border-zinc-700/80 hover:border-zinc-500 text-white font-semibold py-3 rounded-xl text-sm transition-all duration-200"
              >
                Log into existing account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 
        ======================================================================
        🏢 FOOTER BRANDING ("Meta")
        ======================================================================
      */}
      <footer className="w-full py-5 text-center text-xs text-zinc-500 font-medium select-none">
        <span className="tracking-wide">Meta</span>
      </footer>
    </div>
  );
};

export default Register;
