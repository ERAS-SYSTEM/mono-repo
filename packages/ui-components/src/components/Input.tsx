import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = "", ...props }) => {
  return (
    <div className="input-group" style={{ marginBottom: "1rem" }}>
      {label && <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>{label}</label>}
      <input className={`input-field ${className}`} {...props} />
      {error && <p style={{ color: "var(--danger)", fontSize: "0.75rem", marginTop: "0.25rem" }}>{error}</p>}
    </div>
  );
};
