import { useAuth } from "@repo/ui-components";

export function AuthHomePage() {
  const { user } = useAuth();

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h2 style={{ margin: 0 }}>Welcome</h2>
      <p style={{ margin: 0, opacity: 0.8 }}>
        {user ? (
          <>
            Signed in as <b>{user.username}</b> ({user.email})
          </>
        ) : (
          <>You are not signed in yet. Use the Login / Signup pages.</>
        )}
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
        <a href="/login" style={{ color: "inherit" }}>
          Go to Login
        </a>
        <a href="/signup" style={{ color: "inherit" }}>
          Go to Signup
        </a>
      </div>
    </div>
  );
}

