import { useEffect, useState, useRef } from "react";

const THEME = {
  bgCard: "rgba(255, 255, 255, 0.03)",
  bgCardHover: "rgba(255, 255, 255, 0.06)",
  bgSkeleton: "rgba(255, 255, 255, 0.05)",
  bgSkeletonShine: "rgba(255, 255, 255, 0.08)",
  textPrimary: "#ffffff",
  textSecondary: "rgba(255, 255, 255, 0.5)",
  textMuted: "rgba(255, 255, 255, 0.3)",
  border: "rgba(255, 255, 255, 0.06)",
  borderHover: "rgba(255, 255, 255, 0.15)",
  iconBg: "rgba(255, 255, 255, 0.06)",
  iconBorder: "rgba(255, 255, 255, 0.1)",
};

const useCountUp = (
  target,
  duration = 1500,
  startOnView = true
) => {
  const [value, setValue] = useState(0);
  const [hasStarted, setHasStarted] =
    useState(false);

  const rafRef = useRef(null);
  const ref = useRef(null);

  useEffect(() => {
    if (!startOnView) {
      setHasStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          !hasStarted
        ) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.3,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [startOnView, hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    if (target === 0) {
      setValue(0);
      return;
    }

    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;

      const progress = Math.min(
        elapsed / duration,
        1
      );

      const ease =
        1 - Math.pow(1 - progress, 4);

      setValue(
        Math.round(ease * target)
      );

      if (progress < 1) {
        rafRef.current =
          requestAnimationFrame(tick);
      }
    };

    rafRef.current =
      requestAnimationFrame(tick);

    return () =>
      cancelAnimationFrame(rafRef.current);
  }, [target, duration, hasStarted]);

  return {
    value,
    ref,
  };
};

const SkeletonCard = ({ index }) => {
  const delay = index * 120;

  return (
    <div
      style={{
        background: THEME.bgCard,
        border: `1px solid ${THEME.border}`,
        borderRadius: 16,
        padding: "24px 28px",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        overflow: "hidden",
        position: "relative",
        minHeight: 120,
        opacity: 0,
        animation: `fadeInUp 0.6s ${delay}ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(90deg, transparent 0%, ${THEME.bgSkeletonShine} 50%, transparent 100%)`,
          backgroundSize: "200% 100%",
          animation:
            "shimmerSweep 1.8s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: THEME.bgSkeleton,
          marginBottom: 16,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(90deg, transparent 0%, ${THEME.bgSkeletonShine} 50%, transparent 100%)`,
            backgroundSize: "200% 100%",
            animation:
              "shimmerSweep 1.8s ease-in-out infinite",
            animationDelay: "0.2s",
          }}
        />
      </div>

      <div
        style={{
          width: "55%",
          height: 12,
          borderRadius: 6,
          background: THEME.bgSkeleton,
          marginBottom: 14,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(90deg, transparent 0%, ${THEME.bgSkeletonShine} 50%, transparent 100%)`,
            backgroundSize: "200% 100%",
            animation:
              "shimmerSweep 1.8s ease-in-out infinite",
            animationDelay: "0.4s",
          }}
        />
      </div>

      <div
        style={{
          width: "40%",
          height: 32,
          borderRadius: 8,
          background: THEME.bgSkeleton,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(90deg, transparent 0%, ${THEME.bgSkeletonShine} 50%, transparent 100%)`,
            backgroundSize: "200% 100%",
            animation:
              "shimmerSweep 1.8s ease-in-out infinite",
            animationDelay: "0.6s",
          }}
        />
      </div>
    </div>
  );
};

const StatCard = ({
  value,
  config,
  index,
}) => {
  const [hovered, setHovered] =
    useState(false);

  const [mounted, setMounted] =
    useState(false);

  const {
    value: count,
    ref,
  } = useCountUp(value);

  useEffect(() => {
    const timer = setTimeout(
      () => setMounted(true),
      index * 100
    );

    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      ref={ref}
      onMouseEnter={() =>
        setHovered(true)
      }
      onMouseLeave={() =>
        setHovered(false)
      }
      style={{
        background: hovered
          ? THEME.bgCardHover
          : THEME.bgCard,

        border: `1px solid ${
          hovered
            ? THEME.borderHover
            : THEME.border
        }`,

        borderRadius: 16,
        padding: "24px 28px",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter:
          "blur(20px)",

        boxShadow: hovered
          ? "0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.08)"
          : "0 4px 16px rgba(0, 0, 0, 0.3)",

        transform: mounted
          ? hovered
            ? "translateY(-4px)"
            : "translateY(0)"
          : "translateY(20px)",

        opacity: mounted ? 1 : 0,

        transition:
          "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",

        cursor: "default",
        position: "relative",
        overflow: "hidden",
        minHeight: 120,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 20,
          right: 20,
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
          opacity: hovered ? 0.6 : 0.2,
          transition: "opacity 0.3s ease",
        }}
      />

      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: THEME.iconBg,
          border: `1px solid ${THEME.iconBorder}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
          transition: "all 0.3s ease",
          transform: hovered
            ? "scale(1.08)"
            : "scale(1)",
        }}
      >
        {config.icon}
      </div>

      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: THEME.textSecondary,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fontFamily:
            "'Inter', 'SF Pro Display', sans-serif",
          marginBottom: 8,
          lineHeight: 1.4,
        }}
      >
        {config.label}
      </div>

      <div
        style={{
          fontSize:
            "clamp(1.75rem, 2.5vw, 2.25rem)",
          fontWeight: 700,
          fontFamily:
            "'Inter', 'SF Pro Display', sans-serif",
          color: THEME.textPrimary,
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          fontVariantNumeric:
            "tabular-nums",
        }}
      >
        {count.toLocaleString()}
      </div>
    </div>
  );
};

const CARD_CONFIG = [
  {
    key: "total",
    label: "Total Enquiries",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle
          cx="9"
          cy="7"
          r="4"
        />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },

  {
    key: "pending",
    label: "Pending Review",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
        />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },

  {
    key: "contacted",
    label: "Contacted",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },

  {
    key: "admitted",
    label: "Admitted",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },

  {
    key: "rejected",
    label: "Rejected",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
        />
        <line
          x1="15"
          y1="9"
          x2="9"
          y2="15"
        />
        <line
          x1="9"
          y1="9"
          x2="15"
          y2="15"
        />
      </svg>
    ),
  },
];

const StatsCards = ({
  stats = {},
  isLoading,
}) => {
  return (
    <>
      <style>{`
        @keyframes shimmerSweep {
          0% {
            background-position: -200% 0;
          }

          100% {
            background-position: 200% 0;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 20,
        }}
      >
        {isLoading
          ? CARD_CONFIG.map((c, i) => (
              <SkeletonCard
                key={c.key}
                index={i}
              />
            ))
          : CARD_CONFIG.map((c, i) => (
              <StatCard
                key={c.key}
                value={
                  stats[c.key] ?? 0
                }
                config={c}
                index={i}
              />
            ))}
      </div>
    </>
  );
};

export default StatsCards;