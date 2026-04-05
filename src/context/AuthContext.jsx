import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ── Fetch profile from profiles table ── */
  const fetchProfile = async (authUser) => {
    if (!authUser) { setUser(null); return null; }
    const { data, error } = await supabase
      .from('profiles')
      .select('name, email, role')
      .eq('id', authUser.id)
      .single();
    
    // Merge DB profile with authUser metadata
    const meta = authUser.user_metadata || {};
    
    if (data) {
      const profile = { 
        id: authUser.id, 
        name: data.name, 
        email: data.email, 
        role: data.role,
        age: meta.age || '',
        level: meta.level || '',
        goal: meta.goal || ''
      };
      setUser(profile);
      return profile;
    }
    if (error) console.error('[fetchProfile] DB query failed:', error.message);
    // Fallback to auth metadata
    const fallback = {
      id: authUser.id,
      name: meta.name || '',
      email: authUser.email,
      role: meta.role || 'user',
      age: meta.age || '',
      level: meta.level || '',
      goal: meta.goal || ''
    };
    setUser(fallback);
    return fallback;
  };

  /* ── Init: check existing session ── */
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) fetchProfile(session.user);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) fetchProfile(session.user).then(() => setLoading(false));
      else { setUser(null); setLoading(false); }
    });

    return () => subscription.unsubscribe();
  }, []);

  /* ── Login ── */
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    // Update last_login
    await supabase.from('profiles').update({ last_login: new Date().toISOString() }).eq('id', data.user.id);
    const profile = await fetchProfile(data.user);
    return { ok: true, role: profile?.role || 'user' };
  };

  /* ── Register ── */
  const register = async (name, email, password, meta = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, role: 'user', ...meta } },
    });
    if (error) return { error: error.message };
    if (data.user) await fetchProfile(data.user);
    return { ok: true };
  };

  /* ── Logout ── */
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  /* ── Update profile metadata ── */
  const updateProfileMeta = async (updates) => {
    if (!user) return { error: 'Not logged in' };
    const { data, error } = await supabase.auth.updateUser({ data: updates });
    if (error) return { error: error.message };
    
    // Also update name in profiles table if it's there
    if (updates.name) {
      await supabase.from('profiles').update({ name: updates.name }).eq('id', user.id);
    }
    
    if (data.user) await fetchProfile(data.user);
    return { ok: true };
  };

  /* ── Update name ── */
  const updateName = async (newName) => {
    return updateProfileMeta({ name: newName });
  };

  /* ── Change password ── */
  const changePassword = async (newPassword) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { error: error.message };
    return { ok: true };
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateName, updateProfileMeta, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
