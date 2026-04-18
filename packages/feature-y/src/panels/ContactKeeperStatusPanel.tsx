import { useState } from "react";
import { clamp } from "@repo/utils";
import { LoginForm } from "@repo/ui-components";

export function ContactKeeperStatusPanel(props: { healthUrl?: string }) {
  const healthUrl = props.healthUrl ?? "/api/health";
  const [apiStatus, setApiStatus] = useState<string>("not checked");
  const [tries, setTries] = useState<number>(0);

  async function checkApi() {
    setTries((t) => clamp(t + 1, 0, 999));
    try {
      const res = await fetch(healthUrl);
      const text = await res.text();
      setApiStatus(text);
    } catch {
      setApiStatus("unreachable");
    }
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <section>
        <h2 style={{ margin: "0 0 8px" }}>API status</h2>
        <button onClick={checkApi}>Check {healthUrl}</button>
        <div style={{ marginTop: 8, opacity: 0.7, fontSize: 12 }}>tries: {tries}</div>
        <pre style={{ marginTop: 12, padding: 12, background: "#111", color: "#eee" }}>
          {apiStatus}
        </pre>
      </section>

      <section>
        <h2 style={{ margin: "0 0 8px" }}>Auth (from ui-components)</h2>
        <LoginForm />
      </section>
    </div>
  );
}

