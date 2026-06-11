import React, { useState } from "react";

const EXAMPLES = [
  "10-person leadership retreat in the mountains, 3 days, $4k budget",
  "50-person product launch event in NYC, 1 day, $15k budget",
  "20-person team offsite at a beach resort, 2 days, $8k budget",
];

export default function SearchBar({ onSubmit, loading }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !loading) onSubmit(query.trim());
  };

  const fillExample = (example) => {
    setQuery(example);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Describe your event — team size, location preference, duration, budget..."
          rows={3}
          className="w-full bg-card border border-border rounded-xl px-5 py-4 pr-36
                     text-offwhite placeholder-muted font-body text-sm resize-none
                     focus:outline-none focus:border-gold transition-colors duration-200"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="absolute bottom-4 right-4 bg-gold hover:bg-gold-light disabled:opacity-40
                     disabled:cursor-not-allowed text-ink font-semibold text-sm px-5 py-2
                     rounded-lg transition-all duration-200 font-body"
        >
          {loading ? "Planning..." : "Plan Event →"}
        </button>
      </form>

      {/* Example prompts */}
      <div className="mt-3 flex flex-wrap gap-2">
        {EXAMPLES.map((ex, i) => (
          <button
            key={i}
            onClick={() => fillExample(ex)}
            className="text-xs text-muted border border-border rounded-full px-3 py-1
                       hover:text-gold hover:border-gold transition-colors duration-150 font-body"
          >
            {ex.length > 45 ? ex.slice(0, 45) + "…" : ex}
          </button>
        ))}
      </div>
    </div>
  );
}
