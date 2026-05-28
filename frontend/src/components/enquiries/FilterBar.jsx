
import { useState, useCallback } from "react";

const DEPARTMENTS = [
  "Computer Science",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Civil Engineering",
  "Business Administration",
  "Medicine",
  "Law",
  "Arts & Humanities",
  "Natural Sciences",
  "Architecture",
];

const STATUS_OPTIONS = [
  "Pending",
  "Contacted",
  "Admitted",
  "Rejected",
];

const inputBase = {
  background: "#0f0f0f",

  border: "1px solid rgba(255,255,255,0.08)",

  borderRadius: 12,

  color: "#ffffff",

  fontFamily:
    "'Inter', 'Segoe UI', sans-serif",

  fontSize: 14,

  outline: "none",

  transition: "all 0.25s ease",

  backdropFilter: "blur(10px)",

  boxShadow:
    "0 4px 20px rgba(0,0,0,0.25)",
};

const selectOptionStyle = {
  background: "#000000",

  color: "#ffffff",
};


const FilterBar = ({
  filters,

  onUpdate,

  selectedCount,

  onBulkDelete,

  isDeleting,
}) => {
  const [searchFocused, setSearchFocused] =
    useState(false);

  const handleSearch = useCallback(
    (e) => {
      onUpdate({
        search: e.target.value,
        page: 1,
      });
    },

    [onUpdate]
  );

  return (
    <div
      style={{
        display: "flex",

        flexWrap: "wrap",

        gap: 12,

        alignItems: "center",

        padding: "16px 20px",

        background: "rgba(10,10,10,0.92)",

        borderRadius: 18,

        border:
          "1px solid rgba(255,255,255,0.06)",

        backdropFilter: "blur(16px)",

        boxShadow:
          "0 10px 35px rgba(0,0,0,0.45)",
      }}
    >
    
      <div
        style={{
          position: "relative",

          flex: "1 1 220px",

          minWidth: 180,
        }}
      >
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          style={{
            position: "absolute",

            left: 12,

            top: "50%",

            transform: "translateY(-50%)",

            width: 16,

            height: 16,

            color: searchFocused
              ? "#ffffff"
              : "rgba(255,255,255,0.5)",

            transition: "color 0.2s",
          }}
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>

        <input
          type="text"
          placeholder="Search name, email, course..."
          value={filters.search}
          onChange={handleSearch}
          onFocus={() =>
            setSearchFocused(true)
          }
          onBlur={() =>
            setSearchFocused(false)
          }
          aria-label="Search enquiries"
          style={{
            ...inputBase,

            width: "100%",

            padding:
              "12px 14px 12px 40px",

            boxSizing: "border-box",

            boxShadow: searchFocused
              ? "0 0 0 2px rgba(255,255,255,0.15)"
              : "none",

            borderColor: searchFocused
              ? "rgba(255,255,255,0.2)"
              : "rgba(255,255,255,0.08)",
          }}
        />
      </div>


      <select
        value={filters.status}
        onChange={(e) =>
          onUpdate({
            status: e.target.value,
            page: 1,
          })
        }
        aria-label="Filter by status"
        style={{
          ...inputBase,

          padding: "12px 14px",

          cursor: "pointer",

          flex: "0 0 auto",

          backgroundColor: "#0f0f0f",

          color: "#ffffff",

          minWidth: 160,
        }}
      >
        <option
          value=""
          style={selectOptionStyle}
        >
          All Statuses
        </option>

        {STATUS_OPTIONS.map((s) => (
          <option
            key={s}
            value={s}
            style={selectOptionStyle}
          >
            {s}
          </option>
        ))}
      </select>

      
      <select
        value={filters.department}
        onChange={(e) =>
          onUpdate({
            department: e.target.value,
            page: 1,
          })
        }
        aria-label="Filter by department"
        style={{
          ...inputBase,

          padding: "12px 14px",

          cursor: "pointer",

          flex: "0 1 auto",

          maxWidth: 220,

          backgroundColor: "#0f0f0f",

          color: "#ffffff",
        }}
      >
        <option
          value=""
          style={selectOptionStyle}
        >
          All Departments
        </option>

        {DEPARTMENTS.map((d) => (
          <option
            key={d}
            value={d}
            style={selectOptionStyle}
          >
            {d}
          </option>
        ))}
      </select>


      {selectedCount > 0 && (
        <button
          onClick={onBulkDelete}
          disabled={isDeleting}
          aria-label={`Delete ${selectedCount} selected enquiries`}
          style={{
            marginLeft: "auto",

            padding: "12px 18px",

            borderRadius: 12,

            border:
              "1px solid rgba(255,255,255,0.12)",

            background:
              "rgba(255,255,255,0.05)",

            color: "#ffffff",

            fontSize: 13,

            fontWeight: 600,

            cursor: "pointer",

            display: "flex",

            alignItems: "center",

            gap: 8,

            fontFamily:
              "'Inter', 'Segoe UI', sans-serif",

            transition: "all 0.25s ease",

            boxShadow:
              "0 0 14px rgba(255,255,255,0.05)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform =
              "translateY(-1px)";

            e.currentTarget.style.background =
              "rgba(255,255,255,0.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform =
              "translateY(0)";

            e.currentTarget.style.background =
              "rgba(255,255,255,0.05)";
          }}
        >
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            style={{
              width: 14,
              height: 14,
            }}
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>

          {isDeleting
            ? "Deleting..."
            : `Delete ${selectedCount}`}
        </button>
      )}
    </div>
  );
};

export default FilterBar;