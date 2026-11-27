import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../AuthContext';

export default function Connexion() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);
  const { connecter } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [messageConnexion] = useState(() => location.state?.message || sessionStorage.getItem('messageConnexion') || '');

  useEffect(() => { sessionStorage.removeItem('messageConnexion'); }, []);

  async function envoyer(e) {
    e.preventDefault();
    setErreur('');
    setChargement(true);
    try {
      const rep = await api.connexion(form.email, form.password);
      connecter(rep.token, rep.utilisateur);
      const reservationEnAttente = sessionStorage.getItem('reservationOffre');
      if (reservationEnAttente) {
        try {
          const choix = JSON.parse(reservationEnAttente);
          const resultat = await api.reserverOffre(choix.offreId, choix.departId, choix.nombreVoyageurs);
          sessionStorage.removeItem('reservationOffre');
          navigate('/reservations', { state: { confirmation: `Réservation confirmée : ${resultat.reservation.prix_total.toLocaleString('fr-FR')} TND, à régler sur place.` } });
        } catch (reservationErreur) {
          sessionStorage.removeItem('reservationOffre');
          navigate('/offres', { state: { reservationErreur: reservationErreur.message } });
        }
      } else {
        navigate('/preferences');
      }
    } catch (err) {
      setErreur(err.message);
    } finally {
      setChargement(false);
    }
  }

  return (
    <div className="auth-fond">
      <section className="auth">
        <div className="auth-intro">
          <h1>TounesTrip</h1>
          <p className="accroche">Découvre la Tunisie, un jour à la fois.</p>
          <p className="sous-accroche">
            Dis-nous où tu vas, combien de temps et ton budget. On s'occupe du reste.
          </p>
          <div className="badges">
            <span>24 gouvernorats</span>
            <span>1 à 14 jours</span>
            <span>Matin · Après-midi · Soir</span>
          </div>
        </div>

        <form className="carte auth-form" onSubmit={envoyer} autoComplete="off">
          <h2>Connexion</h2>
          <p className="discret form-sous-titre">Content de te revoir.</p>
          {messageConnexion && <p className="succes" role="status">{messageConnexion}</p>}
          <label>
            E-mail
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </label>
          <label>
            Mot de passe
            <input
              type="password"
              autoComplete="off"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
            />
          </label>
          {erreur && <p className="erreur" role="alert">{erreur}</p>}
          <button className="bouton" disabled={chargement}>
            {chargement ? 'Un instant...' : 'Se connecter'}
          </button>
          <Link to="/inscription" className="lien">Pas de compte ? Inscris-toi</Link>
        </form>
      </section>
    </div>
  );
}
