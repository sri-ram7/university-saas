

import { useState, useCallback, useEffect } from "react";

import StatsCards from "../components/enquiries/StatsCards";
import FilterBar from "../components/enquiries/FilterBar";
import EnquiryTable from "../components/enquiries/EnquiryTable";
import EnquiryDrawer from "../components/enquiries/EnquiryDrawer";

import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import ConfirmModal from "../components/ui/ConfirmModal";

import { ToastContainer, useToast } from "../components/ui/Toast";

import useAdmissionEnquiries from "../hooks/useAdmissionEnquiries";


const AnimationStyles = () => (
  <style>{`
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }

    @keyframes cursorBlink {
      0%,
      100% {
        opacity: 1;
      }
      50% {
        opacity: 0;
      }
    }

    @keyframes gridMove {
      0% {
        transform: perspective(500px) rotateX(60deg)
          translateY(0);
      }
      100% {
        transform: perspective(500px) rotateX(60deg)
          translateY(50px);
      }
    }
  `}</style>
);


const COLORS = {
  bgPrimary: "#000000",
  bgCard: "rgba(255, 255, 255, 0.03)",
  textPrimary: "#ffffff",
  textSecondary: "rgba(255, 255, 255, 0.5)",
  textMuted: "rgba(255, 255, 255, 0.3)",
  border: "rgba(255, 255, 255, 0.06)",
  borderHover: "rgba(255, 255, 255, 0.15)",
  buttonBg: "#ffffff",
  buttonText: "#000000",
  gradientShimmer:
    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)",
};



const useTextScramble = (
  text,
  trigger = true,
  speed = 30
) => {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!trigger) return;

    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let iteration = 0;

    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration) {
              return text[index];
            }
            return chars[
              Math.floor(Math.random() * chars.length)
            ];
          })
          .join("")
      );

      if (iteration >= text.length) {
        setIsComplete(true);
        clearInterval(interval);
      }

      iteration += 0.5;
    }, speed);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [text, trigger, speed]);

  return { displayText, isComplete };
};


const useTypewriter = (
  text,
  trigger = true,
  speed = 30
) => {
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (!trigger) return;

    let index = 0;

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setShowCursor(false);
        }, 1000);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, trigger, speed]);

  return { displayText, showCursor };
};

const pageStyle = {
  minHeight: "100vh",
  background: COLORS.bgPrimary,
  color: COLORS.textPrimary,
  fontFamily:
    "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
  padding: "32px 24px",
  position: "relative",
  overflow: "hidden",
};

const gridOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage:
    "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
  backgroundSize: "60px 60px",
  pointerEvents: "none",
  zIndex: 0,
  animation: "gridMove 20s linear infinite",
};

const containerStyle = {
  maxWidth: 1280,
  margin: "0 auto",
  position: "relative",
  zIndex: 1,
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 40,
  flexWrap: "wrap",
  gap: 20,
  animation: "fadeInDown 0.8s ease forwards",
};

const titleStyle = {
  fontSize: "clamp(2rem, 3vw, 2.8rem)",
  fontWeight: 700,
  color: COLORS.textPrimary,
  margin: 0,
  letterSpacing: "-0.03em",
};

const subtitleStyle = {
  marginTop: 10,
  color: COLORS.textSecondary,
  fontSize: 15,
  lineHeight: 1.6,
  maxWidth: 500,
};

const buttonStyle = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "14px 26px",
  borderRadius: 12,
  border: `1px solid ${COLORS.border}`,
  background: COLORS.buttonBg,
  color: COLORS.buttonText,
  fontWeight: 600,
  fontSize: 14,
  cursor: "pointer",
  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
  position: "relative",
  overflow: "hidden",
};

const shimmerStyle = {
  position: "absolute",
  top: 0,
  left: "-100%",
  width: "100%",
  height: "100%",
  background: COLORS.gradientShimmer,
  transition: "left 0.5s ease",
};

const cursorStyle = {
  display: "inline-block",
  width: 2,
  height: "1em",
  background: COLORS.textPrimary,
  marginLeft: 3,
  animation: "cursorBlink 1s step-end infinite",
};



