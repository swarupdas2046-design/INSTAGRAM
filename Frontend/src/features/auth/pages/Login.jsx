import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/userAuth";

// ==========================================
// 📸 MOCK STORY CARDS DATA (CUSTOMIZABLE ASSETS)
// ==========================================
// Agar aapko apni local images use karni hain, toh aap yahan URLs change kar sakte hain.
const STORY_ASSETS = {
  // Center Card: Two smiling close friends sharing a candid moment
  centerStory:
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
  // Left Card: Aesthetic vibrant artistic portrait
  leftStory:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
  // Right Card: Playful friend with fun expression
  rightStory:
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80",
  // Story creator avatar on bottom right
  storyAvatar:
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
};

const Login = () => {
  // ==========================================
  // 🧭 1. HOOKS & ORIGINAL LOGIC (PRESERVED)
  // ==========================================
  // Route change karne ke liye hook (e.g. /register, /app)
  const navigate = useNavigate();

  // Custom Authentication hook - loading status aur userLogin function
  const { loading, userLogin } = useAuth();

  // Password hide/show toggle karne ke liye local UI state
  const [showPassword, setShowPassword] = useState(false);

  // React Hook Form initialization - realtime validation mode
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
  // Aapka original FormSubmit function: email aur password bhejta hai
  const FormSubmit = async (data) => {
    try {
      const { email, password } = data;

      // Backend API login request
      const response = await userLogin(email, password);

      console.log("response from Server:----->", response);
      if (!response) {
        // Agar response null/false hai toh register page par redirect
        return navigate("/register");
      }

      // Login success -> main application dashboard
      navigate("/app");
      reset();
    } catch (error) {
      console.log("Status:", error.response?.status);
      console.log("Message:", error.response?.data);
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
          Loading Instagram...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0a0a0c] text-white flex flex-col justify-between font-sans selection:bg-pink-500 selection:text-white">
      {/* 
        ======================================================================
        🖥️ MAIN CONTAINER (DESKTOP: SPLIT 2 COLUMNS, MOBILE: STACKED)
        ======================================================================
      */}
      <div className="flex-1 w-full grid grid-cols-1 lg:grid-cols-2">
        {/* 
          ====================================================================
          🎨 LEFT HERO SECTION (REAL INSTAGRAM STORIES WITH ACTUAL MODELS)
          - Design Reference: "See everyday moments from your close friends."
          - 3 Realistic overlapping story cards with photos and floating stickers
          ====================================================================
        */}
        <div className="hidden lg:flex flex-col items-center justify-center p-10 xl:p-14 bg-black border-r border-zinc-900/80 relative overflow-hidden select-none">
          {/* Subtle Ambient Glow Effect */}
          <div className="absolute w-[540px] h-[540px] bg-gradient-to-tr from-pink-600/10 via-purple-600/10 to-orange-500/10 rounded-full blur-[140px] pointer-events-none" />

          {/* 
            ------------------------------------------------------------------
            📝 HERO HEADLINE & TYPOGRAPHY (MATCHING USER SCREENSHOT EXACTLY)
            "See everyday moments from your"
            "close friends."
            ------------------------------------------------------------------
          */}
          <div className="text-center z-10 max-w-3xl mb-10">
            <h1 className="text-4xl xl:text-[46px] font-bold text-white tracking-tight leading-tight">
              See everyday moments from your{" "}
              <span className="text-[#ff7849]">close </span>
              <span className="text-[#e1306c]">friends</span>
              <span className="text-white">.</span>
            </h1>

            {/* "close friends." with custom dual-tone Instagram colors */}
            <div className="mt-2 text-4xl xl:text-[46px] font-bold tracking-tight"></div>
          </div>

          {/* 
            ==================================================================
            📱 3 REALISTIC INSTAGRAM STORY CARDS WITH ACTUAL MODEL PHOTOS
            ==================================================================
          */}
          <div className="relative w-[380px] h-[400px] flex items-center justify-center my-2 z-10">
            {/* 
              ----------------------------------------------------------------
              1. LEFT STORY CARD (Tilted Left, Artistic Story + 3D Heart Sticker)
              ----------------------------------------------------------------
            */}
            <div className="absolute w-44 h-72 rounded-[28px] overflow-hidden -rotate-12 -translate-x-20 translate-y-3 shadow-2xl border border-white/15 bg-zinc-900 transition-all duration-500 hover:-rotate-6 hover:scale-105 z-10">
              {/* Background Model Image */}
              <img
                src={STORY_ASSETS.leftStory}
                alt="Story Left"
                className="w-full h-full object-cover object-center filter brightness-95"
              />

              {/* Top Progress Bar */}
              <div className="absolute top-2.5 left-3 right-3 h-[2.5px] bg-white/40 rounded-full overflow-hidden">
                <div className="w-2/3 h-full bg-white rounded-full" />
              </div>

              {/* Bottom Story Reply Bar Overlay */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5">
                <div className="flex-1 h-7 rounded-full border border-white/60 bg-black/30 backdrop-blur-md px-2.5 flex items-center">
                  <span className="text-[9px] text-white/70">Send message</span>
                </div>
              </div>
            </div>

            {/* Floating 3D Gradient Heart Sticker on Left Card */}
            <div className="absolute -left-2 top-1/2 -translate-y-8 z-30 drop-shadow-[0_10px_20px_rgba(255,42,109,0.5)] transition-transform duration-300 hover:scale-125">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#ff5e62] to-[#ff2a6d] flex items-center justify-center p-2 rotate-[-10deg]">
                <svg
                  className="w-7 h-7 text-white fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
            </div>

            {/* 
              ----------------------------------------------------------------
              2. CENTER STORY CARD (Foreground Hero, Two Friends Laughing)
              ----------------------------------------------------------------
            */}
            <div className="absolute w-48 h-80 rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/20 bg-zinc-900 z-20 transition-all duration-500 hover:scale-105">
              {/* Background Model Image (Two Smiling Friends) */}
              <img
                src={STORY_ASSETS.centerStory}
                alt="Close Friends Story"
                className="w-full h-full object-cover object-center"
              />

              {/* Gradient Vignette at Bottom for UI Clarity */}
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

              {/* Top Progress Bar */}
              <div className="absolute top-3 left-4 right-4 h-[2.5px] bg-white/40 rounded-full overflow-hidden">
                <div className="w-full h-full bg-white rounded-full" />
              </div>

              {/* Floating Emoji Reaction Bubble (🔮👀🤯) */}
              <div className="absolute top-4 left-3 bg-white text-black px-2 py-1 rounded-full shadow-lg flex items-center gap-0.5 text-xs font-semibold animate-bounce duration-1000">
                <span>🔮</span>
                <span>👀</span>
                <span>🤯</span>
              </div>

              {/* Bottom Story Reply Bar & Heart Like Button */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
                {/* Rounded Pill Bar */}
                <div className="flex-1 h-8 rounded-full border-2 border-white/80 bg-black/20 backdrop-blur-md px-3 flex items-center">
                  <span className="text-[10px] text-white/80 font-medium">
                    Send message...
                  </span>
                </div>
                {/* Story Heart Like Icon */}
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
              3. RIGHT STORY CARD (Tilted Right, Playful Friend + Close Friends Tag)
              ----------------------------------------------------------------
            */}
            <div className="absolute w-44 h-72 rounded-[28px] overflow-hidden rotate-12 translate-x-20 translate-y-4 shadow-2xl border border-white/15 bg-zinc-900 transition-all duration-500 hover:rotate-6 hover:scale-105 z-10">
              {/* Background Model Image */}
              <img
                src={STORY_ASSETS.rightStory}
                alt="Story Right"
                className="w-full h-full object-cover object-center filter brightness-95"
              />

              {/* Top Progress Bar */}
              <div className="absolute top-2.5 left-3 right-3 h-[2.5px] bg-white/40 rounded-full overflow-hidden">
                <div className="w-1/2 h-full bg-white rounded-full" />
              </div>

              {/* Close Friends Green Badge (Top Right) */}
              <div className="absolute top-3 right-3 bg-[#00c950] text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                <span>★</span>
                <span>✓</span>
              </div>

              {/* Bottom Story Reply Bar & Story Avatar Ring */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5">
                <div className="flex-1 h-7 rounded-full border border-white/60 bg-black/30 backdrop-blur-md px-2 flex items-center">
                  <span className="text-[9px] text-white/70">Reply</span>
                </div>
                {/* Heart Button */}
                <svg
                  className="w-4 h-4 text-white fill-none stroke-current stroke-2"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
            </div>

            {/* Story Avatar Ring (Instagram Rainbow Gradient Ring on bottom-right) */}
            <div className="absolute right-0 bottom-6 z-30 p-0.5 bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 rounded-full shadow-lg">
              <img
                src={STORY_ASSETS.storyAvatar}
                alt="User Avatar"
                className="w-9 h-9 rounded-full border-2 border-black object-cover"
              />
            </div>
          </div>
        </div>

        {/* 
          ====================================================================
          🔐 RIGHT COLUMN / AUTHENTICATION FORM
          - Desktop: Elegant right panel with "Log into Instagram"
          - Mobile: Top Instagram brand logo + story card preview + form
          ====================================================================
        */}
        <div className="flex flex-col items-center justify-center p-6 sm:p-10 lg:p-16 bg-[#0a0a0c] lg:bg-[#121214]/50 relative">
          {/* 
            ------------------------------------------------------------------
            📱 MOBILE-ONLY REAL STORY PREVIEW & BRAND TITLE
            ------------------------------------------------------------------
          */}
          <div className="lg:hidden flex flex-col items-center text-center w-full max-w-sm mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
              Instagram
            </h1>

            <div className="mb-4">
              <h2 className="text-xl font-bold text-white">
                See everyday moments from your
              </h2>
              <div className="text-xl font-bold">
                <span className="text-[#ff7849]">close </span>
                <span className="text-[#e1306c]">friends</span>
                <span className="text-white">.</span>
              </div>
            </div>

            {/* Compact Real Model Card for Mobile */}
            <div className="relative w-44 h-64 rounded-3xl overflow-hidden shadow-2xl border border-white/20 my-2">
              <img
                src={STORY_ASSETS.centerStory}
                alt="Friends Mobile Story"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 bg-white text-black px-2 py-0.5 rounded-full text-[10px] font-bold shadow">
                🔮👀🤯
              </div>
              <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1.5">
                <div className="flex-1 h-6 rounded-full border border-white/80 bg-black/40 backdrop-blur-md px-2 flex items-center">
                  <span className="text-[8px] text-white/80">
                    Send message...
                  </span>
                </div>
                <svg
                  className="w-4 h-4 text-white fill-none stroke-current stroke-2"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
            </div>
          </div>

          {/* 
            ------------------------------------------------------------------
            📝 LOGIN FORM CONTAINER
            - Desktop: "Log into Instagram"
            ------------------------------------------------------------------
          */}
          <div className="w-full max-w-[380px] sm:max-w-[400px]">
            {/* Desktop-only Title */}
            <div className="hidden lg:block mb-8">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Log into Instagram
              </h2>
            </div>

            {/* ==============================================================
                🎯 REACT HOOK FORM (Aapka original FormSubmit mapped hai)
               ============================================================== */}
            <form onSubmit={handleSubmit(FormSubmit)} className="space-y-3.5">
              {/* 1. EMAIL / USERNAME INPUT FIELD */}
              <div className="space-y-1">
                <div className="relative">
                  <input
                    {...register("email", {
                      required: "Mobile number, username or email is required",
                    })}
                    type="text"
                    id="email"
                    autoComplete="username"
                    placeholder="Mobile number, username or email"
                    className={`w-full bg-[#18181b] hover:bg-[#202024] focus:bg-[#222226] border text-white text-sm rounded-xl px-4 py-3.5 placeholder:text-zinc-500 focus:outline-none transition-all duration-200 ${
                      errors.email
                        ? "border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        : "border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    }`}
                  />
                </div>
                {/* Error validation message */}
                {errors.email && (
                  <p className="text-xs text-red-400 font-medium px-1 pt-1 animate-fadeIn">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* 2. PASSWORD INPUT FIELD WITH SHOW/HIDE TOGGLE */}
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
                    autoComplete="current-password"
                    placeholder="Password"
                    className={`w-full bg-[#18181b] hover:bg-[#202024] focus:bg-[#222226] border text-white text-sm rounded-xl px-4 py-3.5 pr-12 placeholder:text-zinc-500 focus:outline-none transition-all duration-200 ${
                      errors.password
                        ? "border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        : "border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    }`}
                  />

                  {/* Password Visibility Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-xs font-semibold focus:outline-none p-1 transition-colors"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {/* Error validation message */}
                {errors.password && (
                  <p className="text-xs text-red-400 font-medium px-1 pt-1 animate-fadeIn">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* 3. SUBMIT BUTTON ("Log in") */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#d62976] via-[#962fbf] to-[#4f5bd5] lg:bg-none lg:bg-[#0064e0] lg:hover:bg-[#0073ff] active:scale-[0.98] text-white font-semibold py-3 sm:py-3.5 rounded-xl text-sm shadow-md transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Log in"
                  )}
                </button>
              </div>
            </form>

            {/* 4. FORGOT PASSWORD LINK */}
            <div className="text-center mt-4">
              <a
                href="#forgot-password"
                className="text-xs sm:text-sm text-zinc-300 hover:text-white hover:underline transition-colors font-medium"
              >
                Forgot password?
              </a>
            </div>

            {/* 5. OR DIVIDER */}
            <div className="flex items-center gap-3 my-6 sm:my-7">
              <div className="h-px flex-1 bg-zinc-800" />
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                OR
              </span>
              <div className="h-px flex-1 bg-zinc-800" />
            </div>

            {/* 6. SOCIAL BUTTONS & NAVIGATION */}
            <div className="space-y-3">
              {/* Log in with Facebook Button */}
              <button
                type="button"
                className="w-full bg-[#18181b] hover:bg-[#222226] border border-zinc-800/80 active:scale-[0.98] text-white font-medium py-3 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2.5 shadow-sm"
              >
                <svg className="w-4 h-4 fill-[#1877f2]" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Log in with Facebook
              </button>

              {/* Create New Account Button (Redirects to Register Page) */}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="w-full bg-transparent hover:bg-zinc-900 active:scale-[0.98] border border-zinc-700/80 hover:border-zinc-500 text-[#0095f6] hover:text-blue-400 font-semibold py-3 rounded-xl text-sm transition-all duration-200"
              >
                Create new account
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

export default Login;
