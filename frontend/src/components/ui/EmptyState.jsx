const EmptyState = ({ hasFilters, onAddNew }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 24px",
        textAlign: "center",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div style={{ position: "relative", marginBottom: 32 }}>
        <div
          style={{
            position: "absolute",
            inset: -20,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
            filter: "blur(16px)",
          }}
        />

        <svg
          viewBox="0 0 120 120"
          width="120"
          height="120"
          style={{ position: "relative", display: "block" }}
          aria-hidden="true"
        >
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="rgba(99,102,241,0.08)"
            stroke="rgba(99,102,241,0.15)"
            strokeWidth="1"
          />

          <rect
            x="38"
            y="30"
            width="44"
            height="56"
            rx="6"
            fill="rgba(99,102,241,0.15)"
            stroke="rgba(99,102,241,0.4)"
            strokeWidth="1.5"
          />

          <rect
            x="46"
            y="42"
            width="28"
            height="2.5"
            rx="1.25"
            fill="rgba(99,102,241,0.5)"
          />

          <rect
            x="46"
            y="50"
            width="22"
            height="2.5"
            rx="1.25"
            fill="rgba(99,102,241,0.35)"
          />

          <rect
            x="46"
            y="58"
            width="26"
            height="2.5"
            rx="1.25"
            fill="rgba(99,102,241,0.35)"
          />

          <rect
            x="46"
            y="66"
            width="16"
            height="2.5"
            rx="1.25"
            fill="rgba(99,102,241,0.25)"
          />

          {hasFilters ? (
            <g transform="translate(68, 68)">
              <circle
                cx="0"
                cy="0"
                r="14"
                fill="rgba(15,23,42,0.9)"
                stroke="rgba(99,102,241,0.4)"
                strokeWidth="1.5"
              />

              <circle
                cx="-2"
                cy="-2"
                r="5"
                fill="none"
                stroke="#818cf8"
                strokeWidth="1.8"
              />

              <line
                x1="2"
                y1="2"
                x2="6"
                y2="6"
                stroke="#818cf8"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </g>
          ) : (
            <g transform="translate(68, 68)">
              <circle
                cx="0"
                cy="0"
                r="14"
                fill="rgba(99,102,241,0.2)"
                stroke="rgba(99,102,241,0.5)"
                strokeWidth="1.5"
              />

              <line
                x1="-5"
                y1="0"
                x2="5"
                y2="0"
                stroke="#818cf8"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <line
                x1="0"
                y1="-5"
                x2="0"
                y2="5"
                stroke="#818cf8"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>
          )}
        </svg>
      </div>

      <h3
        style={{
          fontSize: 20,
          fontWeight: 800,
          fontFamily: "'Syne', sans-serif",
          background: "linear-gradient(135deg, #f1f5f9 0%, #818cf8 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          marginBottom: 10,
        }}
      >
        {hasFilters ? "No matching enquiries" : "No enquiries yet"}
      </h3>

      <p
        style={{
          fontSize: 14,
          color: "rgba(148,163,184,0.75)",
          maxWidth: 320,
          lineHeight: 1.6,
          marginBottom: 28,
        }}
      >
        {hasFilters
          ? "Try adjusting your search term, status, or department filter to find what you're looking for."
          : "Get started by submitting the first admission enquiry. It'll appear here once created."}
      </p>

      {!hasFilters && (
        <button
          onClick={onAddNew}
          aria-label="Add first enquiry"
          style={{
            padding: "12px 24px",
            borderRadius: 12,
            border: "none",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "#fff",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow:
              "0 0 24px rgba(99,102,241,0.4), 0 4px 12px rgba(99,102,241,0.3)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            transition: "all 0.25s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 0 36px rgba(99,102,241,0.55), 0 8px 20px rgba(99,102,241,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 0 24px rgba(99,102,241,0.4), 0 4px 12px rgba(99,102,241,0.3)";
          }}
        >
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            style={{ width: 16, height: 16 }}
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add First Enquiry
        </button>
      )}
    </div>
  );
};

export default EmptyState;