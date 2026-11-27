const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'secret_dev';

function creerToken(utilisateur) {
  return jwt.sign({ id: utilisateur.id, role: utilisateur.role }, SECRET, { expiresIn: '2h' });
}

// Middleware : vérifie le token envoyé dans l'en-tête Authorization: Bearer <token>
function verifierToken(req, res, next) {
  const entete = req.headers.authorization || '';
  const token = entete.startsWith('Bearer ') ? entete.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Connexion requise' });
  try {
    req.utilisateur = jwt.verify(token, SECRET);
    next();
  } catch (e) {
    res.status(401).json({ message: 'Session expirée, reconnectez-vous' });
  }
}

module.exports = { creerToken, verifierToken };