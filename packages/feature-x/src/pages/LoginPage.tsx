import { LoginForm, useAuth } from "@repo/ui-components";

export function LoginPage() {
  const { user } = useAuth();

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h2 style={{ margin: 0 }}>Login</h2>
      {user ? (
        <p style={{ margin: 0, opacity: 0.8 }}>
          You are already signed in as <b>{user.username}</b>.
        </p>
      ) : (
        <p style={{ margin: 0, opacity: 0.8 }}>Sign in to your account.</p>
      )}
      <LoginForm />
      <div style={{ marginTop: 8, opacity: 0.8 }}>
        No account? <a href="/signup">Create one</a>
      </div>
    </div>
  );
}

