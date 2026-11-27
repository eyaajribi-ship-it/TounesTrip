import { useEffect, useState } from 'react';
import { api } from '../api';

const descriptions = {
  tunis: 'Médina historique et patrimoine urbain, avec les Côtes de Carthage à proximité.',
  djerba: 'Île méditerranéenne connue pour ses plages, son patrimoine et les activités de plein air.',
  hammamet: 'Station balnéaire appréciée pour ses plages, sa médina et son port de plaisance.',
  sousse: 'Une destination côtière qui associe plages, médina historique et monuments médiévaux.',
  tozeur: 'Oasis et palmeraies aux portes du Sahara, avec des excursions vers les paysages du Jérid.',
  'sidi bou said': 'Village bleu et blanc perché au-dessus de la mer, près de Tunis et de Carthage.',
  carthage: 'Site historique antique situé près de Tunis, sur les Côtes de Carthage.',
  monastir: 'Destination côtière connue pour ses plages, ses monuments et sa marina.',
  kairouan: 'Ville historique avec sa médina, la Grande Mosquée et les bassins des Aghlabides.',
  mahdia: 'Ville côtière avec une médina sur une presqu’île et de longues plages.',
  nabeul: 'Ville du Cap Bon réputée pour son artisanat et ses plages.',
  'el jem': 'Étape culturelle célèbre pour son amphithéâtre romain.',
};

const normaliser = (texte) => texte
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase();

const formatNombre = (valeur) =>
  new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(Number(valeur) || 0);

export default function Statistiques() {
  const [statistiques, setStatistiques] = useState(null);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    api.lireStatistiques()
      .then(setStatistiques)
      .catch((err) => setErreur(err.message));
  }, []);

  if (!statistiques) {
    return <p className={erreur ? 'erreur' : 'discret'} role={erreur ? 'alert' : undefined}>{erreur || 'Chargement des statistiques...'}</p>;
  }

  const { totaux, destinations } = statistiques;

  return (
    <section className="statistiques">
      <header className="statistiques-entete">
        <h1>Statistiques des destinations</h1>
        <p className="discret">
          Classement calculé à partir de tous les programmes sauvegardés sur TounesTrip.
          Il indique les destinations planifiées par les utilisateurs, pas les visites réelles.
        </p>
      </header>

      <div className="statistiques-grille">
        <article className="carte statistique-carte">
          <span className="statistique-libelle">Voyages sauvegardés</span>
          <strong>{formatNombre(totaux.nombreProgrammes)}</strong>
        </article>
        <article className="carte statistique-carte">
          <span className="statistique-libelle">Destinations planifiées</span>
          <strong>{formatNombre(totaux.nombreDestinations)}</strong>
        </article>
        <article className="carte statistique-carte">
          <span className="statistique-libelle">Jours planifiés</span>
          <strong>{formatNombre(totaux.joursPlanifies)}</strong>
        </article>
        <article className="carte statistique-carte">
          <span className="statistique-libelle">Budget moyen par voyage</span>
          <strong>{formatNombre(totaux.budgetMoyen)} TND</strong>
        </article>
      </div>

      <section className="carte statistiques-destinations">
        <h2>Les destinations les plus planifiées</h2>
        {destinations.length === 0 ? (
          <p className="discret">Les destinations apparaîtront ici quand des utilisateurs auront sauvegardé leurs voyages.</p>
        ) : (
          <ol className="statistiques-liste-lieux">
            {destinations.map((lieu, index) => {
              const nomNormalise = normaliser(lieu.destination);
              const description = descriptions[nomNormalise] || 'Une destination tunisienne proposée dans les programmes de voyage.';
              const part = totaux.nombreProgrammes
                ? (lieu.nombreProgrammes / totaux.nombreProgrammes) * 100
                : 0;

              return (
                <li className="statistique-lieu" key={lieu.destination}>
                  <div className="statistique-lieu-tete">
                    <span className="statistique-rang">{index + 1}</span>
                    <div className="statistique-lieu-titre">
                      <h3>{lieu.destination}</h3>
                      <span className="discret">{formatNombre(lieu.nombreProgrammes)} voyage{lieu.nombreProgrammes > 1 ? 's' : ''} · {part.toFixed(0)} %</span>
                    </div>
                  </div>
                  <p>{description}</p>
                  <div className="statistique-barre-fond" aria-label={`${part.toFixed(0)} % des voyages sauvegardés`}>
                    <div className="statistique-barre" style={{ width: `${part}%` }} />
                  </div>
                  <p className="statistique-lieu-meta discret">
                    Budget moyen : {formatNombre(lieu.budgetMoyen)} TND · Durée moyenne : {formatNombre(lieu.dureeMoyenne)} jours
                  </p>
                </li>
              );
            })}
          </ol>
        )}
      </section>
    </section>
  );
}
