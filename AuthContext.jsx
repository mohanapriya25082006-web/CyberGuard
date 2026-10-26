import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('cyberguard_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (authResponse) => {
    const { token, fullName, email } = authResponse;
    localStorage.setItem('cyberguard_token', token);
    localStorage.setItem('cyberguard_user', JSON.stringify({ fullName, email }));
    setUser({ fullName, email });
  };

  const logout = () => {
    localStorage.removeItem('cyberguard_token');
    localStorage.removeItem('cyberguard_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
