const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { creerToken } = require('../auth');
const { emailValide, motDePasseValide } = require('../validation');

const router = express.Router();

// Inscription
router.post('/register', async (req, res) => {
  try {
    const { nom, email, motDePasse } = req.body;
if (typeof nom !== 'string' || !nom.trim()) {
      return res.status(400).json({ message: 'Le nom est obligatoire' });
    }
if (!emailValide(email)) return res.status(400).json({ message: 'Email invalide' });
if (!motDePasseValide(motDePasse)) {
      return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 8 caractères' });
    }

    const [existants] = await db.query('SELECT id FROM utilisateurs WHERE email = ?', [email]);
    if (existants.length > 0) return res.status(409).json({ message: 'Cet email est déjà utilisé' });

    const hash = await bcrypt.hash(motDePasse, 10); // mot de passe chiffré
    const [resultat] = await db.query(
      'INSERT INTO utilisateurs (nom, email, mot_de_passe) VALUES (?, ?, ?)',
      [nom.trim(), email, hash]
    );
    res.status(201).json({ message: 'Compte créé avec succès', id: resultat.insertId });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});

// Connexion
router.post('/login', async (req, res) => {
  try {
    const { email, motDePasse } = req.body;
    const [lignes] = await db.query('SELECT * FROM utilisateurs WHERE email = ?', [email]);
    const utilisateur = lignes[0];

    const erreur = { message: 'Email ou mot de passe incorrect' };
    if (!utilisateur) return res.status(401).json(erreur);
    const ok = await bcrypt.compare(motDePasse || '', utilisateur.mot_de_passe);
    if (!ok) return res.status(401).json(erreur);
    if (!utilisateur.actif) return res.status(403).json({ message: 'Ce compte est désactivé' });

    res.json({
      token: creerToken(utilisateur),
      utilisateur: { id: utilisateur.id, nom: utilisateur.nom, email: utilisateur.email, role: utilisateur.role },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});

module.exports = router;