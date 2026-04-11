import { FormEvent, useEffect, useState } from "react";
import axios from "axios";

import { useAuthStore } from "../store/authStore";

import styles from "./ProfileForm.module.css";

function apiMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data;
    if (typeof data === "object" && data !== null) {
      if ("error" in data && typeof (data as { error: unknown }).error === "string") {
        return (data as { error: string }).error;
      }
      if ("detail" in data && typeof (data as { detail: unknown }).detail === "string") {
        return (data as { detail: string }).detail;
      }
      const firstKey = Object.keys(data)[0];
      const val = firstKey ? (data as Record<string, unknown>)[firstKey] : undefined;
      if (Array.isArray(val) && typeof val[0] === "string") return val[0];
      if (typeof val === "string") return val;
    }
  }
  return "Something went wrong";
}

export const ProfileForm = () => {
  const { user, updateProfile, changePassword } = useAuthStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [passwordFeedback, setPasswordFeedback] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name ?? "");
      setLastName(user.last_name ?? "");
      setEmail(user.email ?? "");
    }
  }, [user]);

  const handleProfileUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setProfileFeedback(null);
    setProfileSaving(true);
    try {
      await updateProfile({ first_name: firstName, last_name: lastName, email });
      setProfileFeedback({ type: "ok", text: "Profile updated." });
    } catch (err) {
      setProfileFeedback({ type: "err", text: apiMessage(err) });
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordFeedback(null);
    setPasswordSaving(true);
    try {
      await changePassword(oldPassword, newPassword);
      setPasswordFeedback({ type: "ok", text: "Password changed successfully." });
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setPasswordFeedback({ type: "err", text: apiMessage(err) });
    } finally {
      setPasswordSaving(false);
    }
  };

  if (!user) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <p className={styles.sub} style={{ margin: 0 }}>
            Sign in to manage your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <form className={styles.card} onSubmit={handleProfileUpdate} noValidate>
        <h3 className={styles.header}>Profile</h3>
        <p className={styles.sub}>Update how your name and email appear on your account.</p>

        <div className={`${styles.row} ${styles.rowTwo}`}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="ck-profile-first">
              First name
            </label>
            <input
              id="ck-profile-first"
              className={styles.input}
              type="text"
              autoComplete="given-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="ck-profile-last">
              Last name
            </label>
            <input
              id="ck-profile-last"
              className={styles.input}
              type="text"
              autoComplete="family-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.row} style={{ marginTop: "0.85rem" }}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="ck-profile-email">
              Email
            </label>
            <input
              id="ck-profile-email"
              className={styles.input}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.btnProfile} disabled={profileSaving}>
            {profileSaving ? "Saving…" : "Save profile"}
          </button>
          {profileFeedback && (
            <p
              className={`${styles.feedback} ${
                profileFeedback.type === "ok" ? styles.feedbackOk : styles.feedbackErr
              }`}
            >
              {profileFeedback.text}
            </p>
          )}
        </div>
      </form>

      <form className={styles.card} onSubmit={handlePasswordChange} noValidate>
        <h3 className={styles.header}>Security</h3>
        <p className={styles.sub}>Choose a strong password you have not used elsewhere.</p>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="ck-password-old">
              Current password
            </label>
            <input
              id="ck-password-old"
              className={`${styles.input} ${styles.inputPassword}`}
              type="password"
              autoComplete="current-password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="ck-password-new">
              New password
            </label>
            <input
              id="ck-password-new"
              className={`${styles.input} ${styles.inputPassword}`}
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.btnPassword} disabled={passwordSaving}>
            {passwordSaving ? "Updating…" : "Change password"}
          </button>
          {passwordFeedback && (
            <p
              className={`${styles.feedback} ${
                passwordFeedback.type === "ok" ? styles.feedbackPasswordOk : styles.feedbackErr
              }`}
            >
              {passwordFeedback.text}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};
