import { FormEvent, useState } from "react";

import { useAuthStore } from "../store/authStore";
import styles from "./PasswordRecoveryForms.module.css";

export const ForgotPasswordForm = () => {
  const forgotPassword = useAuthStore((state) => state.forgotPassword);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);
    try {
      const responseMessage = await forgotPassword(email);
      setMessage(responseMessage);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={styles.panel}>
      <h2 className={styles.title}>Forgot password</h2>
      <p className={styles.subtitle}>Enter your account email and we will send a reset link.</p>
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <div>
          <label className={styles.label} htmlFor="forgot-email">
            Email address
          </label>
          <input
            id="forgot-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            autoComplete="email"
            required
          />
        </div>
        {message && <p className={styles.success}>{message}</p>}
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" disabled={isLoading} className={styles.button}>
          {isLoading ? "Sending..." : "Send reset link"}
        </button>
      </form>
    </section>
  );
};
