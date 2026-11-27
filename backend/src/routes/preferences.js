const express = require('express');
const db = require('../db');
const { verifierToken } = require('../auth');

const router = express.Router();
router.use(verifierToken);

const INTERETS_AUTORISES = ['plage', 'histoire', 'nature', 'gastronomie'];

// Enregistrer ses préférences de voyage
router.post('/', async (req, res) => {
  try {
    const { destination, dateDebut, dateFin, budget, duree, centresInteret } = req.body;

    if (!destination || !destination.trim()) return res.status(400).json({ message: 'La destination est obligatoire' });
    if (!dateDebut || !dateFin) return res.status(400).json({ message: 'La période du séjour est obligatoire' });
    if (new Date(dateFin) < new Date(dateDebut)) {
      return res.status(400).json({ message: 'La date de fin doit être après la date de début' });
    }
    if (!(Number(budget) > 0)) return res.status(400).json({ message: 'Le budget doit être supérieur à 0' });
    if (!(Number(duree) > 0)) return res.status(400).json({ message: 'La durée doit être supérieure à 0' });
    if (!Array.isArray(centresInteret) || centresInteret.length === 0) {
      return res.status(400).json({ message: "Choisissez au moins un centre d'intérêt" });
    }
    if (!centresInteret.every((c) => INTERETS_AUTORISES.includes(c))) {
      return res.status(400).json({ message: "Centre d'intérêt non valide" });
    }

    const [resultat] = await db.query(
      `INSERT INTO preferences (utilisateur_id, destination, date_debut, date_fin, budget, duree, centres_interet)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.utilisateur.id, destination.trim(), dateDebut, dateFin, Number(budget), Number(duree), centresInteret.join(',')]
    );
    res.status(201).json({ message: 'Préférences enregistrées', id: resultat.insertId });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});

// Retrouver ses dernières préférences
router.get('/derniere', async (req, res) => {
  try {
    const [lignes] = await db.query(
      `SELECT id, destination, date_debut, date_fin, budget, duree, centres_interet
       FROM preferences WHERE utilisateur_id = ? ORDER BY id DESC LIMIT 1`,
      [req.utilisateur.id]
    );
    if (!lignes[0]) return res.json(null);
    const p = lignes[0];
    res.json({
      id: p.id,
      destination: p.destination,
      dateDebut: p.date_debut,
      dateFin: p.date_fin,
      budget: Number(p.budget),
      duree: p.duree,
      centresInteret: p.centres_interet.split(','),
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});

module.exports = router;