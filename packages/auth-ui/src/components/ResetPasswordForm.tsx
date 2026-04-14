import { FormEvent, useMemo, useState } from "react";

import { useAuthStore } from "../store/authStore";
import styles from "./PasswordRecoveryForms.module.css";

export interface ResetPasswordFormProps {
  token?: string;
  onSuccess?: () => void;
}

export const ResetPasswordForm = ({ token, onSuccess }: ResetPasswordFormProps) => {
  const resetPassword = useAuthStore((state) => state.resetPassword);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const resolvedToken = useMemo(() => token ?? "", [token]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!resolvedToken) {
      setError("Missing reset token.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const responseMessage = await resetPassword(resolvedToken, password);
      setMessage(responseMessage);
      setPassword("");
      setConfirmPassword("");
      onSuccess?.();
    } catch {
      setError("Invalid or expired token.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={styles.panel}>
      <h2 className={styles.title}>Reset password</h2>
      <p className={styles.subtitle}>Create a new password for your account.</p>
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <div>
          <label className={styles.label} htmlFor="reset-password">
            New password
          </label>
          <input
            id="reset-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            autoComplete="new-password"
            required
          />
        </div>
        <div>
          <label className={styles.label} htmlFor="reset-confirm-password">
            Confirm password
          </label>
          <input
            id="reset-confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={styles.input}
            autoComplete="new-password"
            required
          />
        </div>
        {message && <p className={styles.success}>{message}</p>}
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" disabled={isLoading} className={styles.button}>
          {isLoading ? "Resetting..." : "Reset password"}
        </button>
      </form>
    </section>
  );
};
