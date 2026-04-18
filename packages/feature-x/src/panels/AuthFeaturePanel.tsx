import { formatIsoDate } from "@repo/utils";
import { LoginForm, SignupForm } from "@repo/ui-components";

export function AuthFeaturePanel() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ opacity: 0.7, fontSize: 12 }}>
        Rendered at {formatIsoDate(new Date())}
      </div>
      <section>
        <h2 style={{ margin: "0 0 8px" }}>Login</h2>
        <LoginForm />
      </section>
      <section>
        <h2 style={{ margin: "0 0 8px" }}>Sign up</h2>
        <SignupForm />
      </section>
    </div>
  );
}

