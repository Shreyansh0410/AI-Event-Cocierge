import React, { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar.jsx";
import ProposalCard from "./components/ProposalCard.jsx";
import LoadingState from "./components/LoadingState.jsx";

const API_BASE = "http://localhost:8080";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [latest, setLatest] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(true);

  // Load history on mount
  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    try {
      setHistoryLoading(true);
      const res = await fetch(`${API_BASE}/api/history`);
      const data = await res.json();
      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setHistoryLoading(false);
    }
  }

  async function handleSearch(query) {
    setLoading(true);
    setError(null);
    setLatest(null);

    try {
      const res = await fetch(`${API_BASE}/api/suggest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setLatest(data);
      setHistory((prev) => [data, ...prev]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const pastHistory = latest ? history.slice(1) : history;

  return (
    <div className="min-h-screen bg-ink font-body">
      {/* Header */}
      <header className="border-b border-border/50">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-gold text-2xl">✦</span>
            <span className="font-display text-offwhite font-semibold text-lg tracking-tight">
              Event Concierge
            </span>
          </div>
          <span className="text-muted text-xs font-body hidden sm:block">
            AI-powered venue planning
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl sm:text-5xl text-offwhite font-bold leading-tight mb-4">
            Your next offsite,{" "}
            <span className="text-gold">perfectly planned.</span>
          </h1>
          <p className="text-muted text-base font-body max-w-xl mx-auto">
            Describe your event in plain English. Our AI will find the ideal venue
            and build a tailored proposal in seconds.
          </p>
        </div>

        {/* Search */}
        <SearchBar onSubmit={handleSearch} loading={loading} />

        {/* Error */}
        {error && (
          <div className="mt-6 max-w-2xl mx-auto bg-red-900/20 border border-red-700/40 rounded-xl px-5 py-4 text-red-300 text-sm font-body">
            ⚠ {error}
          </div>
        )}

        {/* Loading */}
        {loading && <LoadingState />}

        {/* Latest result */}
        {latest && !loading && (
          <div className="mt-8 max-w-2xl mx-auto">
            <ProposalCard proposal={latest} featured={true} />
          </div>
        )}

        {/* History */}
        <div className="mt-14">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="font-display text-xl text-offwhite font-semibold">Previous Searches</h2>
            {!historyLoading && (
              <span className="text-xs text-muted border border-border rounded-full px-2.5 py-0.5 font-body">
                {pastHistory.length}
              </span>
            )}
          </div>

          {historyLoading ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="shimmer-card h-48 rounded-2xl" />
              ))}
            </div>
          ) : pastHistory.length === 0 ? (
            <div className="border border-dashed border-border rounded-2xl p-10 text-center">
              <p className="text-muted font-body text-sm">No previous searches yet. Plan your first event above.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {pastHistory.map((item) => (
                <ProposalCard key={item.id} proposal={item} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-16">
        <div className="max-w-5xl mx-auto px-6 py-5 text-center text-muted text-xs font-body">
          Powered by Gemini AI · Built for FSI Technical Assignment
        </div>
      </footer>
    </div>
  );
}
