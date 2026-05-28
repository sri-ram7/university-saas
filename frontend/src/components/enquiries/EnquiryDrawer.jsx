import { useEffect, useRef } from "react";
import EnquiryForm from "./EnquiryForm";

const THEME = {
  bgBackdrop: "rgba(0, 0, 0, 0.8)",
  bgPanel: "rgba(10, 10, 10, 0.98)",
  bgHeader: "rgba(255, 255, 255, 0.03)",
  textPrimary: "#ffffff",
  textSecondary: "rgba(255, 255, 255, 0.5)",
  textMuted: "rgba(255, 255, 255, 0.3)",
  border: "rgba(255, 255, 255, 0.06)",
  borderHover: "rgba(255, 255, 255, 0.15)",
  buttonCloseBg: "rgba(255, 255, 255, 0.05)",
  buttonCloseHoverBg: "rgba(255, 255, 255, 0.1)",
  buttonCloseHoverBorder: "rgba(255, 255, 255, 0.2)",
};

const EnquiryDrawer = ({
  isOpen,
  onClose,
  enquiry,
  onSubmit,
  isSubmitting,
}) => {
  const drawerRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handler);

    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const first =
          drawerRef.current?.querySelector(
            "input, select, textarea"
          );

        first?.focus();
      }, 350);
    }
  }, [isOpen]);

  return (
    <>
      <style>{`
        @keyframes backdropIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes backdropOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        @keyframes drawerIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes drawerOut {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(100%);
          }
        }

        .drawer-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: ${THEME.bgBackdrop};
          backdrop-filter: blur(8px);
        }

        .drawer-panel {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: min(520px, 100vw);
          z-index: 1001;
          background: ${THEME.bgPanel};
          border-left: 1px solid ${THEME.border};
          backdrop-filter: blur(24px);
          box-shadow:
            -16px 0 48px rgba(0,0,0,0.8),
            -1px 0 0 rgba(255,255,255,0.04);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .drawer-backdrop.entering {
          animation: backdropIn 0.3s ease forwards;
        }

        .drawer-backdrop.exiting {
          animation: backdropOut 0.3s ease forwards;
        }

        .drawer-panel.entering {
          animation:
            drawerIn 0.35s cubic-bezier(0.22,1,0.36,1)
            forwards;
        }

        .drawer-panel.exiting {
          animation:
            drawerOut 0.3s cubic-bezier(0.55,0,1,0.45)
            forwards;
        }
      `}</style>

      {isOpen && (
        <div
          className="drawer-backdrop entering"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {isOpen && (
        <div
          ref={drawerRef}
          className="drawer-panel entering"
          role="dialog"
          aria-modal="true"
          aria-label={
            enquiry ? "Edit Enquiry" : "New Enquiry"
          }
        >
          <div
            style={{
              padding: "24px 28px 20px",
              borderBottom: `1px solid ${THEME.border}`,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: THEME.bgHeader,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: THEME.textSecondary,
                  fontFamily:
                    "'Inter', 'SF Pro Display', sans-serif",
                  marginBottom: 6,
                }}
              >
                {enquiry
                  ? "Edit Enquiry"
                  : "New Enquiry"}
              </div>

              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  fontFamily:
                    "'Inter', 'SF Pro Display', sans-serif",
                  color: THEME.textPrimary,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                }}
              >
                {enquiry
                  ? enquiry.name
                  : "Add Applicant"}
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close drawer"
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: `1px solid ${THEME.border}`,
                background: THEME.buttonCloseBg,
                color: THEME.textSecondary,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  THEME.buttonCloseHoverBg;

                e.currentTarget.style.borderColor =
                  THEME.buttonCloseHoverBorder;

                e.currentTarget.style.color =
                  THEME.textPrimary;

                e.currentTarget.style.transform =
                  "rotate(90deg)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  THEME.buttonCloseBg;

                e.currentTarget.style.borderColor =
                  THEME.border;

                e.currentTarget.style.color =
                  THEME.textSecondary;

                e.currentTarget.style.transform =
                  "rotate(0deg)";
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line
                  x1="18"
                  y1="6"
                  x2="6"
                  y2="18"
                />

                <line
                  x1="6"
                  y1="6"
                  x2="18"
                  y2="18"
                />
              </svg>
            </button>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "24px 28px",
            }}
          >
            <EnquiryForm
              defaultValues={enquiry}
              onSubmit={onSubmit}
              onCancel={onClose}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default EnquiryDrawer;