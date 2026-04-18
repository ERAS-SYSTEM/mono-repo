import { SignupForm, useAuth } from "@repo/ui-components";

export function SignupPage() {
  const { user } = useAuth();

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h2 style={{ margin: 0 }}>Create account</h2>
      {user ? (
        <p style={{ margin: 0, opacity: 0.8 }}>
          You are already signed in as <b>{user.username}</b>.
        </p>
      ) : (
        <p style={{ margin: 0, opacity: 0.8 }}>Create a new account to continue.</p>
      )}
      <SignupForm />
      <div style={{ marginTop: 8, opacity: 0.8 }}>
        Already have an account? <a href="/login">Log in</a>
      </div>
    </div>
  );
}

