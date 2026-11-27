const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { verifierToken } = require('../auth');
const { emailValide, motDePasseValide } = require('../validation');

const router = express.Router();
router.use(verifierToken); // toutes les routes ci-dessous demandent d'être connecté

// Voir son profil
router.get('/me', async (req, res) => {
  try {
    const [lignes] = await db.query('SELECT id, nom, email, role FROM utilisateurs WHERE id = ?', [req.utilisateur.id]);
    if (!lignes[0]) return res.status(404).json({ message: 'Utilisateur introuvable' });
    res.json(lignes[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});

// Modifier le nom et l'email
router.put('/me', async (req, res) => {
  try {
    const { nom, email } = req.body;
    if (typeof nom !== 'string' || !nom.trim()) return res.status(400).json({ message: 'Le nom est obligatoire' });
    if (!emailValide(email)) return res.status(400).json({ message: 'Email invalide' });

    const [autres] = await db.query('SELECT id FROM utilisateurs WHERE email = ? AND id <> ?', [email, req.utilisateur.id]);
    if (autres.length > 0) return res.status(409).json({ message: 'Cet email est déjà utilisé' });

    await db.query('UPDATE utilisateurs SET nom = ?, email = ? WHERE id = ?', [nom.trim(), email, req.utilisateur.id]);
    res.json({ message: 'Profil mis à jour', nom: nom.trim(), email });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});

// Changer le mot de passe
router.put('/me/password', async (req, res) => {
  try {
    const { ancienMotDePasse, nouveauMotDePasse } = req.body;
    if (!motDePasseValide(nouveauMotDePasse)) {
      return res.status(400).json({ message: 'Le nouveau mot de passe doit contenir au moins 8 caractères' });
    }
    const [lignes] = await db.query('SELECT mot_de_passe FROM utilisateurs WHERE id = ?', [req.utilisateur.id]);
    if (!lignes[0]) return res.status(404).json({ message: 'Utilisateur introuvable' });

    const ok = await bcrypt.compare(ancienMotDePasse || '', lignes[0].mot_de_passe);
    if (!ok) return res.status(401).json({ message: "L'ancien mot de passe est incorrect" });

    const hash = await bcrypt.hash(nouveauMotDePasse, 10);
    await db.query('UPDATE utilisateurs SET mot_de_passe = ? WHERE id = ?', [hash, req.utilisateur.id]);
    res.json({ message: 'Mot de passe modifié' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});

module.exports = router;