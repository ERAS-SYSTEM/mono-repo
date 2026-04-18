import { ContactKeeperStatusPanel } from "@repo/feature-y";

export function App() {
  return (
    <div className="container">
      <header className="header">
        <div>
          <h1 className="title">Contact Keeper</h1>
          <p className="subtitle">
            Assembled from <code>@repo/feature-y</code>. API calls go to <code>/api/*</code> and are
            proxied to <code>localhost:3005</code> in dev.
          </p>
        </div>
        <span className="badge">Vite app · port 5174</span>
      </header>

      <div className="grid">
        <div className="card">
          <ContactKeeperStatusPanel healthUrl="/api/health" />
        </div>
        <aside className="card">
          <h2>Quick links</h2>
          <p className="subtitle">
            Node API:{" "}
            <a className="link" href="http://localhost:3005/api/health" target="_blank" rel="noreferrer">
              /api/health
            </a>
          </p>
        </aside>
      </div>
    </div>
  );
}