const AdmissionEnquiriesPage = () => {
  const { toasts, addToast, removeToast } =
    useToast();

  const [drawerOpen, setDrawerOpen] =
    useState(false);

  const [editTarget, setEditTarget] =
    useState(null);

  const [loaded, setLoaded] = useState(false);

  const {
    enquiries,
    pagination,
    filters,
    stats,
    isLoading,
    isStatsLoading,
    isFetching,
    isError,
    errorMessage,
    isSubmitting,
    isDeleting,
    selectedIds,
    updateFilters,
    handleSort,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleStatusChange,
    handleBulkDelete,
    handleSelectAll,
    handleSelectRow,
    refetch,
  } = useAdmissionEnquiries({
    onToast: addToast,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const { displayText, isComplete } =
    useTextScramble(
      "Admission Enquiries",
      loaded
    );

  const {
    displayText: subtitleText,
    showCursor,
  } = useTypewriter(
    "Track, manage, and convert admission applications in one unified dashboard.",
    isComplete
  );

  const openCreate = useCallback(() => {
    setEditTarget(null);
    setDrawerOpen(true);
  }, []);

  const openEdit = useCallback((enq) => {
    setEditTarget(enq);
    setDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    setTimeout(() => {
      setEditTarget(null);
    }, 350);
  }, []);

  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: "Confirm Action",
    message: "This action cannot be undone.",
    confirmLabel: "Delete",
    onConfirm: () => {},
  });

  const closeConfirm = useCallback(() => {
    setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const openConfirm = useCallback((config) => {
    setConfirmConfig({
      isOpen: true,
      title: config.title,
      message: config.message,
      confirmLabel: config.confirmLabel || "Delete",
      onConfirm: () => {
        config.onConfirm();
        closeConfirm();
      },
    });
  }, [closeConfirm]);

  const openDeleteConfirm = useCallback(
    (id, name) => {
      openConfirm({
        title: "Delete enquiry?",
        message: `Permanently delete ${name || "this enquiry"}? This cannot be undone.`,
        confirmLabel: "Delete",
        onConfirm: () => handleDelete(id),
      });
    },
    [handleDelete, openConfirm]
  );

  const openBulkDeleteConfirm = useCallback(() => {
    if (selectedIds.length === 0) return;
    openConfirm({
      title: "Delete selected enquiries?",
      message: `Permanently delete ${selectedIds.length} selected enquiry${selectedIds.length === 1 ? "" : "ies"}? This action cannot be undone.`,
      confirmLabel: "Delete selected",
      onConfirm: handleBulkDelete,
    });
  }, [handleBulkDelete, openConfirm, selectedIds.length]);

  const handleFormSubmit = useCallback(
    async (data) => {
      if (editTarget) {
        await handleUpdate(editTarget._id, data);
      } else {
        await handleCreate(data);
      }
      closeDrawer();
    },
    [
      editTarget,
      handleUpdate,
      handleCreate,
      closeDrawer,
    ]
  );

  const hasFilters =
    filters.search ||
    filters.status ||
    filters.department;

  return (
    <div style={pageStyle}>
      <AnimationStyles />

      <div style={gridOverlayStyle} />

      <div style={containerStyle}>
        <header style={headerStyle}>
          <div>
            <h1 style={titleStyle}>
              {loaded
                ? displayText
                : "Admission Enquiries"}
            </h1>

            <p style={subtitleStyle}>
              {isComplete
                ? subtitleText
                : "Track, manage, and convert admission applications in one unified dashboard."}

              {showCursor && (
                <span style={cursorStyle} />
              )}
            </p>
          </div>

          <button
            style={buttonStyle}
            onClick={openCreate}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 8px 24px rgba(255,255,255,0.15)";
              const shimmer =
                e.currentTarget.querySelector(
                  ".btn-shimmer"
                );
              if (shimmer) {
                shimmer.style.left = "100%";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                "translateY(0)";
              e.currentTarget.style.boxShadow =
                "none";
              const shimmer =
                e.currentTarget.querySelector(
                  ".btn-shimmer"
                );
              if (shimmer) {
                shimmer.style.left = "-100%";
              }
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform =
                "scale(0.97)";
            }}
          >
            <div
              className="btn-shimmer"
              style={shimmerStyle}
            />

            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line
                x1="12"
                y1="5"
                x2="12"
                y2="19"
              />
              <line
                x1="5"
                y1="12"
                x2="19"
                y2="12"
              />
            </svg>

            Add Enquiry
          </button>
        </header>

        <div style={{ marginBottom: 32 }}>
          <StatsCards
            stats={stats}
            isLoading={
              isLoading || isStatsLoading
            }
          />
        </div>

        <FilterBar
          filters={filters}
          onUpdate={updateFilters}
          selectedCount={selectedIds.length}
          onBulkDelete={openBulkDeleteConfirm}
          isDeleting={isDeleting}
        />

        <div style={{ height: 24 }} />

        {isError ? (
          <ErrorState
            message={errorMessage}
            onRetry={refetch}
          />
        ) : !isLoading &&
          enquiries.length === 0 ? (
          <EmptyState
            hasFilters={hasFilters}
            onAddNew={openCreate}
          />
        ) : (
          <EnquiryTable
            enquiries={enquiries}
            pagination={pagination}
            filters={filters}
            onSort={handleSort}
            onEdit={openEdit}
            onDelete={openDeleteConfirm}
            onStatusChange={
              handleStatusChange
            }
            selectedIds={selectedIds}
            onSelectAll={handleSelectAll}
            onSelectRow={handleSelectRow}
            isFetching={
              isFetching || isLoading
            }
            onPageChange={(page) =>
              updateFilters({ page })
            }
          />
        )}
      </div>

      <EnquiryDrawer
        isOpen={drawerOpen}
        onClose={closeDrawer}
        enquiry={editTarget}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmLabel={confirmConfig.confirmLabel}
        onConfirm={confirmConfig.onConfirm}
        onCancel={closeConfirm}
        isLoading={isDeleting}
      />

      <ToastContainer
        toasts={toasts}
        onRemove={removeToast}
      />
    </div>
  );
};

export default AdmissionEnquiriesPage;