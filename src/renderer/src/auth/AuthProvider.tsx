import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  type User,
} from "firebase/auth";
import { auth } from "../firebase";

type Status = "loading" | "signed-in" | "signed-out";

interface AuthContextValue {
  user: User | null;
  status: Status;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setStatus(u ? "signed-in" : "signed-out");
    });
    return unsub;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      signIn: async (email, password) => {
        await signInWithEmailAndPassword(auth, email, password);
      },
      signUp: async (email, password) => {
        await createUserWithEmailAndPassword(auth, email, password);
      },
      signOut: async () => {
        await fbSignOut(auth);
      },
      // Real OAuth in Electron needs a main-process URL-scheme handler +
      // signInWithCredential. Stubbed for now; SignInScreen will route this
      // through friendlyAuthError.
      signInWithGoogle: async () => {
        throw new Error("Google sign-in coming in a follow-up phase.");
      },
      signInWithApple: async () => {
        throw new Error("Apple sign-in coming in a follow-up phase.");
      },
    }),
    [user, status],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
