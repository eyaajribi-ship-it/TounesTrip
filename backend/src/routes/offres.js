const express = require('express');
const db = require('../db');
const { verifierToken } = require('../auth');

const router = express.Router();
const dateISO = (value) => value instanceof Date
  ? `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`
  : String(value).slice(0, 10);

router.get('/', async (_req, res) => {
  try {
    const [departures] = await db.query(
      `SELECT d.id, d.offre_id, d.date_depart, o.prix_personne,
              d.places_totales - d.places_reservees AS places_disponibles
       FROM offres_departures d
       JOIN offres_catalogue o ON o.id = d.offre_id AND o.actif = 1
       WHERE d.date_depart >= CURDATE()
       ORDER BY d.offre_id, d.date_depart`
    );
    res.json(departures.map((departure) => ({
      ...departure,
      id: Number(departure.id),
      prix_personne: Number(departure.prix_personne),
      places_disponibles: Number(departure.places_disponibles),
      date_depart: dateISO(departure.date_depart),
    })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Impossible de charger les dates disponibles.' });
  }
});

router.get('/reservations', verifierToken, async (req, res) => {
  try {
    const [reservations] = await db.query(
      `SELECT r.id, r.nombre_voyageurs, r.prix_total, r.statut,
              r.mode_paiement, r.statut_paiement, r.created_at,
              d.date_depart, o.id AS offre_id, o.destination
       FROM reservations r
       JOIN offres_departures d ON d.id = r.depart_id
       JOIN offres_catalogue o ON o.id = d.offre_id
       WHERE r.utilisateur_id = ?
       ORDER BY d.date_depart DESC, r.id DESC`,
      [req.utilisateur.id]
    );
    res.json(reservations.map((r) => ({
      ...r,
      id: Number(r.id),
      nombre_voyageurs: Number(r.nombre_voyageurs),
      prix_total: Number(r.prix_total),
      date_depart: dateISO(r.date_depart),
    })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Impossible de charger vos réservations.' });
  }
});

router.post('/:offreId/reservations', verifierToken, async (req, res) => {
  const nombreVoyageurs = Number(req.body.nombreVoyageurs);
  const departId = Number(req.body.departId);
  if (!Number.isInteger(nombreVoyageurs) || nombreVoyageurs < 1 || nombreVoyageurs > 20) {
    return res.status(400).json({ message: 'Choisis entre 1 et 20 voyageurs.' });
  }
  if (!Number.isInteger(departId) || departId < 1) {
    return res.status(400).json({ message: 'Choisis une date de départ valide.' });
  }

  let connexion;
  try {
    connexion = await db.getConnection();
    await connexion.beginTransaction();
    const [rows] = await connexion.query(
      `SELECT d.id, d.date_depart, d.places_totales, d.places_reservees, o.prix_personne, o.destination
       FROM offres_departures d
       JOIN offres_catalogue o ON o.id = d.offre_id
       WHERE d.id = ? AND d.offre_id = ? AND o.actif = 1 AND d.date_depart >= CURDATE()
       FOR UPDATE`,
      [departId, req.params.offreId]
    );
    const depart = rows[0];
    if (!depart) {
      await connexion.rollback();
      return res.status(404).json({ message: 'Cette date de départ n’est plus disponible.' });
    }
    const placesDisponibles = Number(depart.places_totales) - Number(depart.places_reservees);
    if (nombreVoyageurs > placesDisponibles) {
      await connexion.rollback();
      return res.status(409).json({ message: `Il ne reste que ${placesDisponibles} place(s) pour cette date.` });
    }
    const prixTotal = Number((Number(depart.prix_personne) * nombreVoyageurs).toFixed(2));
    const [resultat] = await connexion.query(
      `INSERT INTO reservations
       (utilisateur_id, depart_id, nombre_voyageurs, prix_total, mode_paiement, statut_paiement)
       VALUES (?, ?, ?, ?, 'sur_place', 'a_payer')`,
      [req.utilisateur.id, departId, nombreVoyageurs, prixTotal]
    );
    await connexion.query(
      'UPDATE offres_departures SET places_reservees = places_reservees + ? WHERE id = ?',
      [nombreVoyageurs, departId]
    );
    await connexion.commit();
    res.status(201).json({
      message: 'Réservation confirmée.',
      reservation: {
        id: resultat.insertId,
        offre_id: req.params.offreId,
        destination: depart.destination,
        date_depart: dateISO(depart.date_depart),
        nombre_voyageurs: nombreVoyageurs,
        prix_total: prixTotal,
        statut: 'confirmee',
        mode_paiement: 'sur_place',
        statut_paiement: 'a_payer',
      },
    });
  } catch (error) {
    if (connexion) await connexion.rollback();
    console.error(error);
    res.status(500).json({ message: 'La réservation n’a pas pu être enregistrée.' });
  } finally {
    connexion?.release();
  }
});

router.patch('/reservations/:id/annuler', verifierToken, async (req, res) => {
  const reservationId = Number(req.params.id);
  if (!Number.isInteger(reservationId) || reservationId < 1) {
    return res.status(400).json({ message: 'Réservation invalide.' });
  }
  let connexion;
  try {
    connexion = await db.getConnection();
    await connexion.beginTransaction();
    const [rows] = await connexion.query(
      `SELECT r.id, r.nombre_voyageurs, r.statut, r.depart_id,
              d.date_depart < CURDATE() AS date_passee
       FROM reservations r JOIN offres_departures d ON d.id = r.depart_id
       WHERE r.id = ? AND r.utilisateur_id = ? FOR UPDATE`,
      [reservationId, req.utilisateur.id]
    );
    const reservation = rows[0];
    if (!reservation || reservation.statut !== 'confirmee') {
      await connexion.rollback();
      return res.status(404).json({ message: 'Réservation confirmée introuvable.' });
    }
    if (Number(reservation.date_passee)) {
      await connexion.rollback();
      return res.status(409).json({ message: 'Un séjour déjà commencé ne peut plus être annulé.' });
    }
    await connexion.query("UPDATE reservations SET statut = 'annulee' WHERE id = ?", [reservationId]);
    await connexion.query(
      'UPDATE offres_departures SET places_reservees = places_reservees - ? WHERE id = ?',
      [reservation.nombre_voyageurs, reservation.depart_id]
    );
    await connexion.commit();
    res.json({ message: 'Réservation annulée.' });
  } catch (error) {
    if (connexion) await connexion.rollback();
    console.error(error);
    res.status(500).json({ message: 'La réservation n’a pas pu être annulée.' });
  } finally {
    connexion?.release();
  }
});

module.exports = router;
