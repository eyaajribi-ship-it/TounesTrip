import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { api } from '../api';

const OFFRES = [
  { id: 'hammamet', destination: 'Hammamet & Nabeul', region: 'Cap Bon', categorie: 'Plage', duree: 3, nuits: 2, prixAvant: 399, prix: 329, hotel: 'Dar Sabri', rassemblement: { ville: 'Hammamet', heure: '6 h 45', lieu: 'Baraket Sahel, près de la station OLA' }, inclus: ['Hébergement avec petit-déjeuner', 'Transferts locaux', 'Visites de Hammamet et Nabeul'], jours: ['Médina et remparts de Hammamet', 'Plage et ateliers de poterie à Nabeul', 'Marché local et temps libre'], description: 'Un court séjour entre mer, artisanat et douceur de vivre au Cap Bon.' },
  { id: 'djerba', destination: 'Djerba, l’île des rêves', region: 'Djerba', categorie: 'Plage', duree: 4, nuits: 3, prixAvant: 529, prix: 449, hotel: 'Dar Bibine', rassemblement: { ville: 'Sousse', heure: '7 h 45', lieu: 'MG Sahoul' }, inclus: ['Hébergement avec petit-déjeuner', 'Découverte de Houmt Souk', 'Djerbahood et musée de Guellala'], jours: ['Arrivée et découverte de Houmt Souk', 'Djerbahood et village d’Erriadh', 'Guellala et détente à la plage', 'Marché et départ'], description: 'Un séjour insulaire mêlant plages, villages djerbiens et patrimoine.' },
  { id: 'tunis', destination: 'Tunis, Carthage & Sidi Bou Saïd', region: 'Grand Tunis', categorie: 'Culture', duree: 3, nuits: 2, prixAvant: 679, prix: 579, hotel: 'Dar El Jeld Hotel & Spa', rassemblement: { ville: 'Tunis', heure: '5 h 30', lieu: "Horloge de l’avenue, devant Amen Bank" }, inclus: ['Hébergement avec petit-déjeuner', 'Visites de la médina et de Carthage', 'Excursion à Sidi Bou Saïd'], jours: ['Médina de Tunis et souks', 'Carthage et Sidi Bou Saïd', 'Musée du Bardo et départ'], description: 'Trois jours de découvertes entre histoire, architecture et cafés en bord de mer.' },
  { id: 'sahara', destination: 'Tozeur & portes du Sahara', region: 'Sud tunisien', categorie: 'Aventure', duree: 5, nuits: 4, prixAvant: 899, prix: 749, hotel: 'Dar Tozeur', rassemblement: { ville: 'Sousse', heure: '7 h 45', lieu: 'MG Sahoul' }, inclus: ['Hébergement avec petit-déjeuner', 'Oasis et vieille ville de Tozeur', 'Excursion à Chebika et au Chott el-Jérid'], jours: ['Arrivée et médina de Tozeur', 'Palmeraie et oasis', 'Chebika et paysages de montagne', 'Chott el-Jérid et Douz', 'Temps libre et départ'], description: 'Une escapade au sud pour explorer les oasis, les paysages minéraux et le désert.' },
];

const CATEGORIES = ['Toutes', 'Plage', 'Culture', 'Aventure'];
const formatDate = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

