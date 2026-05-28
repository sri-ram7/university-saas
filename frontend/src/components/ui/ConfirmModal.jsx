import { useEffect, useRef } from "react";

const ConfirmModal = ({
  isOpen,
  title = "Confirm Action",
  message = "This action cannot be undone.",
  onConfirm,
  onCancel,
  isLoading = false,
  confirmLabel = "Delete",
}) => {
  const confirmRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => confirmRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cm-title"
        aria-describedby="cm-msg"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onCancel();
          }
        }}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.65)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2000,
          padding: 24,
          animation: "fadeIn 0.18s ease",
        }}
      >
        <div
          style={{
            background: "rgba(20,18,40,0.9)",
            border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: 20,
            padding: 32,
            maxWidth: 420,
            width: "100%",
            boxShadow:
              "0 0 60px rgba(239,68,68,0.12), 0 24px 64px rgba(0,0,0,0.5)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            animation: "slideUp 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
              boxShadow: "0 0 24px rgba(239,68,68,0.2)",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#f87171"
              strokeWidth="2"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14H6L5 6" />
              <path d="M10 11v6M14 11v6M9 6V4h6v2" />
            </svg>
          </div>

          <h2
            id="cm-title"
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#f1f5f9",
              marginBottom: 8,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {title}
          </h2>

          <p
            id="cm-msg"
            style={{
              fontSize: 14,
              color: "rgba(148,163,184,0.85)",
              lineHeight: 1.7,
              fontFamily: "'DM Sans', sans-serif",
              marginBottom: 28,
            }}
          >
            {message}
          </p>

          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "flex-end",
            }}
          >
            <button
              onClick={onCancel}
              disabled={isLoading}
              style={{
                padding: "10px 20px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.05)",
                color: "rgba(148,163,184,0.9)",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                transition: "all 0.18s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "rgba(255,255,255,0.09)";
                e.currentTarget.style.color = "#f1f5f9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  "rgba(255,255,255,0.05)";
                e.currentTarget.style.color =
                  "rgba(148,163,184,0.9)";
              }}
            >
              Cancel
            </button>

            <button
              ref={confirmRef}
              onClick={onConfirm}
              disabled={isLoading}
              style={{
                padding: "10px 20px",
                borderRadius: 10,
                border: "1px solid rgba(239,68,68,0.4)",
                background: "rgba(239,68,68,0.15)",
                color: "#f87171",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.18s ease",
                opacity: isLoading ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.background =
                    "rgba(239,68,68,0.28)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  "rgba(239,68,68,0.15)";
              }}
            >
              {isLoading ? (
                <>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    style={{
                      animation: "spin 0.8s linear infinite",
                    }}
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      strokeOpacity="0.25"
                    />
                    <path d="M12 2a10 10 0 0 1 10 10" />
                  </svg>

                  Deleting…
                </>
              ) : (
                <>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14H6L5 6" />
                  </svg>

                  {confirmLabel}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmModal;