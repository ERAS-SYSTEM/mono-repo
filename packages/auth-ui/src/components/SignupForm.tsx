import { FormEvent, useState } from "react";

import { useAuthStore } from "../store/authStore";

export const SignupForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register, isLoading } = useAuthStore();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await register(username, email, password);
    } catch {
      setError("Could not create account");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <input
        className="input-field"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        className="input-field"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        className="input-field"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <div style={{ color: "var(--danger)", fontSize: "0.875rem" }}>{error}</div>}
      <button className="btn btn-primary" type="submit" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Sign up"}
      </button>
    </form>
  );
};
