import { Link } from 'react-router-dom';

export default function Accueil() {
  return (
    <div className="accueil-page">
      <section className="bandeau accueil-bandeau">
        <h1>Bienvenue sur TounesTrip</h1>
        <p>Découvre la Tunisie, un jour à la fois.</p>
        <div className="badges accueil-badges">
          <span>24 gouvernorats</span>
          <span>1 à 14 jours</span>
          <span>Matin · Après-midi · Soir</span>
        </div>
      </section>

      <section className="carte accueil-carte">
        <h2>Prépare ton voyage en Tunisie</h2>
        <p className="discret accueil-texte">
          Crée un compte ou connecte-toi pour saisir tes préférences, préparer ton programme
          et consulter le guide touristique.
        </p>
        <div className="actions">
          <Link className="bouton" to="/inscription">S’inscrire</Link>
          <Link className="bouton secondaire" to="/connexion">Se connecter</Link>
          <Link className="bouton secondaire" to="/offres">Voir les offres</Link>
        </div>
      </section>
    </div>
  );
}
