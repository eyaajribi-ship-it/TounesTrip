const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function emailValide(email) {
  return typeof email === 'string' && EMAIL_REGEX.test(email);
}

function motDePasseValide(mdp) {
  return typeof mdp === 'string' && mdp.length >= 8;
}

module.exports = { emailValide, motDePasseValide };