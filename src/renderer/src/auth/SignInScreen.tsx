import { useState, type FormEvent } from "react";
import { useAuth } from "./AuthProvider";
import { friendlyAuthError } from "./errorMessages";

type Mode = "sign-in" | "sign-up";

export function SignInScreen() {
  const { signIn, signUp, signInWithGoogle, signInWithApple } = useAuth();
  const [mode, setMode] = useState<Mode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === "sign-in") await signIn(email, password);
      else await signUp(email, password);
      // No navigation — AuthProvider flips status; App.tsx unmounts this.
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const onOAuth = async (which: "google" | "apple") => {
    setError(null);
    try {
      if (which === "google") await signInWithGoogle();
      else await signInWithApple();
    } catch (err) {
      setError(friendlyAuthError(err));
    }
  };

  const toggleMode = () => {
    setMode(mode === "sign-in" ? "sign-up" : "sign-in");
    setError(null);
  };

  return (
    <div style={s.shell}>
      <div style={s.card}>
        <h1 style={s.title}>Firebase To-Do</h1>
        <p style={s.subtitle}>
          {mode === "sign-in" ? "Sign in to your account" : "Create an account"}
        </p>

        <form onSubmit={onSubmit} style={s.form}>
          <label style={s.label}>
            Email
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              style={s.input}
            />
          </label>

          <label style={s.label}>
            Password
            <input
              type="password"
              autoComplete={
                mode === "sign-in" ? "current-password" : "new-password"
              }
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              style={s.input}
            />
          </label>

          {error && <div style={s.error}>{error}</div>}

          <button type="submit" disabled={submitting} style={s.primaryBtn}>
            {submitting
              ? "…"
              : mode === "sign-in"
                ? "Sign in"
                : "Create account"}
          </button>
        </form>

        <div style={s.divider}>
          <span style={s.dividerLine} />
          <span style={s.dividerText}>or</span>
          <span style={s.dividerLine} />
        </div>

        <button
          type="button"
          onClick={() => onOAuth("google")}
          disabled={submitting}
          style={s.oauthBtn}
        >
          Continue with Google
        </button>
        <button
          type="button"
          onClick={() => onOAuth("apple")}
          disabled={submitting}
          style={s.oauthBtn}
        >
          Continue with Apple
        </button>

        <div style={s.toggle}>
          {mode === "sign-in"
            ? "Don't have an account?"
            : "Already have an account?"}
          <button type="button" onClick={toggleMode} style={s.toggleBtn}>
            {mode === "sign-in" ? "Sign up" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}

const s = {
  shell: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    padding: 24,
    background: "#0f1216",
  } as const,
  card: {
    width: 360,
    padding: "28px 28px 22px",
    background: "#13171e",
    borderRadius: 12,
    border: "1px solid #252b35",
    boxShadow: "0 8px 24px rgba(0,0,0,.4)",
    display: "flex",
    flexDirection: "column",
    gap: 14,
  } as const,
  title: {
    margin: 0,
    fontSize: 20,
    fontWeight: 600,
    color: "#e8ecf3",
  } as const,
  subtitle: { margin: 0, fontSize: 13, color: "#8a93a3" } as const,
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginTop: 6,
  } as const,
  label: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    fontSize: 11,
    fontWeight: 500,
    color: "#8a93a3",
    letterSpacing: ".02em",
    textTransform: "uppercase",
  } as const,
  input: {
    padding: "8px 10px",
    borderRadius: 6,
    border: "1px solid #252b35",
    background: "#0b0e12",
    color: "#e8ecf3",
    font: "inherit",
    fontSize: 13,
    outline: "none",
  } as const,
  error: {
    padding: "8px 10px",
    borderRadius: 6,
    background: "rgba(239,68,68,.12)",
    color: "#fca5a5",
    fontSize: 12,
    lineHeight: 1.4,
  } as const,
  primaryBtn: {
    padding: "9px 12px",
    borderRadius: 6,
    border: 0,
    background: "#5b9bff",
    color: "#0a0d12",
    font: "inherit",
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
    marginTop: 4,
  } as const,
  divider: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    margin: "4px 0",
    color: "#5a6473",
    fontSize: 11,
  } as const,
  dividerLine: { flex: 1, height: 1, background: "#252b35" } as const,
  dividerText: { fontFamily: "'Geist Mono', monospace" } as const,
  oauthBtn: {
    padding: "8px 12px",
    borderRadius: 6,
    border: "1px solid #252b35",
    background: "#1a1f28",
    color: "#e8ecf3",
    font: "inherit",
    fontSize: 13,
    cursor: "pointer",
    textAlign: "center",
  } as const,
  toggle: {
    fontSize: 12,
    color: "#8a93a3",
    textAlign: "center",
    marginTop: 8,
  } as const,
  toggleBtn: {
    background: "none",
    border: 0,
    color: "#5b9bff",
    font: "inherit",
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    marginLeft: 4,
    padding: 0,
  } as const,
};
