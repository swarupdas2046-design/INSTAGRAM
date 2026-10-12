import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { searchUsersApi } from "../../auth/services/userApi";

// ==============================================================================
// 🔍 SEARCH PAGE
// Hinglish: Username ya name se users dhundhne ke liye debounce strategy use kar rahe hain
// taaki har keystroke par API call na ho - 400ms delay ke baad search hota hai.
// ==============================================================================
const Search = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    // Debounce: 400ms ke baad search hoga
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setSearched(false);
      try {
        const response = await searchUsersApi(query.trim());
        setResults(response.data || []);
      } catch (error) {
        console.log("Search error:", error.response?.data);
        setResults([]);
      } finally {
        setLoading(false);
        setSearched(true);
      }
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  return (
    <div className="min-h-screen bg-black text-white max-w-lg mx-auto px-4 pt-6 pb-20">
      <h1 className="text-lg font-bold mb-4">Search</h1>

      {/* Search Input */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <svg className="w-4 h-4 text-zinc-500 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a friend or creator..."
          className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-600 text-white text-sm rounded-full pl-11 pr-4 py-3 placeholder:text-zinc-500 focus:outline-none transition-colors"
          autoFocus
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setResults([]); setSearched(false); }}
            className="absolute inset-y-0 right-4 flex items-center text-zinc-500 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-pink-500/30 border-t-pink-500 rounded-full animate-spin" />
        </div>
      )}

      {/* Results */}
      {!loading && searched && results.length === 0 && (
        <div className="text-center py-12">
          <p className="text-zinc-500 text-sm">No results found for "{query}"</p>
          <p className="text-zinc-700 text-xs mt-1">Try searching with a different name</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-1">
          {results.map((user) => (
            <div
              key={user._id || user.username}
              onClick={() => navigate(`/app/profile/${user.username}`)}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-900 cursor-pointer transition-colors"
            >
              <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-zinc-800">
                <img
                  src={user.profileImage}
                  alt={user.username}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://ik.imagekit.io/swarup2046/USER_DEFAULT_IMG.avif?updatedAt=1784907094992";
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold truncate">{user.username}</p>
                <p className="text-zinc-500 text-xs truncate">
                  {user.name || user.bio || ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty initial state */}
      {!loading && !searched && !query && (
        <div className="text-center py-12 text-zinc-700">
          <svg className="w-12 h-12 mx-auto mb-3 stroke-current stroke-[1.5] fill-none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-sm">Search for people to connect with</p>
        </div>
      )}
    </div>
  );
};

export default Search;
