
import { useState } from "react";

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

const STATUSES = ["Pending", "Contacted", "Admitted", "Rejected"];

const EMPTY = {
  name: "",
  email: "",
  phone: "",
  course: "",
  department: "",
  status: "Pending",
  notes: "",
};

function validate(values) {
  const errors = {};

  if (!values.name || values.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  if (!values.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.phone || !/^[+\d][\d\s\-().]{6,19}$/.test(values.phone)) {
    errors.phone = "Enter a valid phone number.";
  }

  if (!values.course || values.course.trim().length === 0) {
    errors.course = "Course is required.";
  }

  if (!values.department) {
    errors.department = "Select a department.";
  }

  if (values.notes && values.notes.length > 1000) {
    errors.notes = "Notes cannot exceed 1000 characters.";
  }

  return errors;
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "11px 14px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.05)",
  color: "#f1f5f9",
  fontSize: 14,
  fontFamily: "'DM Sans', sans-serif",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

const errorStyle = {
  fontSize: 12,
  color: "#f87171",
  marginTop: 4,
  fontFamily: "'DM Sans', sans-serif",
};

const labelStyle = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "rgba(148,163,184,0.9)",
  marginBottom: 6,
  fontFamily: "'DM Sans', sans-serif",
};

const Field = ({
  id,
  label,
  required,
  children,
  error,
  touched,
}) => (
  <div style={{ marginBottom: 20 }}>
    <label htmlFor={id} style={labelStyle}>
      {label}
      {required && (
        <span style={{ color: "#f87171", marginLeft: 2 }}>
          *
        </span>
      )}
    </label>

    {children}

    {error && touched && (
      <div style={errorStyle}>{error}</div>
    )}
  </div>
);

const EnquiryForm = ({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const [values, setValues] = useState(() => ({
    ...EMPTY,
    ...(defaultValues
      ? {
        name: defaultValues.name || "",
        email: defaultValues.email || "",
        phone: defaultValues.phone || "",
        course: defaultValues.course || "",
        department: defaultValues.department || "",
        status: defaultValues.status || "Pending",
        notes: defaultValues.notes || "",
      }
      : {}),
  }));

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [focusedField, setFocusedField] = useState(null);

  const set = (field) => (e) => {
    const val = e.target.value;

    setValues((prev) => {
      const updated = {
        ...prev,
        [field]: val,
      };

      if (touched[field]) {
        const fieldError = validate(updated)[field];

        setErrors((prevErrs) => ({
          ...prevErrs,
          [field]: fieldError,
        }));
      }

      return updated;
    });
  };

  const blur = (field) => () => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));

    setValues((prev) => {
      const fieldError = validate(prev)[field];

      setErrors((prevErrs) => ({
        ...prevErrs,
        [field]: fieldError,
      }));

      return prev;
    });

    setFocusedField(null);
  };

  const focus = (field) => () => {
    setFocusedField(field);
  };

  const fieldStyle = (field) => ({
    ...inputStyle,
    borderColor:
      errors[field] && touched[field]
        ? "rgba(239,68,68,0.6)"
        : focusedField === field
          ? "rgba(99,102,241,0.7)"
          : "rgba(255,255,255,0.1)",

    boxShadow:
      errors[field] && touched[field]
        ? "0 0 0 2px rgba(239,68,68,0.2)"
        : focusedField === field
          ? "0 0 0 2px rgba(99,102,241,0.25), 0 0 16px rgba(99,102,241,0.15)"
          : "none",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const allTouched = Object.fromEntries(
      Object.keys(EMPTY).map((k) => [k, true])
    );

    setTouched(allTouched);

    const errs = validate(values);

    setErrors(errs);

    if (Object.keys(errs).length > 0) return;

    await onSubmit(values);
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Admission Enquiry Form"
    >
      {/* Name */}
      <Field
        id="name"
        label="Applicant Name"
        required
        error={errors.name}
        touched={touched.name}
      >
        <input
          id="name"
          type="text"
          placeholder="e.g. Priya Sharma"
          value={values.name}
          onChange={set("name")}
          onFocus={focus("name")}
          onBlur={blur("name")}
          style={fieldStyle("name")}
          autoComplete="name"
        />
      </Field>

      {/* Email */}
      <Field
        id="email"
        label="Email Address"
        required
        error={errors.email}
        touched={touched.email}
      >
        <input
          id="email"
          type="email"
          placeholder="applicant@example.com"
          value={values.email}
          onChange={set("email")}
          onFocus={focus("email")}
          onBlur={blur("email")}
          style={fieldStyle("email")}
          autoComplete="email"
        />
      </Field>

      {/* Phone */}
      <Field
        id="phone"
        label="Phone Number"
        required
        error={errors.phone}
        touched={touched.phone}
      >
        <input
          id="phone"
          type="tel"
          placeholder="+91 98765 43210"
          value={values.phone}
          onChange={set("phone")}
          onFocus={focus("phone")}
          onBlur={blur("phone")}
          style={fieldStyle("phone")}
          autoComplete="tel"
        />
      </Field>

      {/* Course */}
      <Field
        id="course"
        label="Course of Interest"
        required
        error={errors.course}
        touched={touched.course}
      >
        <input
          id="course"
          type="text"
          placeholder="e.g. B.Tech Computer Science"
          value={values.course}
          onChange={set("course")}
          onFocus={focus("course")}
          onBlur={blur("course")}
          style={fieldStyle("course")}
        />
      </Field>

      {/* Department + Status */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div>
          <label htmlFor="department" style={labelStyle}>
            Department *
          </label>

          <select
            id="department"
            value={values.department}
            onChange={set("department")}
            onFocus={focus("department")}
            onBlur={blur("department")}
            style={{
              ...fieldStyle("department"),
              cursor: "pointer",
            }}
          >
            <option value="">Select…</option>

            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {errors.department && touched.department && (
            <div style={errorStyle}>
              {errors.department}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="status" style={labelStyle}>
            Status
          </label>

          <select
            id="status"
            value={values.status}
            onChange={set("status")}
            onFocus={focus("status")}
            onBlur={blur("status")}
            style={{
              ...fieldStyle("status"),
              cursor: "pointer",
            }}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Notes */}
      <Field
        id="notes"
        label="Internal Notes"
        error={errors.notes}
        touched={touched.notes}
      >
        <textarea
          id="notes"
          placeholder="Any additional notes..."
          value={values.notes}
          onChange={set("notes")}
          onFocus={focus("notes")}
          onBlur={blur("notes")}
          rows={4}
          maxLength={1000}
          style={{
            ...fieldStyle("notes"),
            resize: "vertical",
            minHeight: 90,
          }}
        />

        <div
          style={{
            fontSize: 11,
            color: "rgba(148,163,184,0.5)",
            textAlign: "right",
            marginTop: 3,
          }}
        >
          {values.notes.length}/1000
        </div>
      </Field>

      {/* Buttons */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginTop: 8,
        }}
      >
        <button
          type="button"
          onClick={onCancel}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.04)",
            color: "#94a3b8",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            flex: 2,
            padding: "12px",
            borderRadius: 12,
            border: "none",
            background: "#6366f1",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          {isSubmitting
            ? "Saving..."
            : defaultValues
              ? "Save Changes"
              : "Submit Enquiry"}
        </button>
      </div>
    </form>
  );
};
export default EnquiryForm;