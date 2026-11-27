const express = require('express');
const db = require('../db');
const { verifierToken } = require('../auth');

const router = express.Router();
router.use(verifierToken);

router.get('/', async (req, res) => {
  try {
    const [[totaux]] = await db.query(
      `SELECT
         COUNT(*) AS nombreProgrammes,
         COUNT(DISTINCT destination) AS nombreDestinations,
         COUNT(DISTINCT utilisateur_id) AS nombreUtilisateurs,
         COALESCE(SUM(duree), 0) AS joursPlanifies,
         COALESCE(ROUND(AVG(budget), 0), 0) AS budgetMoyen,
         COALESCE(ROUND(SUM(budget), 0), 0) AS budgetTotal
       FROM programmes`
    );

    const [destinations] = await db.query(
      `SELECT
         destination,
         COUNT(*) AS nombreProgrammes,
         COALESCE(ROUND(AVG(budget), 0), 0) AS budgetMoyen,
         COALESCE(ROUND(AVG(duree), 0), 0) AS dureeMoyenne
       FROM programmes
       WHERE destination IS NOT NULL AND TRIM(destination) <> ''
       GROUP BY destination
       ORDER BY nombreProgrammes DESC, destination ASC
       LIMIT 10`
    );

    res.json({
      totaux: Object.fromEntries(
        Object.entries(totaux).map(([cle, valeur]) => [cle, Number(valeur) || 0])
      ),
      destinations: destinations.map((destination) => ({
        ...destination,
        nombreProgrammes: Number(destination.nombreProgrammes) || 0,
        budgetMoyen: Number(destination.budgetMoyen) || 0,
        dureeMoyenne: Number(destination.dureeMoyenne) || 0,
      })),
    });
  } catch (err) {
    console.error('Erreur chargement statistiques :', err);
    res.status(500).json({ message: 'Impossible de charger les statistiques.' });
  }
});

module.exports = router;
