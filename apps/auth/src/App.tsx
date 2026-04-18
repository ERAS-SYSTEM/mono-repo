import { AuthHomePage, LoginPage, SignupPage } from "@repo/feature-x";
import { Navigate, Route, Routes } from "react-router-dom";

export function App() {
  return (
    <div className="container">
      <header className="header">
        <div>
          <h1 className="title">Auth</h1>
          <p className="subtitle">Pages assembled from `@repo/feature-x` (packages), not app-local UI.</p>
        </div>
        <span className="badge">Vite app · port 5175</span>
      </header>

      <div className="grid">
        <div className="card">
          <Routes>
            <Route path="/" element={<AuthHomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <aside className="card">
          <h2>Monorepo</h2>
          <p className="subtitle">
            This app composes features from workspace packages:{" "}
            <code>@repo/ui-components</code>, <code>@repo/utils</code>, <code>@repo/feature-x</code>.
          </p>
        </aside>
      </div>
    </div>
  );
}

