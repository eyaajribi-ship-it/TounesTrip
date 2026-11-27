const express = require('express');
const { verifierToken } = require('../auth');
const { appelerGemini } = require('../ia');

const router = express.Router();
router.use(verifierToken);

router.post('/', async (req, res) => {
  try {
    const message = String(req.body?.message ?? '').trim();
    if (!message) {
      return res.status(400).json({ message: 'Veuillez saisir une question.' });
    }

    const prompt = `Tu es un guide touristique local chaleureux et précis spécialisé sur la Tunisie pour l'application TounesTrip.
Réponds en français de manière claire, utile et concise (quelques phrases) à la question du voyageur :
"${message}"`;

    const repIa = await appelerGemini({ prompt, jsonMode: false });
    if (repIa && repIa.trim()) {
      return res.json({ reply: repIa.trim() });
    }
    return res.status(503).json({ message: 'Gemini n’a pas renvoyé de réponse. Réessaie dans un instant.' });
  } catch (e) {
    console.error('Erreur du guide Gemini :', e);
    if (e.code === 'GEMINI_TIMEOUT') {
      return res.status(504).json({ message: 'Gemini met trop de temps à répondre. Réessaie dans un instant.' });
    }
    if (e.status === 429) {
      return res.status(429).json({ message: 'Les limites Gemini sont atteintes. Réessaie plus tard.' });
    }
    if (e.status === 403) {
      return res.status(502).json({ message: 'La clé Gemini ou l’accès au modèle n’est pas autorisé.' });
    }
    res.status(502).json({ message: 'Gemini ne peut pas répondre pour le moment.' });
  }
});

module.exports = router;
