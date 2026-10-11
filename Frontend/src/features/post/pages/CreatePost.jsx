import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

/**
 * ==============================================================================
 * 📸 CREATE POST COMPONENT - INSTAGRAM CLONE (PREMIUM MODAL DASHBOARD)
 * ==============================================================================
 * 📌 FEATURES & FUNCTIONALITY:
 * 1. Exact UI Match: Dual-pane Desktop Dashboard & Fluid Mobile Layout.
 * 2. Media Upload & Preview Engine:
 *    - Drag & drop + file picker support for images.
 *    - Strict validation: MAXIMUM 5 images allowed.
 *    - Dynamic carousel preview with smooth slide transitions & navigation dots.
 *    - Ability to delete / remove specific images from the selection.
 * 3. Form Management (React Hook Form):
 *    - Realtime character counter (current / 2,200 max limit).
 *    - Location input, Alt text accessibility toggle, and filter presets.
 *    - Form submission function (`handleCreatePost`) ready for API integration with FormData.
 * 4. Detailed Hindi + English documentation for every architectural block.
 * ==============================================================================
 */

const CreatePost = () => {

    const navigate = useNavigate();
  // ============================================================================
  // 🧭 1. STATE MANAGEMENT
  // ============================================================================

  // 1. Selected images array: Har item contains { file, previewUrl, id }
  const [selectedImages, setSelectedImages] = useState([]);

  // 2. Active image index for carousel preview when multiple images exist
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);

  // 3. Loading / Submitting state for API call
  const [loading, setLoading] = useState(false);

  // 4. Accessibility Alt Text toggle state
  const [showAltText, setShowAltText] = useState(false);

  // 5. Active image filter preset (optional styling from design reference)
  const [selectedFilter, setSelectedFilter] = useState("normal");

  // 6. Drag-and-drop hover state
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
      location: "",
      altText: "",
    },
  });

  // Caption input value ko watch karte hain taaki live character counter calculate ho sake
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
        message: "Maximum 5 images allowed. Excess files were ignored.",
      });
    }

    // First available slots up to 5
    const remainingSlots = 5 - selectedImages.length;
    const allowedFiles = filesArray.slice(0, remainingSlots);

    const newMediaItems = allowedFiles.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      id: `${file.name}-${Date.now()}-${Math.random()}`,
    }));

    setSelectedImages((prev) => [...prev, ...newMediaItems]);
  };

  // File Input Change Handler
  const handleFileInputChange = (e) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  // Drag and Drop Handlers
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

  // Specific Image Remove Handler
  const handleRemoveImage = (indexToRemove, e) => {
    e.stopPropagation();
    setSelectedImages((prev) => {
      const updated = prev.filter((_, idx) => idx !== indexToRemove);
      // Active index ko adjust karte hain agar last item remove hua ho
      if (activePreviewIndex >= updated.length) {
        setActivePreviewIndex(Math.max(0, updated.length - 1));
      }
      return updated;
    });
  };

  // Carousel slide change
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
  // ⚡ 4. API SUBMIT FUNCTION (`handleCreatePost`)
  // ============================================================================
  const handleCreatePost = async (formData) => {
    // 1. Validation check: At least 1 image is required
    if (selectedImages.length === 0) {
      setError("images", {
        message: "Please select at least 1 photo to share.",
      });
      return;
    }

    setLoading(true);
    try {
      // 2. FormData payload ready karna multipart API upload ke liye
      const payload = new FormData();
      payload.append("caption", formData.caption);
      if (formData.location) payload.append("location", formData.location);
      if (formData.altText) payload.append("altText", formData.altText);

      // Sabhi selected images attach karna
      selectedImages.forEach((item) => {
        payload.append("images", item.file);
      });

      console.log("Sending Post to Server API:", {
        caption: formData.caption,
        location: formData.location,
        altText: formData.altText,
        totalImages: selectedImages.length,
      });

      // 3. Yahan aap apna backend API call karenge:
      // const response = await createPostApi(payload)
      // alert('Post uploaded successfully!')

      // Success hone par state reset:
      // reset()
      // setSelectedImages([])
      // setActivePreviewIndex(0)
    } catch (error) {
      console.error("Post upload failed:", error);
      setError("root", { message: "Failed to upload post. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black sm:p-4 flex items-center justify-center font-sans text-white">
      {/* 
        ======================================================================
        🎴 MAIN MODAL CONTAINER
        - Dual-pane layout on Desktop (`md:grid-cols-2` or `lg:grid-cols-[1.1fr_0.9fr]`)
        - Full-width seamless flow on Mobile
        ======================================================================
      */}
      <div className="w-full max-w-4xl bg-[#000000] border border-zinc-800/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col relative">
        {/* 
          --------------------------------------------------------------------
          🏷️ MODAL HEADER (Title, Steps, Close Button)
          --------------------------------------------------------------------
        */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-[#16161d]">
          {/* Title */}
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Create new post
          </h2>

          {/* Breadcrumb Steps Indicator (From Screenshot: 1 Select media / 2 Edit / 3 Share) */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs">
            <span className="font-semibold text-white">1 Select media</span>
            <span className="text-zinc-500">/</span>
            <span className="text-zinc-500 font-medium">2 Edit</span>
            <span className="text-zinc-500">/</span>
            <span className="text-zinc-500 font-medium">3 Share</span>
          </div>

          {/* Close Modal Button (✕) */}
          <button onClick={()=>{navigate(-1)}}
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
          🔲 MODAL BODY: DUAL-PANE GRID (Left: Media / Right: Form Details)
          ====================================================================
        */}
        <form
          onSubmit={handleSubmit(handleCreatePost)}
          className="flex-1 flex flex-col md:grid md:grid-cols-2"
        >
          {/* 
            ------------------------------------------------------------------
            🖼️ LEFT PANE: MEDIA DROPZONE & CAROUSEL PREVIEW
            ------------------------------------------------------------------
          */}
          <div className="p-4 sm:p-6 border-b md:border-b-0 md:border-r border-zinc-800/80 flex flex-col items-center justify-center">
            {selectedImages.length === 0 ? (
              /* ============================================================
                 1. UPLOAD DROPZONE (STATE: NO IMAGES SELECTED)
                 Matches exact design layout with pink media icon and button
                 ============================================================ */
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
                {/* Media Icon with Pink Outline (From Screenshot) */}
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

                {/* Hidden File Input Tag */}
                <input
                  type="file"
                  id="media-file-input"
                  multiple
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                {/* Styled 'Select from computer' Button */}
                <label
                  htmlFor="media-file-input"
                  className="border border-[#e1306c]/60 hover:border-[#e1306c] text-white hover:bg-[#e1306c]/10 text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl cursor-pointer transition-all active:scale-95 shadow-sm"
                >
                  Select from computer
                </label>
              </div>
            ) : (
              /* ============================================================
                 2. POST-SELECTION CAROUSEL PREVIEW (STATE: IMAGES LOADED)
                 Shows active image preview, slide arrows, delete, and dots
                 ============================================================ */
              <div className="w-full flex flex-col gap-3">
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-black border border-zinc-800 shadow-xl group">
                  {/* Active Preview Image */}
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

                  {/* Top Counter Badge (e.g. 1/3) */}
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

                  {/* Carousel Previous Slide Arrow */}
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

                  {/* Carousel Next Slide Arrow */}
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

                  {/* Dot Indicators */}
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

            {/* Validation Error Message */}
            {errors.images && (
              <p className="text-xs text-red-400 font-medium mt-2 animate-fadeIn">
                {errors.images.message}
              </p>
            )}
          </div>

          {/* 
            ------------------------------------------------------------------
            📝 RIGHT PANE: POST DETAILS PANEL (Caption, Location, Alt Text)
            ------------------------------------------------------------------
          */}
          <div className="p-4 sm:p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              {/* Filter Swatches from Screenshot */}
              <div>
                <span className="text-xs font-semibold text-zinc-400 block mb-2">
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
                  {/* Emerald Preset */}
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

              {/* Header Title */}
              <h3 className="text-sm font-bold text-white tracking-wide">
                Post details
              </h3>

              {/* 
                Accessibility Toggle ("Add alt text")
                Matches screenshot layout with toggle switch
              */}
              <div className="bg-[#171720] border border-zinc-800 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-white">
                    Add alt text
                  </h4>
                  <p className="text-[11px] text-zinc-500">
                    Describe your media for accessibility
                  </p>
                </div>

                {/* Toggle Switch */}
                <button
                  type="button"
                  onClick={() => setShowAltText(!showAltText)}
                  className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    showAltText ? "bg-[#e1306c]" : "bg-zinc-800"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      showAltText ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Alt text input field if enabled */}
              {showAltText && (
                <div className="animate-fadeIn">
                  <input
                    {...register("altText")}
                    type="text"
                    placeholder="Write alt text..."
                    className="w-full bg-[#101015] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
                  />
                </div>
              )}

              {/* 
                Caption Textarea with Dynamic Character Counter Overlay
                Max limit: 2,200 characters
              */}
              <div className="relative">
                <textarea
                  {...register("caption", {
                    maxLength: {
                      value: MAX_CAPTION_LENGTH,
                      message: `Caption cannot exceed ${MAX_CAPTION_LENGTH} characters`,
                    },
                  })}
                  rows={4}
                  placeholder="Write a caption..."
                  className="w-full bg-[#101015] border border-zinc-800 hover:border-zinc-700 focus:border-zinc-600 text-white text-sm rounded-xl p-3.5 pb-7 placeholder:text-zinc-600 focus:outline-none transition-colors resize-none"
                />

                {/* Dynamic Character Counter (e.g. 0/2,200) */}
                <div className="absolute bottom-2.5 right-3 text-[11px] font-medium text-zinc-500 select-none">
                  {captionValue.length}/{MAX_CAPTION_LENGTH.toLocaleString()}
                </div>
              </div>

              {/* Caption Error Message */}
              {errors.caption && (
                <p className="text-xs text-red-400 font-medium">
                  {errors.caption.message}
                </p>
              )}

              {/* Location Input Box */}
              <div>
                <input
                  {...register("location")}
                  type="text"
                  placeholder="Add location"
                  className="w-full bg-[#101015] border border-zinc-800 hover:border-zinc-700 focus:border-zinc-600 text-white text-sm rounded-xl px-3.5 py-2.5 placeholder:text-zinc-600 focus:outline-none transition-colors"
                />
              </div>

              {/* Accessibility Helper Subtext from Screenshot */}
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Adding alt text helps people with visual impairments understand
                your post.
              </p>
            </div>

            {/* 
              ------------------------------------------------------------------
              🚀 SUBMIT ACTION BUTTON ("Share")
              - Vibrant Instagram sunset gradient with glow
              ------------------------------------------------------------------
            */}
            <div className="flex items-center justify-end pt-4 border-t border-zinc-800/80">
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-[#d62976] via-[#e1306c] to-[#fd5949] hover:opacity-95 active:scale-95 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-lg shadow-pink-900/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