export default function OffresReservation() {
  const [categorie, setCategorie] = useState('Toutes');
  const [detailOuvert, setDetailOuvert] = useState(null);
  const [disponibilites, setDisponibilites] = useState([]);
  const [disponibilitesChargees, setDisponibilitesChargees] = useState(false);
  const [erreurDisponibilites, setErreurDisponibilites] = useState(false);
  const [departSelectionne, setDepartSelectionne] = useState({});
  const [voyageurs, setVoyageurs] = useState({});
  const [confirmationOuverte, setConfirmationOuverte] = useState(null);
  const [reservationEnCours, setReservationEnCours] = useState(false);
  const [message, setMessage] = useState('');
  const [erreur, setErreur] = useState('');
  const { utilisateur, deconnecter } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.reservationErreur) setErreur(location.state.reservationErreur);
  }, [location.state]);

  async function chargerDisponibilites() {
    try {
      const dates = await api.lireDisponibilitesOffres();
      setDisponibilites(dates);
      setDisponibilitesChargees(true);
      setErreurDisponibilites(false);
      setDepartSelectionne((courant) => {
        const prochain = { ...courant };
        OFFRES.forEach((offre) => {
          const datesLibres = dates.filter((date) => date.offre_id === offre.id && date.places_disponibles > 0);
          if (!datesLibres.some((date) => date.id === Number(prochain[offre.id]))) prochain[offre.id] = datesLibres[0]?.id || '';
        });
        return prochain;
      });
    } catch (e) { setErreur(e.message); setErreurDisponibilites(true); setDisponibilitesChargees(true); }
  }

  useEffect(() => { chargerDisponibilites(); }, []);

  useEffect(() => {
    if (!utilisateur) return;
    const attente = sessionStorage.getItem('reservationOffre');
    if (!attente) return;
    try {
      const choix = JSON.parse(attente);
      setDetailOuvert(choix.offreId);
      setDepartSelectionne((courant) => ({ ...courant, [choix.offreId]: Number(choix.departId) }));
      setVoyageurs((courant) => ({ ...courant, [choix.offreId]: Number(choix.nombreVoyageurs) || 0 }));
    } catch { sessionStorage.removeItem('reservationOffre'); }
  }, [utilisateur]);

  async function reserver(offre) {
    setErreur('');
    setMessage('');
    const departId = Number(departSelectionne[offre.id]);
    const nombreVoyageurs = Number(voyageurs[offre.id]) || 0;
    if (!departId) { setErreur('Choisis une date avec des places disponibles.'); return; }
    if (!utilisateur) {
      sessionStorage.setItem('reservationOffre', JSON.stringify({ offreId: offre.id, departId, nombreVoyageurs }));
      navigate('/connexion', { state: { message: 'Connecte-toi pour confirmer la réservation. Ton séjour choisi sera conservé.' } });
      return;
    }
    setReservationEnCours(true);
    try {
      const resultat = await api.reserverOffre(offre.id, departId, nombreVoyageurs);
      setMessage(`Réservation confirmée : ${resultat.reservation.prix_total.toLocaleString('fr-FR')} TND, à régler sur place. Elle est enregistrée dans Mes réservations.`);
      setConfirmationOuverte(null);
      sessionStorage.removeItem('reservationOffre');
      await chargerDisponibilites();
    } catch (e) {
      if (e.status === 401) {
        sessionStorage.setItem('reservationOffre', JSON.stringify({ offreId: offre.id, departId, nombreVoyageurs }));
        deconnecter();
        navigate('/connexion', { state: { message: 'Ta session a expiré. Connecte-toi à nouveau pour confirmer la réservation.' } });
      } else {
        setErreur(e.message);
      }
      await chargerDisponibilites();
    } finally { setReservationEnCours(false); }
  }

  const offresAffichees = categorie === 'Toutes' ? OFFRES : OFFRES.filter((offre) => offre.categorie === categorie);

  return (
    <div className="page-offres">
      <section className="bandeau">
        <p className="offres-surtitre">TounesTrip · Séjours à thème</p>
        <h1>Nos offres en Tunisie</h1>
        <p>Choisis ta date, vérifie les places disponibles et réserve ton séjour.</p>
      </section>
      <div className="offres-filtres" aria-label="Filtrer les offres par style">
        {CATEGORIES.map((item) => <button key={item} type="button" className={'bouton filtre-offre' + (categorie === item ? ' selectionne' : '')} onClick={() => setCategorie(item)}>{item}</button>)}
      </div>
      {erreur && <p className="erreur" role="alert">{erreur}</p>}
      {message && <p className="succes" role="status">{message} <Link to="/reservations">Mes réservations</Link></p>}
      <section className="offres-grille" aria-label="Séjours proposés">
        {offresAffichees.map((offre) => {
          const detailVisible = detailOuvert === offre.id;
          const dates = disponibilites.filter((date) => date.offre_id === offre.id && date.places_disponibles > 0);
          const offreComplete = disponibilitesChargees && !erreurDisponibilites && dates.length === 0;
          const depart = dates.find((date) => date.id === Number(departSelectionne[offre.id]));
          const nombreVoyageurs = Number(voyageurs[offre.id]) || 0;
          const prix = dates[0]?.prix_personne ?? offre.prix;
          return (
            <article className="carte offre-carte" key={offre.id}>
              <div className="offre-visuel" aria-hidden="true"><span>{offre.region}</span><strong>{offre.destination}</strong></div>
              <div className="offre-contenu">
                <div className="offre-etiquettes"><span className="offre-remise">-{Math.round((1 - offre.prix / offre.prixAvant) * 100)}%</span><span className="offre-categorie">{offre.categorie}</span><span className="discret">{offre.duree} jours · {offre.nuits} nuits</span>{offreComplete && <span className="offre-complet">Complet</span>}</div>
                <h2>{offre.destination}</h2>
                <p className="discret">{offre.description}</p>
                <div className="offre-prix"><div><del>{offre.prixAvant} TND</del><strong>{prix} <small>TND / personne</small></strong></div><span>Hébergement inclus</span></div>
                {detailVisible && <div className="offre-detail">
                  <h3>Le forfait comprend</h3><p><strong>Hébergement :</strong> {offre.hotel}</p>
                  <ul>{offre.inclus.map((element) => <li key={element}>{element}</li>)}</ul>
                  <h3>Programme indicatif</h3><ol>{offre.jours.map((jour, index) => <li key={jour}><strong>Jour {index + 1} :</strong> {jour}</li>)}</ol>
                  <form className="reservation-form" onSubmit={(e) => { e.preventDefault(); setConfirmationOuverte(offre.id); }}>
                    <label>Date de départ
                      <select value={departSelectionne[offre.id] || ''} onChange={(e) => setDepartSelectionne((courant) => ({ ...courant, [offre.id]: Number(e.target.value) }))} required disabled={dates.length === 0}>
                        {dates.length === 0 && <option value="">Aucune date disponible</option>}
                        {dates.map((date) => <option key={date.id} value={date.id}>{formatDate(date.date_depart)}</option>)}
                      </select>
                    </label>
                    <label>Voyageurs
                      <input type="number" min="1" max={Math.min(20, depart?.places_disponibles || 20)} value={voyageurs[offre.id] ?? 0} onChange={(e) => setVoyageurs((courant) => ({ ...courant, [offre.id]: e.target.value }))} required />
                    </label>
                    <button type="submit" className="bouton offre-reserver" disabled={reservationEnCours || !dates.length || nombreVoyageurs > (depart?.places_disponibles || 0)}>
                      {reservationEnCours ? 'Réservation en cours…' : !disponibilitesChargees ? 'Chargement des départs…' : dates.length ? 'Réserver ce séjour' : 'Complet pour le moment'}
                    </button>
                  </form>
                  {confirmationOuverte === offre.id && <section className="confirmation-reservation" aria-label="Vérification de la réservation">
                    <h3>Rassemblement possible</h3>
                    <p><strong>{offre.rassemblement.ville} · {offre.rassemblement.heure}</strong><br />{offre.rassemblement.lieu}</p>
                    <p><strong>Infos et réservations :</strong> <a href="tel:+21699747900">99 747 900</a> · <a href="tel:+21699747902">99 747 902</a></p>
                    <p>Départ le {depart ? formatDate(depart.date_depart) : '—'} · {nombreVoyageurs} voyageur{nombreVoyageurs > 1 ? 's' : ''}</p>
                    <p className="reservation-total">Total : <strong>{(prix * nombreVoyageurs).toLocaleString('fr-FR')} TND</strong></p>
                    <p className="reservation-paiement">Paiement sur place après confirmation.</p>
                    <div className="offre-actions">
                      <button type="button" className="bouton offre-reserver" disabled={!depart || nombreVoyageurs < 1 || nombreVoyageurs > (depart?.places_disponibles || 0) || reservationEnCours} onClick={() => reserver(offre)}>
                        {utilisateur ? 'Confirmer la réservation' : 'Se connecter et confirmer'}
                      </button>
                      <button type="button" className="bouton secondaire" onClick={() => setConfirmationOuverte(null)}>Retour</button>
                    </div>
                  </section>}
                </div>}
                <div className="offre-actions">
                  <button type="button" className="bouton secondaire" onClick={() => setDetailOuvert(detailVisible ? null : offre.id)}>{detailVisible ? 'Masquer le détail' : offreComplete ? 'Voir le programme' : 'Voir le programme et réserver'}</button>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
