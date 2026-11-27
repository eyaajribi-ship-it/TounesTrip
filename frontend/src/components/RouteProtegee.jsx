import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function RouteProtegee({ children }) {
  const { utilisateur } = useAuth();
  const message = sessionStorage.getItem('messageConnexion') || 'Connecte-toi pour accéder à cette page.';
  return utilisateur ? children : <Navigate to="/connexion" state={{ message }} replace />;
}
