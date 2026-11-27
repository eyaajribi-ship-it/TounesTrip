import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { api } from '../api';

const OFFRES = [
  {
    id: 'hammamet', destination: 'Hammamet & Nabeul', region: 'Cap Bon', categorie: 'Plage', duree: 3, nuits: 2,
    prixAvant: 399, prix: 329, hotel: 'Dar Sabri', typeHotel: 'Maison d’hôtes', prixNuit: 180,
    inclus: ['Hébergement avec petit-déjeuner', 'Transferts locaux', 'Visites de Hammamet et Nabeul'],
    jours: ['Médina et remparts de Hammamet', 'Plage et ateliers de poterie à Nabeul', 'Marché local et temps libre'],
    description: 'Un court séjour entre mer, artisanat et douceur de vivre au Cap Bon.',
  },
  {
    id: 'djerba', destination: 'Djerba, l’île aux rêves', region: 'Médenine', categorie: 'Plage', duree: 4, nuits: 3,
    prixAvant: 529, prix: 449, hotel: 'Dar Bibine', typeHotel: 'Maison d’hôtes', prixNuit: 180,
    inclus: ['Hébergement avec petit-déjeuner', 'Découverte de Houmt Souk', 'Djerbahood et musée de Guellala'],
    jours: ['Arrivée et découverte de Houmt Souk', 'Djerbahood et village d’Erriadh', 'Guellala et détente à la plage', 'Marché et départ'],
    description: 'Un séjour insulaire mêlant plages, villages djerbiens et patrimoine.',
  },
  {
    id: 'tunis', destination: 'Tunis, Carthage & Sidi Bou Saïd', region: 'Grand Tunis', categorie: 'Culture', duree: 3, nuits: 2,
    prixAvant: 679, prix: 579, hotel: 'Dar El Jeld Hotel & Spa', typeHotel: 'Hôtel boutique', prixNuit: 350,
    inclus: ['Hébergement avec petit-déjeuner', 'Visites de la médina et de Carthage', 'Excursion à Sidi Bou Saïd'],
    jours: ['Médina de Tunis et souks', 'Carthage et Sidi Bou Saïd', 'Musée du Bardo et départ'],
    description: 'Trois jours de découvertes entre histoire, architecture et cafés en bord de mer.',
  },
  {
    id: 'sahara', destination: 'Tozeur & portes du Sahara', region: 'Sud tunisien', categorie: 'Aventure', duree: 5, nuits: 4,
    prixAvant: 899, prix: 749, hotel: 'Dar Tozeur', typeHotel: 'Maison d’hôtes', prixNuit: 220,
    inclus: ['Hébergement avec petit-déjeuner', 'Oasis et vieille ville de Tozeur', 'Excursion à Chebika et au Chott el-Jérid'],
    jours: ['Arrivée et médina de Tozeur', 'Palmeraie et oasis', 'Chebika et paysages de montagne', 'Chott el-Jérid et Douz', 'Temps libre et départ'],
    description: 'Une escapade au sud pour explorer les oasis, les paysages minéraux et le désert.',
  },
];

const CATEGORIES = ['Toutes', 'Plage', 'Culture', 'Aventure'];
const destinationsPlanificateur = { hammamet: 'Hammamet', djerba: 'Djerba', tunis: 'Tunis', sahara: 'Tozeur' };
const stylesPlanificateur = { Plage: 'Plage & Détente', Culture: 'Culture & Patrimoine', Aventure: 'Sahara & Aventure' };

function remise(offre) {
  return Math.round((1 - offre.prix / offre.prixAvant) * 100);
}

