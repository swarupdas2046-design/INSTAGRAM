import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { UsePost } from "../hooks/UsePost";

/**
 * ==============================================================================
 * 📸 CREATE POST COMPONENT - INSTAGRAM CLONE (CLEAN & MINIMAL EDITION)
 * ==============================================================================
 * 📌 WHAT HAS BEEN CLEANED:
 * 1. Removed unnecessary fields: 'Add alt text' aur 'Location' inputs hata diye gaye.
 * 2. Only Core Fields Retained:
 *    - Left Panel: Media Upload & Dynamic Carousel Preview (Max 5 images).
 *    - Right Panel: Filter Presets, Caption Textarea (with 0/2,200 character counter).
 * 3. 4-Layer Architecture Integration:
 *    - FormData creation shifted to `postApi.js`.
 *    - State & API execution managed via `UsePost` custom hook (`handlePost`, `loading`).
 *    - Clean file extraction: `selectedImages.map(item => item.file)` passed directly.
 * 4. Detailed Hindi + English comments for effortless maintenance.
 * ==============================================================================
 */

const CreatePost = () => {
  const navigate = useNavigate();

  // 🧭 Custom Hook: loading state aur handlePost API function extract kiya
  const { loading, handlePost } = UsePost();

  // ============================================================================
  // 🧭 1. LOCAL UI STATE MANAGEMENT
  // ============================================================================

  // 1. Selected images array: Har item contains { file, previewUrl, id }
  const [selectedImages, setSelectedImages] = useState([]);

  // 2. Active image index for carousel preview
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);

  // 3. Filter styling preset (Warm, Cool, Emerald, Normal)
  const [selectedFilter, setSelectedFilter] = useState("normal");

  // 4. Drag and drop hover state
  const [isDragging, setIsDragging] = useState(false);

  // ============================================================================
  // 📋 2. REACT HOOK FORM INITIALIZATION
  // ============================================================================
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      caption: "",
    },
  });

  // Live caption character counter (max: 2,200 characters)
  const captionValue = watch("caption") || "";
  const MAX_CAPTION_LENGTH = 2200;

  // ============================================================================
  // 🖼️ 3. IMAGE SELECTION & VALIDATION ENGINE (MAX 5 IMAGES)
  // ============================================================================
  const handleFiles = (incomingFiles) => {
    clearErrors("images");
    const filesArray = Array.from(incomingFiles).filter((file) =>
      file.type.startsWith("image/"),
    );

    if (filesArray.length === 0) {
      setError("images", { message: "Please select valid image files." });
      return;
    }

    // Strict Rule: Total images cannot exceed 5
    if (selectedImages.length + filesArray.length > 5) {
      setError("images", {
        message: "Maximum 5 images allowed. Extra files were ignored.",
      });
    }

    // Max 5 images limit
    const remainingSlots = 5 - selectedImages.length;
    const allowedFiles = filesArray.slice(0, remainingSlots);

    const newMediaItems = allowedFiles.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      id: `${file.name}-${Date.now()}-${Math.random()}`,
    }));

    setSelectedImages((prev) => [...prev, ...newMediaItems]);
  };

  // Input file change
  const handleFileInputChange = (e) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  // Drag & drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Remove specific image
  const handleRemoveImage = (indexToRemove, e) => {
    e.stopPropagation();
    setSelectedImages((prev) => {
      const updated = prev.filter((_, idx) => idx !== indexToRemove);
      if (activePreviewIndex >= updated.length) {
        setActivePreviewIndex(Math.max(0, updated.length - 1));
      }
      return updated;
    });
  };

  // Carousel navigation
  const handlePrevSlide = (e) => {
    e.stopPropagation();
    setActivePreviewIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextSlide = (e) => {
    e.stopPropagation();
    setActivePreviewIndex((prev) =>
      prev < selectedImages.length - 1 ? prev + 1 : prev,
    );
  };

  // ============================================================================
  // ⚡ 4. FORM SUBMISSION (CALLS HOOK'S handlePost)
  // ============================================================================
  const onFormSubmit = async (formData) => {
    // 1. Validation check: At least 1 image is required
    if (selectedImages.length === 0) {
      setError("images", {
        message: "Please select at least 1 photo to share.",
      });
      return;
    }

    try {
      // 2. Pure File objects extract karna (FormData api layer mein banega)
      const rawImageFiles = selectedImages.map((item) => item.file);

      // 3. Hooks layer function call
      const response = await handlePost(rawImageFiles, formData.caption);

      if (response) {
        // Success hone par state reset aur feed/app par redirect
        reset();
        setSelectedImages([]);
        setActivePreviewIndex(0);
        navigate("/app");
      }
    } catch (error) {
      console.error("Post creation error in component:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black sm:p-4 flex items-center justify-center font-sans text-white select-none">
      {/* 
        ======================================================================
        🎴 MAIN MODAL CONTAINER (DUAL-PANE RECTANGULAR DASHBOARD)
        ======================================================================
      */}
      <div className="w-full max-w-4xl bg-[#000000] border border-zinc-800/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col relative">
        {/* 
          --------------------------------------------------------------------
          🏷️ MODAL HEADER (Title, Steps, Close Button)
          --------------------------------------------------------------------
        */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-[#16161d]">
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Create new post
          </h2>

          {/* Breadcrumb Steps */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs">
            <span className="font-semibold text-white">1 Select media</span>
            <span className="text-zinc-500">/</span>
            <span className="text-zinc-500 font-medium">2 Edit</span>
            <span className="text-zinc-500">/</span>
            <span className="text-zinc-500 font-medium">3 Share</span>
          </div>

          {/* Close Modal (✕) */}
          <button
            onClick={() => navigate(-1)}
            type="button"
            aria-label="Close"
            className="text-zinc-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <svg
              className="w-5 h-5 stroke-current stroke-2 fill-none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 
          ====================================================================
          🔲 MODAL BODY: DUAL PANE (Left: Media / Right: Caption)
          ====================================================================
        */}
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="flex-1 flex flex-col md:grid md:grid-cols-2"
        >
          {/* 
            ------------------------------------------------------------------
            🖼️ LEFT PANE: MEDIA DROPZONE & CAROUSEL PREVIEW
            ------------------------------------------------------------------
          */}
          <div className="p-4 sm:p-6 border-b md:border-b-0 md:border-r border-zinc-800/80 flex flex-col items-center justify-center">
            {selectedImages.length === 0 ? (
              /* State 1: Dropzone (No images selected) */
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`w-full aspect-square rounded-2xl bg-[#171720] border-2 border-dashed transition-all flex flex-col items-center justify-center p-6 text-center ${
                  isDragging
                    ? "border-[#e1306c] bg-[#e1306c]/5"
                    : "border-zinc-800 hover:border-zinc-700"
                }`}
              >
                {/* Media Icon with Pink Glow */}
                <div className="w-14 h-14 rounded-2xl bg-[#1e1322] flex items-center justify-center mb-4 text-[#e1306c] shadow-lg shadow-pink-900/10">
                  <svg
                    className="w-7 h-7 stroke-current stroke-2 fill-none"
                    viewBox="0 0 24 24"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="3" ry="3" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                    <line
                      x1="12"
                      y1="9"
                      x2="12"
                      y2="15"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <line
                      x1="9"
                      y1="12"
                      x2="15"
                      y2="12"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <h3 className="text-base font-bold text-white mb-1">
                  Drag photos and videos here
                </h3>
                <p className="text-xs text-zinc-400 mb-5">
                  You can upload up to 5 items
                </p>

                <input
                  type="file"
                  id="media-file-input"
                  multiple
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                <label
                  htmlFor="media-file-input"
                  className="border border-[#e1306c]/60 hover:border-[#e1306c] text-white hover:bg-[#e1306c]/10 text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl cursor-pointer transition-all active:scale-95 shadow-sm"
                >
                  Select from computer
                </label>
              </div>
            ) : (
              /* State 2: Carousel Preview (Images loaded) */
              <div className="w-full flex flex-col gap-3">
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-black border border-zinc-800 shadow-xl group">
                  {/* Current Active Preview Image with selected filter */}
                  <img
                    src={selectedImages[activePreviewIndex]?.previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover transition-all duration-300"
                    style={{
                      filter:
                        selectedFilter === "warm"
                          ? "sepia(0.3) saturate(1.4)"
                          : selectedFilter === "cool"
                            ? "hue-rotate(180deg) saturate(1.1)"
                            : selectedFilter === "emerald"
                              ? "hue-rotate(90deg) contrast(1.1)"
                              : "none",
                    }}
                  />

                  {/* Counter Badge (e.g. 1/3) */}
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
                    {activePreviewIndex + 1} / {selectedImages.length}
                  </div>

                  {/* Delete Current Image Button */}
                  <button
                    type="button"
                    onClick={(e) => handleRemoveImage(activePreviewIndex, e)}
                    aria-label="Remove image"
                    className="absolute top-3 right-3 bg-red-600/80 hover:bg-red-600 text-white w-7 h-7 rounded-full flex items-center justify-center transition-transform active:scale-90 shadow-md"
                  >
                    <svg
                      className="w-4 h-4 stroke-current stroke-2"
                      viewBox="0 0 24 24"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>

                  {/* Carousel Previous Arrow */}
                  {selectedImages.length > 1 && activePreviewIndex > 0 && (
                    <button
                      type="button"
                      onClick={handlePrevSlide}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-black flex items-center justify-center shadow-lg transition-transform active:scale-90"
                    >
                      <svg
                        className="w-4 h-4 stroke-current stroke-2 fill-none"
                        viewBox="0 0 24 24"
                      >
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </button>
                  )}

                  {/* Carousel Next Arrow */}
                  {selectedImages.length > 1 &&
                    activePreviewIndex < selectedImages.length - 1 && (
                      <button
                        type="button"
                        onClick={handleNextSlide}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-black flex items-center justify-center shadow-lg transition-transform active:scale-90"
                      >
                        <svg
                          className="w-4 h-4 stroke-current stroke-2 fill-none"
                          viewBox="0 0 24 24"
                        >
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </button>
                    )}

                  {/* Indicator Dots */}
                  {selectedImages.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/50 px-2 py-1 rounded-full backdrop-blur-sm">
                      {selectedImages.map((_, dotIdx) => (
                        <button
                          key={dotIdx}
                          type="button"
                          onClick={() => setActivePreviewIndex(dotIdx)}
                          className={`rounded-full transition-all ${
                            activePreviewIndex === dotIdx
                              ? "w-2 h-2 bg-[#0095f6] scale-110"
                              : "w-1.5 h-1.5 bg-zinc-500"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Add More Photos button if under 5 items */}
                {selectedImages.length < 5 && (
                  <div className="flex justify-end">
                    <label
                      htmlFor="media-file-input"
                      className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer font-semibold"
                    >
                      + Add more photos ({5 - selectedImages.length} remaining)
                    </label>
                  </div>
                )}
              </div>
            )}

            {/* Error Message */}
            {errors.images && (
              <p className="text-xs text-red-400 font-medium mt-2 animate-fadeIn">
                {errors.images.message}
              </p>
            )}
          </div>

          {/* 
            ------------------------------------------------------------------
            📝 RIGHT PANE: FILTERS & CAPTION ONLY (CLEANED)
            ------------------------------------------------------------------
          */}
          <div className="p-4 sm:p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-5">
              {/* Filter Swatches from Screenshot */}
              <div>
                <span className="text-xs font-semibold text-zinc-400 block mb-2.5">
                  Filters & Styling
                </span>
                <div className="flex items-center gap-3">
                  {/* Warm Sunset Preset */}
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedFilter(
                        selectedFilter === "warm" ? "normal" : "warm",
                      )
                    }
                    className={`w-12 h-12 rounded-xl bg-gradient-to-tr from-[#ff5e62] to-[#ff9966] transition-transform ${
                      selectedFilter === "warm"
                        ? "ring-2 ring-white scale-105"
                        : "hover:opacity-90"
                    }`}
                  />
                  {/* Cool Twilight Preset */}
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedFilter(
                        selectedFilter === "cool" ? "normal" : "cool",
                      )
                    }
                    className={`w-12 h-12 rounded-xl bg-gradient-to-tr from-[#4facfe] to-[#00f2fe] transition-transform ${
                      selectedFilter === "cool"
                        ? "ring-2 ring-white scale-105"
                        : "hover:opacity-90"
                    }`}
                  />
                  {/* Emerald Mood Preset */}
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedFilter(
                        selectedFilter === "emerald" ? "normal" : "emerald",
                      )
                    }
                    className={`w-12 h-12 rounded-xl bg-gradient-to-tr from-[#11998e] to-[#38ef7d] transition-transform ${
                      selectedFilter === "emerald"
                        ? "ring-2 ring-white scale-105"
                        : "hover:opacity-90"
                    }`}
                  />
                </div>
              </div>

              {/* Post Details Section */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Post details
                </h3>

                {/* Caption Textarea with 0/2,200 Character Counter */}
                <div className="relative">
                  <textarea
                    {...register("caption", {
                      maxLength: {
                        value: MAX_CAPTION_LENGTH,
                        message: `Caption cannot exceed ${MAX_CAPTION_LENGTH} characters`,
                      },
                    })}
                    rows={6}
                    placeholder="Write a caption..."
                    className="w-full bg-[#101015] border border-zinc-800 hover:border-zinc-700 focus:border-zinc-600 text-white text-sm rounded-xl p-3.5 pb-8 placeholder:text-zinc-600 focus:outline-none transition-colors resize-none"
                  />

                  {/* Character Counter */}
                  <div className="absolute bottom-3 right-3 text-[11px] font-medium text-zinc-500 select-none">
                    {captionValue.length}/{MAX_CAPTION_LENGTH.toLocaleString()}
                  </div>
                </div>

                {/* Caption Error Message */}
                {errors.caption && (
                  <p className="text-xs text-red-400 font-medium pt-1">
                    {errors.caption.message}
                  </p>
                )}
              </div>
            </div>

            {/* 
              ------------------------------------------------------------------
              🚀 SUBMIT ACTION BUTTON ("Share")
              - Uses loading state from UsePost hook
              ------------------------------------------------------------------
            */}
            <div className="flex items-center justify-end pt-4 border-t border-zinc-800/80">
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-[#d62976] via-[#e1306c] to-[#fd5949] hover:opacity-95 active:scale-95 text-white font-bold text-xs sm:text-sm px-7 py-2.5 rounded-xl shadow-lg shadow-pink-900/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sharing...</span>
                  </>
                ) : (
                  "Share"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
