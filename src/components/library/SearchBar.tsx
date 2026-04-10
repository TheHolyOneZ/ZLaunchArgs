import { Search, X } from "lucide-react";
import { useUiStore } from "../../stores/uiStore";
export function SearchBar() {
  const query = useUiStore((s) => s.searchQuery);
  const setQuery = useUiStore((s) => s.setSearchQuery);
  return (
    <div className="relative group">
      <Search
        size={12}
        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none group-focus-within:text-blue-500 transition-colors duration-150"
      />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search apps…"
        className="w-full pl-7 pr-6 py-1.5 text-xs rounded-lg text-zinc-300 placeholder-zinc-600 bg-zinc-800/50 border border-white/[0.06] focus:outline-none focus:border-blue-500/40 focus:bg-zinc-800 transition-all duration-150"
      />
      {query && (
        <button
          onClick={() => setQuery("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          <X size={11} />
        </button>
      )}
    </div>
  );
}
