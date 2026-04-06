import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Chat from './pages/Chat';
import Laws from './pages/Laws';
import Lawyers from './pages/Lawyers';
import Templates from './pages/Templates';
import Calculators from './pages/Calculators';
import SOS from './pages/SOS';
import Profile from './pages/Profile';
import { useAuthStore } from './store/authStore';

import { useEffect } from 'react';
import { onAuthStateChanged, getRedirectResult } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

function AuthObserver() {
  const navigate = useNavigate();

  useEffect(() => {
    getRedirectResult(auth).then(async (result) => {
      if (result?.user) {
        await ensureUserProfile(result.user);
        navigate('/chat');
      }
    }).catch((error) => {
      console.error("Redirect result error:", error);
    });

    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        await ensureUserProfile(user);
      }
    });
  }, []);

  return null;
}

// Redirect authenticated users away from login page
function RedirectIfAuthenticated({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthStore();
  if (loading) return null;
  if (user) return <Navigate to="/chat" replace />;
  return <>{children}</>;
}

async function ensureUserProfile(user: any) {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        email: user.email,
        full_name: user.displayName || '',
        role: 'user',
        language: 'kk',
        is_active: true,
        created_at: serverTimestamp(),
        last_login: serverTimestamp()
      });
    } else {
      await setDoc(userRef, { last_login: serverTimestamp() }, { merge: true });
    }
  } catch (error) {
    console.error("Error ensuring user profile:", error);
  }
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthObserver />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<RedirectIfAuthenticated><Login /></RedirectIfAuthenticated>} />
        <Route element={<Layout />}>
          <Route path="chat" element={<Chat />} />
          <Route path="chat/:sessionId" element={<Chat />} />
          <Route path="laws" element={<Laws />} />
          <Route path="lawyers" element={<Lawyers />} />
          <Route path="templates" element={<Templates />} />
          <Route path="calculators" element={<Calculators />} />
          <Route path="sos" element={<SOS />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
