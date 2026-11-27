const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function lireToken() {
  return localStorage.getItem('token');
}

export function enregistrerSession(token, utilisateur) {
  localStorage.setItem('token', token);
  localStorage.setItem('utilisateur', JSON.stringify(utilisateur));
}

export function effacerSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('utilisateur');
}

export function lireUtilisateurStocke() {
  try {
    return JSON.parse(localStorage.getItem('utilisateur') || 'null');
  } catch {
    return null;
  }
}

export async function requeteApi(chemin, { methode = 'GET', corps, auth = true } = {}) {
  const entetes = { 'Content-Type': 'application/json' };
  const token = lireToken();
  if (auth && token) entetes.Authorization = `Bearer ${token}`;

  const reponse = await fetch(`${BASE}${chemin}`, {
    method: methode,
    headers: entetes,
    body: corps ? JSON.stringify(corps) : undefined,
  });

  const texte = await reponse.text();
  let donnees = {};
  try {
    donnees = texte ? JSON.parse(texte) : {};
  } catch {
    const estHtml = /<!doctype html|<html[\s>]/i.test(texte);
    donnees = {
      message: estHtml
        ? 'Le serveur API ne reconnaît pas cette route. Redémarre le backend pour charger les dernières fonctionnalités.'
        : texte,
    };
  }

  if (!reponse.ok) {
    const erreur = new Error(donnees.message || donnees.erreur || `Erreur ${reponse.status}`);
    erreur.status = reponse.status;
    if (reponse.status === 401 && auth) {
      effacerSession();
      sessionStorage.setItem('messageConnexion', 'Ta session a expiré. Connecte-toi à nouveau pour continuer.');
      window.dispatchEvent(new Event('session-expiree'));
    }
    throw erreur;
  }
  return donnees;
}

export const api = {
  // Sprint 1 : Authentification
  inscription: (nom, email, motDePasse) =>
    requeteApi('/auth/register', {
      methode: 'POST',
      corps: { nom, email, motDePasse },
      auth: false,
    }),

  connexion: (email, motDePasse) =>
    requeteApi('/auth/login', {
      methode: 'POST',
      corps: { email, motDePasse },
      auth: false,
    }),

  // Sprint 1 : Profil & mot de passe
  lireProfil: () => requeteApi('/users/me'),
  modifierProfil: (nom, email) =>
    requeteApi('/users/me', { methode: 'PUT', corps: { nom, email } }),
  changerMotDePasse: (ancienMotDePasse, nouveauMotDePasse) =>
    requeteApi('/users/me/password', {
      methode: 'PUT',
      corps: { ancienMotDePasse, nouveauMotDePasse },
    }),

  // Sprint 1 : Préférences de voyage
  enregistrerPreferences: (prefs) =>
    requeteApi('/preferences', { methode: 'POST', corps: prefs }),
  lireDernieresPreferences: () => requeteApi('/preferences/derniere'),

  // Sprint 2 : Génération & sauvegarde de programmes
  genererProgramme: (prefs) =>
    requeteApi('/programmes/generer', { methode: 'POST', corps: prefs }),
  sauvegarderProgramme: (programme) =>
    requeteApi('/programmes', { methode: 'POST', corps: programme }),
  listerProgrammes: () => requeteApi('/programmes'),
  lireStatistiques: () => requeteApi('/statistiques'),
  lireProgramme: (id) => requeteApi(`/programmes/${id}`),
  modifierProgrammeAvecIA: (id, instruction) => requeteApi(`/programmes/${id}/modifier-ia`, {
    methode: 'PUT',
    corps: { instruction },
  }),
  supprimerProgramme: (id) =>
    requeteApi(`/programmes/${id}`, { methode: 'DELETE' }),

  // Offres, disponibilité et réservations
  lireDisponibilitesOffres: () => requeteApi('/offres', { auth: false }),
  reserverOffre: (offreId, departId, nombreVoyageurs) =>
    requeteApi(`/offres/${offreId}/reservations`, {
      methode: 'POST',
      corps: { departId, nombreVoyageurs },
    }),
  listerReservations: () => requeteApi('/offres/reservations'),
  annulerReservation: (id) =>
    requeteApi(`/offres/reservations/${id}/annuler`, { methode: 'PATCH' }),

  // Sprint 2 : Chatbot guide touristique
  envoyerChatbot: (message) =>
    requeteApi('/chatbot', { methode: 'POST', corps: { message } }),

  // Sprint 3 : Avis et notes sur un programme
  lireAvisProgramme: (id) => requeteApi(`/programmes/${id}/avis`),
  publierAvisProgramme: (id, note, commentaire) =>
    requeteApi(`/programmes/${id}/avis`, {
      methode: 'POST',
      corps: { note, commentaire },
    }),
};


