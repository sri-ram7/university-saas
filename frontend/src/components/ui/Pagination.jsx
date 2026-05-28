
function buildPages(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
  if (current >= total - 3) return [1, "...", total-4, total-3, total-2, total-1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
}


const PageChip = ({ active, disabled, onClick, ariaLabel, children }) => (
  <button
    onClick={!disabled ? onClick : undefined}
    disabled={disabled}
    aria-label={ariaLabel}
    aria-current={active ? "page" : undefined}
    style={{
      minWidth: 34, height: 34, display: "inline-flex",
      alignItems: "center", justifyContent: "center",
      borderRadius: 8, padding: "0 10px",
      border: active ? "1px solid rgba(99,102,241,0.6)" : "1px solid rgba(255,255,255,0.08)",
      background: active
        ? "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.2))"
        : "rgba(255,255,255,0.04)",
      color: active ? "#a78bfa" : "rgba(148,163,184,0.8)",
      fontSize: 13, fontWeight: active ? 700 : 400,
      cursor: disabled ? "not-allowed" : "pointer",
      fontFamily: "'DM Sans', sans-serif",
      opacity: disabled ? 0.4 : 1,
      boxShadow: active ? "0 0 12px rgba(99,102,241,0.3)" : "none",
      transition: "all 0.18s ease",
    }}
  >
    {children}
  </button>
);


const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.totalPages <= 1) return null;
  const { page, totalPages, total, limit } = pagination;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  const pages = buildPages(page, totalPages);

  return (
    <nav
      aria-label="Enquiry table pagination"
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.06)",
        flexWrap: "wrap", gap: 12,
      }}
    >
      <span style={{ fontSize: 13, color: "rgba(148,163,184,0.7)", fontFamily: "'DM Sans', sans-serif" }}>
        Showing <strong style={{ color: "#f1f5f9" }}>{from}–{to}</strong> of{" "}
        <strong style={{ color: "#f1f5f9" }}>{total}</strong> results
      </span>

      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {/* Prev */}
        <PageChip disabled={!pagination.hasPrevPage} onClick={() => onPageChange(page - 1)} ariaLabel="Previous page">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </PageChip>

        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`e-${i}`} style={{ color: "rgba(148,163,184,0.4)", fontSize: 13, padding: "0 4px" }}>…</span>
          ) : (
            <PageChip key={p} active={p === page} onClick={() => onPageChange(p)} ariaLabel={`Page ${p}`}>
              {p}
            </PageChip>
          )
        )}

        {/* Next */}
        <PageChip disabled={!pagination.hasNextPage} onClick={() => onPageChange(page + 1)} ariaLabel="Next page">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </PageChip>
      </div>
    </nav>
  );
};

export default Pagination;