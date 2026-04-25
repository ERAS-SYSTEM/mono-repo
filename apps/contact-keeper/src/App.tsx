import React, { useEffect, useState } from "react";
import { useAuthStore, LoginForm, SignupForm } from "@contact-keeper/auth-ui";
import { ContactList, ContactForm, Contact } from "@contact-keeper/contacts-ui";
import "./styles.css";

export function App() {
  const { user, checkAuth, logout, isLoading } = useAuthStore();
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading && !user) {
    return <div className="loading">Initializing...</div>;
  }

  if (!user) {
    return (
      <div className="auth-container">
        <div className="card">
          <h1 className="title" style={{ textAlign: "center" }}>{showSignup ? "Create Account" : "Welcome Back"}</h1>
          <p className="subtitle" style={{ textAlign: "center" }}>
            {showSignup ? "Join Contact Keeper today" : "Sign in to manage your contacts"}
          </p>
          
          {showSignup ? (
             <>
               <SignupForm />
               <p style={{ textAlign: "center", marginTop: "1.5rem", color: "var(--text-muted)" }}>
                 Already have an account?{" "}
                 <button onClick={() => setShowSignup(false)} style={{ background: "none", border: "none", color: "var(--primary)", cursor: "pointer", fontWeight: 600 }}>
                   Login
                 </button>
               </p>
             </>
          ) : (
            <>
              <LoginForm />
              <p style={{ textAlign: "center", marginTop: "1.5rem", color: "var(--text-muted)" }}>
                Don&apos;t have an account?{" "}
                <button onClick={() => setShowSignup(true)} style={{ background: "none", border: "none", color: "var(--primary)", cursor: "pointer", fontWeight: 600 }}>
                  Sign up
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <nav className="navbar">
        <a href="#" className="logo">Contact Keeper</a>
        <div className="nav-links">
          <span>Hello, <strong>{user.username}</strong></span>
          <button onClick={logout} className="btn btn-outline" style={{ padding: "0.5rem 1rem" }}>Logout</button>
        </div>
      </nav>

      <main className="main-grid">
        <aside>
          <ContactForm 
            currentContact={currentContact} 
            onSuccess={() => setCurrentContact(null)} 
          />
        </aside>

        <section>
          <h2 className="title" style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>Your Contacts</h2>
          <ContactList onEdit={(contact) => setCurrentContact(contact)} />
        </section>
      </main>
    </div>
  );
}

