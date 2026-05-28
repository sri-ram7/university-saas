

import { useState } from "react";

const ErrorState = ({ message, onRetry }) => {
  const [spinning, setSpinning] = useState(false);

  const handleRetry = () => {
    setSpinning(true);
    onRetry();
    setTimeout(() => setSpinning(false), 1200);
  };

  return (
    <>
      <style>{`
        @keyframes errorPulse {
          0%,100% { box-shadow: 0 0 20px rgba(239,68,68,0.15); }
          50%      { box-shadow: 0 0 40px rgba(239,68,68,0.35); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

      <div
        role="alert"
        aria-live="assertive"
        style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          textAlign: "center", padding: "80px 32px",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(239,68,68,0.2)",
          borderRadius: 20, backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)", marginTop: 24,
        }}
      >
        {/* Icon */}
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: "rgba(239,68,68,0.12)",
          border: "1px solid rgba(239,68,68,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 24, animation: "errorPulse 2.5s ease-in-out infinite",
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
            stroke="#f87171" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <h3 style={{
          fontSize: 20, fontWeight: 700, color: "#f1f5f9",
          marginBottom: 10, fontFamily: "'DM Sans', sans-serif",
        }}>
          Something went wrong
        </h3>

        <p style={{
          fontSize: 14, color: "rgba(148,163,184,0.85)", maxWidth: 400,
          lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif", marginBottom: 28,
        }}>
          {message || "We couldn't load the enquiries. Check your connection or try again."}
        </p>

        <button
          onClick={handleRetry}
          aria-label="Retry loading data"
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "10px 24px",
            background: "rgba(239,68,68,0.15)",
            border: "1px solid rgba(239,68,68,0.35)",
            borderRadius: 10, color: "#f87171", fontSize: 14,
            fontWeight: 600, cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239,68,68,0.25)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(239,68,68,0.15)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5"
            style={spinning ? { animation: "spin 0.8s linear infinite" } : {}}>
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 .49-3" />
          </svg>
          Try Again
        </button>
      </div>
    </>
  );
};

export default ErrorState;