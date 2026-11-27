import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [utilisateur, setUtilisateur] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('utilisateur'));
    } catch {
      return null;
    }
  });

  useEffect(() => {
    function gererExpiration() {
      setUtilisateur(null);
    }
    window.addEventListener('session-expiree', gererExpiration);
    return () => window.removeEventListener('session-expiree', gererExpiration);
  }, []);

  function connecter(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('utilisateur', JSON.stringify(user));
    setUtilisateur(user);
  }

  function modifierUtilisateur(user) {
    localStorage.setItem('utilisateur', JSON.stringify(user));
    setUtilisateur(user);
  }

  function deconnecter() {
    localStorage.removeItem('token');
    localStorage.removeItem('utilisateur');
    setUtilisateur(null);
  }

  return (
    <AuthContext.Provider value={{ utilisateur, connecter, modifierUtilisateur, deconnecter }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
