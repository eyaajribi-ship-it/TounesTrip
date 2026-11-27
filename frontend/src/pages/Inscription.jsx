import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../AuthContext';

export default function Inscription() {
  const [form, setForm] = useState({ nom: '', email: '', motDePasse: '', confirm: '' });
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);
  const { connecter } = useAuth();
  const navigate = useNavigate();

  async function envoyer(e) {
    e.preventDefault();
    setErreur('');
    if (form.motDePasse !== form.confirm) {
      setErreur('Les mots de passe ne correspondent pas.');
      return;
    }
    setChargement(true);
    try {
      await api.inscription(form.nom, form.email, form.motDePasse);
      const authRep = await api.connexion(form.email, form.motDePasse);
      connecter(authRep.token, authRep.utilisateur);
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
            Crée ton compte gratuitement pour générer et sauvegarder tes itinéraires personnalisés.
          </p>
          <div className="badges">
            <span>24 gouvernorats</span>
            <span>1 à 14 jours</span>
            <span>Matin · Après-midi · Soir</span>
          </div>
        </div>

        <form className="carte auth-form" onSubmit={envoyer}>
          <h2>Créer un compte</h2>
          <p className="discret form-sous-titre">Crée ton compte en quelques secondes.</p>
          <label>
            Nom
            <input
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              required
            />
          </label>
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
              value={form.motDePasse}
              onChange={(e) => setForm({ ...form, motDePasse: e.target.value })}
              required
              minLength={8}
            />
          </label>
          <label>
            Confirmer le mot de passe
            <input
              type="password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              required
              minLength={8}
            />
          </label>
          {erreur && <p className="erreur" role="alert">{erreur}</p>}
          <button className="bouton" disabled={chargement}>
            {chargement ? 'Inscription...' : "S'inscrire"}
          </button>
          <Link to="/connexion" className="lien">Déjà un compte ? Connecte-toi</Link>
        </form>
      </section>
    </div>
  );
}
