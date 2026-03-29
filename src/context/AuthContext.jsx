import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

/* ── Seed default admin on first load ── */
function seedAdmin() {
  const users = JSON.parse(localStorage.getItem('nihon_users') || '[]');
  if (!users.find(u => u.email === 'admin@nihongo.com')) {
    users.unshift({
      name: 'Admin',
      email: 'admin@nihongo.com',
      password: 'Admin@123',
      role: 'admin',
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem('nihon_users', JSON.stringify(users));
  }
}
seedAdmin();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('nihon_user')); }
    catch { return null; }
  });

  const register = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('nihon_users') || '[]');
    if (users.find(u => u.email === email)) return { error: 'Email already registered' };
    const newUser = { name, email, password, role: 'user', createdAt: new Date().toISOString() };
    users.push(newUser);
    localStorage.setItem('nihon_users', JSON.stringify(users));
    const session = { name, email, role: 'user' };
    localStorage.setItem('nihon_user', JSON.stringify(session));
    setUser(session);
    return { ok: true };
  };

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('nihon_users') || '[]');
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) return { error: 'Invalid email or password' };
    /* update lastLogin */
    found.lastLogin = new Date().toISOString();
    localStorage.setItem('nihon_users', JSON.stringify(users));
    const session = { name: found.name, email: found.email, role: found.role || 'user' };
    localStorage.setItem('nihon_user', JSON.stringify(session));
    setUser(session);
    return { ok: true, role: session.role };
  };

  const logout = () => {
    localStorage.removeItem('nihon_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
