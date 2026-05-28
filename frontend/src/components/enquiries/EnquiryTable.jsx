import { useEffect, useRef } from "react";
import StatusBadge from "../ui/StatusBadge";
import Pagination from "../ui/Pagination";

const THEME = {
  bgCard: "rgba(255,255,255,0.02)",
  bgHeader: "rgba(255,255,255,0.04)",
  bgRowHover: "rgba(255,255,255,0.03)",
  bgSkeleton: "rgba(255,255,255,0.05)",
  bgSkeletonShine: "rgba(255,255,255,0.08)",

  textPrimary: "#ffffff",
  textSecondary: "rgba(255,255,255,0.75)",
  textMuted: "rgba(255,255,255,0.4)",

  border: "rgba(255,255,255,0.08)",
  borderHover: "rgba(255,255,255,0.18)",

  buttonBg: "rgba(255,255,255,0.06)",
  buttonHoverBg: "rgba(255,255,255,0.12)",

  buttonBorder: "rgba(255,255,255,0.1)",
  buttonHoverBorder: "rgba(255,255,255,0.22)",
};

const COL_HEADERS = [
  { key: "name", label: "Name", sortable: true },
  { key: "email", label: "Email", sortable: true },
  { key: "phone", label: "Phone", sortable: false },
  { key: "course", label: "Course", sortable: true },
  { key: "department", label: "Department", sortable: true },
  { key: "status", label: "Status", sortable: true },
  { key: "createdAt", label: "Date", sortable: true },
  { key: "actions", label: "", sortable: false },
];

const STATUSES = [
  "Pending",
  "Contacted",
  "Admitted",
  "Rejected",
];

const SkeletonRow = ({ cols }) => (
  <tr>
    {Array.from({ length: cols }).map((_, i) => (
      <td
        key={i}
        style={{
          padding: "14px 16px",
        }}
      >
        <div
          style={{
            height: 14,
            borderRadius: 6,
            background: THEME.bgSkeleton,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
              backgroundSize: "200% 100%",
              animation:
                "shimmerSweep 1.5s ease infinite",
            }}
          />
        </div>
      </td>
    ))}
  </tr>
);

const RevealRow = ({ children, index }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;

    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          obs.disconnect();
        }
      },
      {
        threshold: 0.1,
      }
    );

    obs.observe(el);

    return () => obs.disconnect();
  }, []);

  return (
    <tr
      ref={ref}
      className="eq-row"
      style={{
        opacity: 0,
        transform: "translateY(10px)",
        transition: `all 0.4s ease ${index * 50}ms`,
      }}
    >
      {children}
    </tr>
  );
};

const SortIcon = ({ active, order }) => (
  <span
    style={{
      display: "inline-flex",
      marginLeft: 6,
      opacity: active ? 1 : 0.2,
      transition: "0.2s",
    }}
  >
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke={
        active
          ? "#fff"
          : "rgba(255,255,255,0.4)"
      }
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transform:
          active && order === "asc"
            ? "rotate(180deg)"
            : "rotate(0deg)",
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  </span>
);

