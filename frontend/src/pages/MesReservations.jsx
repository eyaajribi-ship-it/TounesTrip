import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { api } from '../api';

function dateLocale(iso) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function MesReservations() {
  const [reservations, setReservations] = useState(null);
  const [erreur, setErreur] = useState('');
  const location = useLocation();
  const [message, setMessage] = useState(location.state?.confirmation || '');
  const [annulation, setAnnulation] = useState(null);

  async function charger() {
    try { setReservations(await api.listerReservations()); }
    catch (e) { setErreur(e.message); }
  }

  useEffect(() => { charger(); }, []);

  async function annuler(id) {
    setErreur('');
    setMessage('');
    setAnnulation(id);
    try {
      const resultat = await api.annulerReservation(id);
      setMessage(resultat.message);
      await charger();
    } catch (e) { setErreur(e.message); }
    finally { setAnnulation(null); }
  }

  return (
    <section className="mes-reservations">
      <div>
        <h1>Mes réservations</h1>
        <p className="discret">Consulte tes séjours confirmés et annule une réservation à venir si nécessaire.</p>
      </div>
      {erreur && <p className="erreur" role="alert">{erreur}</p>}
      {message && <p className="succes" role="status">{message}</p>}
      {reservations === null ? <p className="discret">Chargement des réservations…</p> : reservations.length === 0 ? (
        <div className="vide"><p>Aucune réservation pour le moment.</p><Link className="lien" to="/offres">Découvrir les offres</Link></div>
      ) : (
        <ul className="liste">
          {reservations.map((reservation) => (
            <li className="carte ligne" key={reservation.id}>
              <div>
                <strong>{reservation.destination}</strong>
                <p className="discret">Départ le {dateLocale(reservation.date_depart)} · {reservation.nombre_voyageurs} voyageur{reservation.nombre_voyageurs > 1 ? 's' : ''} · {reservation.prix_total.toLocaleString('fr-FR')} TND</p>
                <span className={reservation.statut === 'confirmee' ? 'reservation-statut confirmee' : 'reservation-statut annulee'}>{reservation.statut === 'confirmee' ? 'Confirmée' : 'Annulée'}</span>
                <p className="reservation-paiement">Paiement : {reservation.statut !== 'confirmee' ? 'aucun paiement enregistré' : reservation.statut_paiement === 'paye' ? 'réglé' : 'à régler sur place'}</p>
              </div>
              {reservation.statut === 'confirmee' && <button type="button" className="bouton danger" disabled={annulation === reservation.id} onClick={() => annuler(reservation.id)}>{annulation === reservation.id ? 'Annulation…' : 'Annuler'}</button>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
