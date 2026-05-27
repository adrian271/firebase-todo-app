import { useState } from "react";
import { AuthProvider, useAuth } from "./auth/AuthProvider";
import { SignInScreen } from "./auth/SignInScreen";
import { friendlyAuthError } from "./auth/errorMessages";

export function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

function AppRoutes() {
  const { status } = useAuth();

  if (status === "loading") return <LoadingScreen />;
  if (status === "signed-out") return <SignInScreen />;
  return <SignedInHome />;
}

function LoadingScreen() {
  return (
    <div style={s.loading}>
      <p style={s.loadingText}>restoring session…</p>
    </div>
  );
}

function SignedInHome() {
  const { user, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSignOut = async () => {
    setError(null);
    setSigningOut(true);
    try {
      await signOut();
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div style={s.shell}>
      <header style={s.header}>
        <h1 style={s.title}>Firebase To-Do</h1>
        <div style={s.email}>
          {user?.email ?? (
            <span style={s.uidMono}>{user?.uid.slice(0, 8)}</span>
          )}
        </div>
        <button
          onClick={onSignOut}
          disabled={signingOut}
          style={s.signOutBtn}
        >
          {signingOut ? "…" : "Sign out"}
        </button>
      </header>

      <div style={s.body}>
        <p style={s.bodyP}>You're signed in. The to-do UI lands in the next phase.</p>
        {error && <p style={s.error}>{error}</p>}
        <p style={s.uid}>
          uid: <code style={s.mono}>{user?.uid}</code>
        </p>
      </div>
    </div>
  );
}

const s = {
  loading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    color: "#5a6473",
  } as const,
  loadingText: {
    fontSize: 12,
    fontFamily: "'Geist Mono', monospace",
    margin: 0,
  } as const,
  shell: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    padding: "24px 28px",
    gap: 14,
    color: "#e8ecf3",
  } as const,
  header: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    paddingBottom: 12,
    borderBottom: "1px solid #252b35",
  } as const,
  title: { fontSize: 18, fontWeight: 600, margin: 0, flex: 1 } as const,
  email: { fontSize: 12, color: "#8a93a3" } as const,
  uidMono: { fontFamily: "'Geist Mono', monospace" } as const,
  signOutBtn: {
    padding: "5px 10px",
    borderRadius: 5,
    fontSize: 12,
    border: "1px solid #252b35",
    background: "#1a1f28",
    color: "#e8ecf3",
    font: "inherit",
    cursor: "pointer",
  } as const,
  body: { fontSize: 12, color: "#8a93a3", lineHeight: 1.6 } as const,
  bodyP: { margin: 0 } as const,
  error: { color: "#fca5a5", marginTop: 6 } as const,
  uid: { marginTop: 12, color: "#5a6473", fontSize: 11 } as const,
  mono: { fontFamily: "'Geist Mono', monospace" } as const,
};
