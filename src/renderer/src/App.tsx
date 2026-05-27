import { useEffect, useState } from 'react';
import { auth, db } from './firebase';
import { signInAnonymously, onAuthStateChanged, type User } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';

type Health = {
  authReady: boolean;
  firestoreReady: boolean;
  uid: string | null;
  error: string | null;
};

export function App() {
  const [health, setHealth] = useState<Health>({
    authReady: false,
    firestoreReady: false,
    uid: null,
    error: null,
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user: User | null) => {
      setHealth((h) => ({ ...h, authReady: true, uid: user?.uid ?? null }));
    });

    // Smoke-test emulator: anonymous sign-in + one read.
    (async () => {
      try {
        await signInAnonymously(auth);
        await getDocs(collection(db, 'projects'));
        setHealth((h) => ({ ...h, firestoreReady: true }));
      } catch (e) {
        setHealth((h) => ({ ...h, error: (e as Error).message }));
      }
    })();

    return () => unsub();
  }, []);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      padding: '24px 28px', gap: 12, color: '#e8ecf3',
    }}>
      <h1 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Firebase To-Do</h1>
      <p style={{ fontSize: 12, color: '#8a93a3', margin: 0 }}>
        Scaffold smoke-test. UI port lands next.
      </p>
      <ul style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, lineHeight: 1.7, listStyle: 'none', padding: 0, margin: '12px 0 0' }}>
        <li>auth.ready: <Pill ok={health.authReady} /></li>
        <li>firestore.ready: <Pill ok={health.firestoreReady} /></li>
        <li>uid: {health.uid ?? <span style={{ color: '#5a6473' }}>—</span>}</li>
        {health.error && (
          <li style={{ color: '#f87171' }}>error: {health.error}</li>
        )}
      </ul>
      {!health.firestoreReady && !health.error && (
        <p style={{ fontSize: 11, color: '#5a6473', marginTop: 12 }}>
          If this hangs: run <code style={{ background: '#1a1f28', padding: '1px 5px', borderRadius: 3 }}>npm run emulators</code> in another terminal.
        </p>
      )}
    </div>
  );
}

function Pill({ ok }: { ok: boolean }) {
  return (
    <span style={{
      display: 'inline-block', padding: '0 6px', borderRadius: 3,
      fontSize: 10, fontWeight: 600, marginLeft: 4,
      background: ok ? 'rgba(132,204,22,.18)' : 'rgba(163,163,163,.15)',
      color: ok ? '#bef264' : '#a3a3a3',
    }}>{ok ? 'OK' : '…'}</span>
  );
}
