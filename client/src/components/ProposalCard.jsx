import React from "react";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function ProposalCard({ proposal, featured = false }) {
  return (
    <div
      className={`rounded-2xl border transition-all duration-300 animate-slide-up
        ${featured
          ? "bg-card border-gold/40 shadow-lg shadow-gold/5"
          : "bg-card border-border hover:border-gold/30"
        }`}
    >
      {featured && (
        <div className="px-6 pt-4 pb-0">
          <span className="inline-block text-xs font-semibold tracking-widest text-gold uppercase font-body">
            ✦ Latest Proposal
          </span>
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="font-display text-xl text-offwhite font-semibold leading-tight">
              {proposal.venue_name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-gold text-xs">📍</span>
              <span className="text-muted text-sm font-body">{proposal.location}</span>
            </div>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-gold font-semibold text-sm font-body">{proposal.estimated_cost}</p>
            <p className="text-muted text-xs font-body mt-0.5">Estimated</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-4" />

        {/* Why it fits */}
        <p className="text-offwhite/80 text-sm font-body leading-relaxed">{proposal.why_it_fits}</p>

        {/* Query chip */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted font-body">Request:</span>
          <span className="text-xs bg-slate border border-border text-muted rounded-full px-3 py-1 font-body line-clamp-1">
            {proposal.user_query}
          </span>
        </div>

        {/* Timestamp */}
        {proposal.created_at && (
          <p className="text-xs text-muted/60 font-body mt-3">{formatDate(proposal.created_at)}</p>
        )}
      </div>
    </div>
  );
}
