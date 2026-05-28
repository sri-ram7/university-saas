
const StatusBadge = ({ status, size = "md" }) => {
  const config = {
    Pending:   { bg: "rgba(245,158,11,0.15)",  border: "rgba(245,158,11,0.5)",  text: "#fbbf24", glow: "0 0 10px rgba(245,158,11,0.25)",  dot: "#f59e0b" },
    Contacted: { bg: "rgba(99,102,241,0.15)",  border: "rgba(99,102,241,0.5)",  text: "#818cf8", glow: "0 0 10px rgba(99,102,241,0.25)",  dot: "#6366f1" },
    Admitted:  { bg: "rgba(16,185,129,0.15)",  border: "rgba(16,185,129,0.5)",  text: "#34d399", glow: "0 0 10px rgba(16,185,129,0.25)",  dot: "#10b981" },
    Rejected:  { bg: "rgba(239,68,68,0.15)",   border: "rgba(239,68,68,0.5)",   text: "#f87171", glow: "0 0 10px rgba(239,68,68,0.25)",   dot: "#ef4444" },
  };

  const c = config[status] || config.Pending;
  const pad = size === "sm" ? "3px 9px" : "5px 12px";
  const fs = size === "sm" ? 11 : 12;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: pad,
        borderRadius: 20,
        background: c.bg,
        border: `1px solid ${c.border}`,
        boxShadow: c.glow,
        color: c.text,
        fontSize: fs,
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        fontFamily: "'DM Sans', sans-serif",
        transition: "all 0.3s ease",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: c.dot,
          boxShadow: `0 0 6px ${c.dot}`,
          flexShrink: 0,
        }}
      />
      {status}
    </span>
  );
};

export default StatusBadge;