const EnquiryTable = ({
  enquiries,
  pagination,
  filters,
  onSort,
  onEdit,
  onDelete,
  onStatusChange,
  onPageChange,
  selectedIds,
  onSelectAll,
  onSelectRow,
  isFetching,
  isLoading,
}) => {
  const allSelected =
    enquiries.length > 0 &&
    enquiries.every((e) =>
      selectedIds.includes(e._id)
    );

  const someSelected = enquiries.some((e) =>
    selectedIds.includes(e._id)
  );

  const thStyle = {
    padding: "14px 16px",
    textAlign: "left",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: THEME.textMuted,
    borderBottom: `1px solid ${THEME.border}`,
    background: THEME.bgHeader,
    whiteSpace: "nowrap",
    cursor: "pointer",
  };

  const tdStyle = {
    padding: "16px",
    fontSize: 13.5,
    color: THEME.textSecondary,
    borderBottom: `1px solid ${THEME.border}`,
    verticalAlign: "middle",
  };

  return (
    <>
      <style>{`
        .eq-row:hover td {
          background: ${THEME.bgRowHover};
        }

        .action-btn {
          opacity: 0.4;
          transition: 0.2s ease;
        }

        .eq-row:hover .action-btn {
          opacity: 1;
        }

        .action-btn:hover {
          transform: scale(1.05);
          background:
            ${THEME.buttonHoverBg} !important;
          border-color:
            ${THEME.buttonHoverBorder} !important;
        }

        @keyframes shimmerSweep {
          0% {
            background-position: -200% 0;
          }

          100% {
            background-position: 200% 0;
          }
        }

        select option {
          background: #0d0d0d;
          color: white;
        }

        @media (max-width: 768px) {
          .eq-desktop {
            display: none;
          }

          .eq-mobile-cards {
            display: block !important;
          }
        }

        @media (min-width: 769px) {
          .eq-mobile-cards {
            display: none;
          }
        }
      `}</style>

      <div
        className="eq-desktop"
        style={{
          overflowX: "auto",
          borderRadius: 18,
          border: `1px solid ${THEME.border}`,
          background: THEME.bgCard,
          backdropFilter: "blur(12px)",
          paddingRight: 22,
          marginRight: 18,
          opacity:
            isFetching && !isLoading ? 0.6 : 1,
          transition: "0.2s",
        }}
      >
        <table
          style={{
            width: "100%",
            minWidth: "1250px",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  ...thStyle,
                  width: 40,
                }}
              >
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) {
                      el.indeterminate =
                        someSelected &&
                        !allSelected;
                    }
                  }}
                  onChange={(e) =>
                    onSelectAll(
                      e.target.checked
                    )
                  }
                  style={{
                    accentColor: "#ffffff",
                    width: 16,
                    height: 16,
                    cursor: "pointer",
                  }}
                />
              </th>

              {COL_HEADERS.map((col) => (
                <th
                  key={col.key}
                  style={thStyle}
                  onClick={() =>
                    col.sortable &&
                    onSort(col.key)
                  }
                >
                  {col.label}

                  {col.sortable && (
                    <SortIcon
                      active={
                        filters.sortBy ===
                        col.key
                      }
                      order={filters.sortOrder}
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {isLoading
              ? Array.from({
                  length: 5,
                }).map((_, i) => (
                  <SkeletonRow
                    key={i}
                    cols={9}
                  />
                ))
              : enquiries.map((enq, idx) => (
                  <RevealRow
                    key={enq._id}
                    index={idx}
                  >
                    <td style={tdStyle}>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(
                          enq._id
                        )}
                        onChange={() =>
                          onSelectRow(enq._id)
                        }
                        style={{
                          accentColor:
                            "#ffffff",
                          width: 16,
                          height: 16,
                          cursor: "pointer",
                        }}
                      />
                    </td>

                    <td
                      style={{
                        ...tdStyle,
                        color:
                          THEME.textPrimary,
                        fontWeight: 600,
                      }}
                    >
                      {enq.name}
                    </td>

                    <td style={tdStyle}>
                      {enq.email}
                    </td>

                    <td style={tdStyle}>
                      {enq.phone}
                    </td>

                    <td style={tdStyle}>
                      {enq.course}
                    </td>

                    <td style={tdStyle}>
                      <span
                        style={{
                          padding:
                            "4px 10px",
                          borderRadius: 8,
                          background:
                            "rgba(255,255,255,0.06)",
                          border:
                            "1px solid rgba(255,255,255,0.1)",
                          fontSize: 12,
                        }}
                      >
                        {enq.department}
                      </span>
                    </td>

                    <td style={tdStyle}>
                      <div
                        style={{
                          display: "flex",
                          alignItems:
                            "center",
                          gap: 12,
                        }}
                      >
                        <select
                          value={enq.status}
                          onChange={(e) =>
                            onStatusChange(
                              enq._id,
                              e.target.value
                            )
                          }
                          style={{
                            background:
                              "#111",
                            color: "#fff",
                            border:
                              "1px solid rgba(255,255,255,0.1)",
                            borderRadius: 8,
                            padding:
                              "6px 10px",
                            outline: "none",
                            cursor:
                              "pointer",
                          }}
                        >
                          {STATUSES.map(
                            (s) => (
                              <option
                                key={s}
                                value={s}
                              >
                                {s}
                              </option>
                            )
                          )}
                        </select>

                        <StatusBadge
                          status={enq.status}
                          size="sm"
                        />
                      </div>
                    </td>

                    <td
                      style={{
                        ...tdStyle,
                        whiteSpace:
                          "nowrap",
                        fontSize: 12,
                        color:
                          THEME.textMuted,
                      }}
                    >
                      {new Date(
                        enq.createdAt
                      ).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </td>

                    <td
                      style={{
                        ...tdStyle,
                        paddingRight: 28,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent:
                            "flex-end",
                          gap: 10,
                        }}
                      >
                        <button
                          className="action-btn"
                          onClick={() =>
                            onEdit(enq)
                          }
                          style={{
                            background:
                              THEME.buttonBg,
                            border: `1px solid ${THEME.buttonBorder}`,
                            borderRadius: 10,
                            color: "#fff",
                            padding:
                              "7px 14px",
                            cursor:
                              "pointer",
                          }}
                        >
                          Edit
                        </button>

                        <button
                          className="action-btn"
                          onClick={() =>
                            onDelete(
                              enq._id
                            )
                          }
                          style={{
                            background:
                              THEME.buttonBg,
                            border: `1px solid ${THEME.buttonBorder}`,
                            borderRadius: 10,
                            color: "#fff",
                            padding:
                              "7px 14px",
                            cursor:
                              "pointer",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </RevealRow>
                ))}
          </tbody>
        </table>
      </div>

      <Pagination
        pagination={pagination}
        onPageChange={onPageChange}
      />
    </>
  );
};

export default EnquiryTable;