import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Navbar() {
  const { utilisateur, deconnecter } = useAuth();
  const navigate = useNavigate();

  function handleDeconnexion() {
    deconnecter();
    navigate('/connexion');
  }

  return (
    <header className="entete">
      <Link to="/" className="logo">✈ TounesTrip</Link>

      <nav>
        <NavLink to="/offres" className={({ isActive }) => (isActive ? 'onglet actif' : 'onglet')}>
          Offres
        </NavLink>
      </nav>

      {utilisateur && <nav>
          <NavLink to="/preferences" className={({ isActive }) => (isActive ? 'onglet actif' : 'onglet')}>
            Planifier
          </NavLink>
          <NavLink to="/programmes" className={({ isActive }) => (isActive ? 'onglet actif' : 'onglet')}>
            Mes programmes
          </NavLink>
          <NavLink to="/reservations" className={({ isActive }) => (isActive ? 'onglet actif' : 'onglet')}>
            Mes réservations
          </NavLink>
          <NavLink to="/chatbot" className={({ isActive }) => (isActive ? 'onglet actif' : 'onglet')}>
            Guide touristique
          </NavLink>
          {utilisateur && <>
            <NavLink to="/statistiques" className={({ isActive }) => (isActive ? 'onglet actif' : 'onglet')}>
              Statistiques
            </NavLink>
            <NavLink to="/profil" className={({ isActive }) => (isActive ? 'onglet actif' : 'onglet')}>
              Mon profil
            </NavLink>
          </>}
      </nav>}

      <div className="utilisateur">
        {utilisateur ? (
          <>
            <button type="button" className="lien" onClick={handleDeconnexion}>
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link to="/connexion" className="lien">Connexion</Link>
            <Link to="/inscription" className="lien">Inscription</Link>
          </>
        )}
      </div>
    </header>
  );
}