export default function Offres() {
  const [categorie, setCategorie] = useState('Toutes');
  const [detailOuvert, setDetailOuvert] = useState(null);
  const [reservationEnCours, setReservationEnCours] = useState(null);
  const [offresEnregistrees, setOffresEnregistrees] = useState({});
  const [erreurReservation, setErreurReservation] = useState('');
  const { utilisateur } = useAuth();
  const navigate = useNavigate();
  const offresAffichees = categorie === 'Toutes' ? OFFRES : OFFRES.filter((offre) => offre.categorie === categorie);

  async function enregistrerOffre(offre) {
    setErreurReservation('');
    setReservationEnCours(offre.id);
    const destination = destinationsPlanificateur[offre.id];
    const nombrePersonnes = 2;
    const budget = offre.prix * nombrePersonnes;
    const budgetHebergement = offre.prixNuit * offre.nuits;
    const totalActivites = budget - budgetHebergement;
    const centimesActivites = Math.round(totalActivites * 100);
    const coutBase = Math.floor(centimesActivites / offre.duree);
    const resteCentimes = centimesActivites - coutBase * offre.duree;
    const jours = offre.jours.map((resume, index) => ({
      jour: index + 1,
      titre: resume,
      matin: resume,
      apresMidi: 'Découverte et activités prévues dans le forfait.',
      soir: 'Temps libre et nuit à l’hébergement conseillé.',
      coutEstime: (coutBase + (index < resteCentimes ? 1 : 0)) / 100,
    }));
    const programme = {
      titre: `Offre ${offre.destination} · ${offre.duree} jours`,
      destination,
      duree: offre.duree,
      nbJours: offre.duree,
      niveau: 'Séjour organisé',
      style: stylesPlanificateur[offre.categorie],
      budget,
      nombrePersonnes,
      budgetParPersonne: offre.prix,
      moteur: 'Forfait TounesTrip',
      totalActivites,
      totalEstime: budget,
      resteBudget: 0,
      hebergement: {
        nom: offre.hotel,
        type: offre.typeHotel,
        prixParNuit: offre.prixNuit,
        description: `${offre.nuits} nuits · hébergement inclus dans le forfait affiché, disponibilité à confirmer.`,
        lien: '',
        nombreChambres: 1,
        nbNuits: offre.nuits,
        totalEstime: budgetHebergement,
      },
      jours,
      sources: [],
    };

    try {
      const resultat = await api.sauvegarderProgramme(programme);
      setOffresEnregistrees((courant) => ({ ...courant, [offre.id]: resultat.programme?.id || true }));
      sessionStorage.removeItem('reservationOffre');
    } catch (erreur) {
      setErreurReservation(erreur.message);
    } finally {
      setReservationEnCours(null);
    }
  }

  useEffect(() => {
    if (!utilisateur) return;
    const offreEnAttente = sessionStorage.getItem('reservationOffre');
    if (!offreEnAttente) return;
    sessionStorage.removeItem('reservationOffre');
    const offre = OFFRES.find((item) => item.id === offreEnAttente);
    if (offre) {
      setDetailOuvert(offre.id);
      enregistrerOffre(offre);
    } else {
      sessionStorage.removeItem('reservationOffre');
    }
  }, [utilisateur]);

  function preparerSejour(offre) {
    sessionStorage.setItem('offreChoisie', JSON.stringify({
      destination: destinationsPlanificateur[offre.id],
      days: offre.duree,
      nombrePersonnes: 2,
      budget: offre.prix * 2,
      style: stylesPlanificateur[offre.categorie],
    }));
    navigate(utilisateur ? '/preferences' : '/connexion');
  }

  function reserver(offre) {
    if (!utilisateur) {
      sessionStorage.setItem('reservationOffre', offre.id);
      navigate('/connexion');
      return;
    }
    enregistrerOffre(offre);
  }

  return (
    <div className="page-offres">
      <section className="bandeau">
        <p className="offres-surtitre">TounesTrip · Séjours à thème</p>
        <h1>Nos offres en Tunisie</h1>
        <p>Des idées de séjours organisés pour découvrir le pays en toute simplicité.</p>
      </section>

      <div className="offres-filtres" aria-label="Filtrer les offres par style">
        {CATEGORIES.map((item) => (
          <button key={item} type="button" className={'bouton filtre-offre' + (categorie === item ? ' selectionne' : '')} onClick={() => setCategorie(item)}>
            {item}
          </button>
        ))}
      </div>

      {erreurReservation && <p className="erreur" role="alert">{erreurReservation}</p>}
      <section className="offres-grille" aria-label="Séjours proposés">
        {offresAffichees.map((offre) => {
          const detailVisible = detailOuvert === offre.id;
          return (
            <article className="carte offre-carte" key={offre.id}>
              <div className="offre-visuel" aria-hidden="true"><span>{offre.region}</span><strong>{offre.destination}</strong></div>
              <div className="offre-contenu">
                <div className="offre-etiquettes">
                  <span className="offre-remise">-{remise(offre)}%</span>
                  <span className="offre-categorie">{offre.categorie}</span>
                  <span className="discret">{offre.duree} jours · {offre.nuits} nuits</span>
                </div>
                <h2>{offre.destination}</h2>
                <p className="discret">{offre.description}</p>
                <div className="offre-prix">
                  <div><del>{offre.prixAvant} TND</del><strong>{offre.prix} <small>TND / personne</small></strong></div>
                  <span>Hébergement inclus</span>
                </div>
                {detailVisible && (
                  <div className="offre-detail">
                    <h3>Le forfait comprend</h3>
                    <p><strong>Hébergement :</strong> {offre.hotel}</p>
                    <ul>{offre.inclus.map((element) => <li key={element}>{element}</li>)}</ul>
                    <h3>Programme indicatif</h3>
                    <ol>{offre.jours.map((jour, index) => <li key={jour}><strong>Jour {index + 1} :</strong> {jour}</li>)}</ol>
                    <button type="button" className="bouton offre-reserver" onClick={() => reserver(offre)} disabled={reservationEnCours === offre.id || Boolean(offresEnregistrees[offre.id])}>
                      {reservationEnCours === offre.id ? 'Ajout en cours…' : offresEnregistrees[offre.id] ? 'Ajouté à Mes programmes ✓' : 'Ajouter ce séjour à Mes programmes'}
                    </button>
                    {offresEnregistrees[offre.id] && (
                      <Link className="lien offre-lien-programmes" to="/programmes">Voir Mes programmes</Link>
                    )}
                  </div>
                )}
                <div className="offre-actions">
                  <button type="button" className="bouton secondaire" onClick={() => setDetailOuvert(detailVisible ? null : offre.id)}>
                    {detailVisible ? 'Masquer le détail' : 'Voir le programme'}
                  </button>
                  <button type="button" className="bouton" onClick={() => preparerSejour(offre)}>Personnaliser ce séjour</button>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
