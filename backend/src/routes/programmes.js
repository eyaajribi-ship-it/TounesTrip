const express = require('express');
const db = require('../db');
const { verifierToken } = require('../auth');
const { appelerGemini } = require('../ia');
const { obtenirHebergement, preparerContexteTunisie } = require('../iaTunisie');

const router = express.Router();
router.use(verifierToken);

function formaterLieuxPourPrompt(contexteTunisie, destination) {
  if (contexteTunisie.lieuxRecommandes && contexteTunisie.lieuxRecommandes.length > 0) {
    return contexteTunisie.lieuxRecommandes
      .map((l) => `- ${l.nom} (${l.categorie}, ~${l.prixParPersonne} TND/pers, soit ${l.coutGroupe} TND pour le groupe)`)
      .join('\n');
  }
  return `- Lieux emblématiques, médina, nature et spécialités culinaires de ${destination}`;
}

function construireHebergement(destination, duree, nombrePersonnes, hebergementExistant = null, budget = 0) {
  const nbNuits = Math.max(0, Number(duree) - 1);
  const nombreChambres = Math.max(1, Math.ceil(Number(nombrePersonnes || 1) / 2));
  const catalogue = hebergementExistant?.nom
    ? hebergementExistant
    : obtenirHebergement(destination, budget, nbNuits, nombreChambres);
  const prixParNuit = Number(catalogue.prixParNuit) || 100;
  const totalEstime = Number((prixParNuit * nbNuits * nombreChambres).toFixed(2));
  const descriptionBase = String(catalogue.description || '').replace(/ Estimation de .*$/, '');
  return {
    ...catalogue,
    prixParNuit,
    description: `${descriptionBase} Estimation de ${nombreChambres} chambre(s), à confirmer auprès de l’établissement.`,
    nombreChambres,
    nbNuits,
    totalEstime,
  };
}

function completerProgramme(programme, destination, budget, duree) {
  const nombrePersonnes = Math.max(1, Number(programme.nombrePersonnes) || 1);
  const hebergement = construireHebergement(destination, duree, nombrePersonnes, programme.hebergement, budget);
  const totalActivites = Number(
    programme.totalActivites ??
      (programme.jours || []).reduce((sum, jour) => sum + (Number(jour.coutEstime) || 0), 0)
  );
  const totalEstime = Number((totalActivites + hebergement.totalEstime).toFixed(2));
  return {
    ...programme,
    nombrePersonnes,
    budgetParPersonne: Number(programme.budgetParPersonne ?? (Number(budget) / nombrePersonnes).toFixed(2)),
    hebergement,
    totalActivites,
    totalEstime,
    resteBudget: Number((Number(budget) - totalEstime).toFixed(2)),
  };
}

// Générer un programme (Sprint 2 - #6)
router.post('/generer', async (req, res) => {
  try {
    const { destination, dateDebut, dateFin, budget, duree, days, centresInteret, niveau, style } = req.body;
    if (typeof destination !== 'string' || !destination.trim()) {
      return res.status(400).json({ message: 'La destination est obligatoire.' });
    }
    const budgetTotal = Number(budget);
    if (!Number.isFinite(budgetTotal) || budgetTotal <= 0) {
      return res.status(400).json({ message: 'Le budget doit être un montant positif en TND.' });
    }
    const joursDemandes = Number(days ?? duree);
    if (!Number.isInteger(joursDemandes) || joursDemandes < 1 || joursDemandes > 14) {
      return res.status(400).json({ message: 'La durée doit être comprise entre 1 et 14 jours.' });
    }
    const nbJours = joursDemandes;
    const nombrePersonnes = Number(req.body.nombrePersonnes ?? 1);
    if (!Number.isInteger(nombrePersonnes) || nombrePersonnes < 1 || nombrePersonnes > 20) {
      return res.status(400).json({ message: 'Le nombre de voyageurs doit être compris entre 1 et 20.' });
    }

    const destinationPropre = destination.trim();
    const budgetParPersonne = Number((budgetTotal / nombrePersonnes).toFixed(2));
    const nuits = Math.max(0, nbJours - 1);
    const nombreChambres = Math.max(1, Math.ceil(nombrePersonnes / 2));
    const contexteTunisie = preparerContexteTunisie({
      destination: destinationPropre,
      duree: nbJours,
      budget: budgetTotal,
      nombrePersonnes,
      style,
      centresInteret,
    });
    const hebergementCatalogue = contexteTunisie.hebergement;
    const prixParNuit = Number(hebergementCatalogue.prixParNuit);
    const totalHebergement = Number((prixParNuit * nuits * nombreChambres).toFixed(2));
    const budgetActivites = Number((budgetTotal - totalHebergement).toFixed(2));

    if (budgetActivites < 0) {
      return res.status(422).json({
        message: `L’hébergement conseillé coûte ${totalHebergement} TND pour ${nuits} nuit(s), au-dessus du budget de groupe de ${budgetTotal} TND. Augmente le budget ou réduis la durée.`,
      });
    }

    if (!process.env.GEMINI_API_KEY?.trim()) {
      return res.status(503).json({ message: 'Gemini n’est pas configuré : ajoute GEMINI_API_KEY dans backend/.env.' });
    }

    const listeLieuxTexte = formaterLieuxPourPrompt(contexteTunisie, destinationPropre);
    const centresTexte = Array.isArray(centresInteret)
      ? centresInteret.join(', ')
      : (centresInteret || 'aucun filtre particulier');

    const prompt = `Tu es l'assistant officiel de planification de voyages de TounesTrip, spécialisé exclusivement en Tunisie.
Reste strictement concentré sur la destination "${destinationPropre}" en Tunisie, les préférences de l'utilisateur (style : ${style || 'Culture & Patrimoine'}, centres d'intérêt : ${centresTexte}, niveau : ${niveau || 'Découverte'}) et le catalogue TounesTrip ci-dessous.
Réponds en français et uniquement en JSON, sans prétendre avoir effectué une recherche Web et sans inventer d'URL.

Catalogue de lieux recommandés par TounesTrip pour ${destinationPropre} :
${listeLieuxTexte}

Contraintes obligatoires :
- Séjour de ${nbJours} jour(s) à ${destinationPropre} pour ${nombrePersonnes} voyageur(s).
- Budget TOTAL du groupe : ${budgetTotal} TND, soit ${budgetParPersonne} TND par personne.
- Hébergement déjà choisi par TounesTrip et ajouté séparément : ${hebergementCatalogue.nom} (${hebergementCatalogue.type}, ${nombreChambres} chambre(s) x ${prixParNuit} TND/nuit x ${nuits} nuit(s) = ${totalHebergement} TND).
- Enveloppe maximale restante pour TOUTES les activités, repas et transports locaux du groupe sur les ${nbJours} jours : ${budgetActivites} TND. Ne dépasse jamais ce montant.
- Appuie-toi en priorité sur les lieux du catalogue TounesTrip fournis ci-dessus, répartis sans répétition inutile entre matin, après-midi et soir, avec des tarifs réalistes en TND pour le groupe entier.

Réponds avec cet objet JSON exact :
{"jours":[{"jour":1,"titre":"","matin":"","apresMidi":"","soir":"","coutEstime":0}]}

Le tableau jours doit contenir exactement ${nbJours} éléments numérotés de 1 à ${nbJours}. coutEstime est le total journalier des activités, repas et transports locaux pour tout le groupe.`;

    let texteGenere;
    try {
      texteGenere = await appelerGemini({
        prompt,
        jsonMode: true,
        maxOutputTokens: 300 + nbJours * 260,
        thinkingLevel: 'low',
      });
    } catch (iaErr) {
      console.error('Erreur de génération Gemini :', iaErr);
      const diagnostic = iaErr.code === 'GEMINI_TIMEOUT'
        ? 'Gemini dépasse le délai de réponse.'
        : iaErr.status === 400
          ? 'Gemini refuse le format de la requête.'
          : iaErr.status === 403
            ? 'La clé API Gemini est invalide ou le modèle n’est pas autorisé pour ce projet.'
            : iaErr.status === 429
              ? 'La limite de requêtes Gemini du projet est atteinte.'
              : iaErr.status >= 500
                ? 'Le service Gemini est temporairement indisponible.'
                : 'Vérifie la connexion réseau du serveur.';
      console.warn(`Génération Gemini impossible : ${diagnostic}`);
      const status = Number.isInteger(iaErr.status) ? iaErr.status : 502;
      return res.status(status).json({ message: `Génération Gemini impossible : ${diagnostic}` });
    }
    if (!texteGenere) {
      return res.status(503).json({ message: 'Gemini est indisponible : aucune réponse générée.' });
    }

    let resultat;
    try {
      resultat = JSON.parse(texteGenere.replace(/```json|```/gi, '').trim());
    } catch {
      return res.status(502).json({ message: 'Gemini n’a pas renvoyé un programme exploitable. Réessaie.' });
    }

    if (!resultat || !Array.isArray(resultat.jours)) {
      return res.status(502).json({ message: 'Gemini n’a pas renvoyé un itinéraire exploitable. Réessaie.' });
    }

    let joursRecus = resultat.jours;
    if (joursRecus.length !== nbJours) {
      try {
        const correction = await appelerGemini({
          prompt: `La réponse précédente n'avait pas la bonne durée. Renvoie uniquement un objet JSON avec exactement ${nbJours} journées numérotées de 1 à ${nbJours}. Garde la destination ${destination} et le style ${style || 'Culture & Patrimoine'}. Le coût total des journées ne doit pas dépasser ${budgetActivites} TND pour le groupe. Réponse précédente : ${JSON.stringify(joursRecus)}. Format : {"jours":[{"jour":1,"titre":"","matin":"","apresMidi":"","soir":"","coutEstime":0}]}`,
          jsonMode: true,
          maxOutputTokens: 300 + nbJours * 260,
          thinkingLevel: 'low',
        });
        const resultatCorrige = JSON.parse(correction.replace(/```json|```/gi, '').trim());
        if (Array.isArray(resultatCorrige.jours)) joursRecus = resultatCorrige.jours;
      } catch (erreurCorrection) {
        console.warn('Correction de la durée Gemini impossible :', erreurCorrection.message);
      }
    }

    const joursNormalises = joursRecus.slice(0, nbJours);
    while (joursNormalises.length < nbJours) {
      const numero = joursNormalises.length + 1;
      joursNormalises.push({
        jour: numero,
        titre: `Découverte et temps libre à ${destination}`,
        matin: `Découverte d’un lieu local à ${destination}.`,
        apresMidi: `Promenade et temps libre à ${destination}.`,
        soir: 'Soirée libre à l’hébergement.',
        coutEstime: 0,
      });
    }

    const joursIA = joursNormalises.map((jour, index) => {
      const coutRecu = Number(jour?.coutEstime);
      const contenuValide = ['titre', 'matin', 'apresMidi', 'soir'].every((champ) =>
        typeof jour?.[champ] === 'string' && jour[champ].trim()
      );
      if (!contenuValide) {
        return {
          jour: index + 1,
          titre: `Découverte et temps libre à ${destination}`,
          matin: `Découverte d’un lieu local à ${destination}.`,
          apresMidi: `Promenade et temps libre à ${destination}.`,
          soir: 'Soirée libre à l’hébergement.',
          coutEstime: 0,
        };
      }
      return {
        jour: index + 1,
        titre: jour.titre.trim(),
        matin: jour.matin.trim(),
        apresMidi: jour.apresMidi.trim(),
        soir: jour.soir.trim(),
        coutEstime: Number.isFinite(coutRecu) && coutRecu >= 0 ? Number(coutRecu.toFixed(2)) : 0,
      };
    });

    const totalActivites = Number(joursIA.reduce((somme, jour) => somme + jour.coutEstime, 0).toFixed(2));
    const totalEstime = Number((totalHebergement + totalActivites).toFixed(2));
    if (totalEstime > budgetTotal) {
      return res.status(422).json({
        message: `Le programme trouvé coûte ${totalEstime} TND, au-dessus du budget de ${budgetTotal} TND. Augmente le budget ou réduis la durée.`,
      });
    }

    const programme = {
      titre: `Séjour de ${nbJours} jour${nbJours > 1 ? 's' : ''} à ${destinationPropre}`,
      destination: destinationPropre,
      dateDebut: dateDebut || null,
      dateFin: dateFin || null,
      duree: nbJours,
      nbJours,
      niveau: niveau || 'Découverte',
      style: style || 'Culture & Patrimoine',
      budget: budgetTotal,
      nombrePersonnes,
      budgetParPersonne,
      moteur: 'Gemini + Catalogue TounesTrip',
      totalActivites,
      totalEstime,
      resteBudget: Number((budgetTotal - totalEstime).toFixed(2)),
      hebergement: {
        ...hebergementCatalogue,
        description: `${hebergementCatalogue.description} Estimation de ${nombreChambres} chambre(s), à confirmer auprès de l’établissement.`,
        nombreChambres,
        nbNuits: nuits,
        totalEstime: totalHebergement,
      },
      jours: joursIA,
      sources: [],
      avertissement: 'Vérifie les lieux, horaires et tarifs avant le départ. Hébergement conseillé, non réservé.',
    };
    return res.json(programme);
  } catch (e) {
    const status = e.status || 500;
    console.error('Erreur de génération Gemini :', e);
    return res.status(status).json({ message: e.message || 'Impossible de générer le programme.' });
  }
});

// Sauvegarder un programme (Sprint 2 - #7)
router.post('/', async (req, res) => {
  try {
    const prog = req.body;
    if (!prog || !prog.destination) {
      return res.status(400).json({ message: 'Données du programme invalides.' });
    }

    const duree = Number(prog.nbJours || prog.duree) || 1;
    const programmeComplet = completerProgramme(prog, prog.destination, Number(prog.budget) || 0, duree);
    const contenuJson = JSON.stringify({ ...programmeComplet, nbJours: duree, duree });

    const [resultat] = await db.query(
      `INSERT INTO programmes (utilisateur_id, titre, destination, budget, duree, contenu_json)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        req.utilisateur.id,
        programmeComplet.titre || `Séjour à ${prog.destination}`,
        programmeComplet.destination,
        Number(programmeComplet.budget) || 0,
        duree,
        contenuJson,
      ]
    );

    res.status(201).json({
      id: resultat.insertId,
      message: 'Programme sauvegardé avec succès.',
      programme: { ...programmeComplet, id: resultat.insertId },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Erreur lors de la sauvegarde du programme.' });
  }
});

// Lister les programmes sauvegardés (Sprint 2 - #7)
router.get('/', async (req, res) => {
  try {
    const [lignes] = await db.query(
      `SELECT id, titre, destination, budget, duree, contenu_json, created_at
       FROM programmes WHERE utilisateur_id = ? ORDER BY id DESC`,
      [req.utilisateur.id]
    );

    const programmes = lignes.map((ligne) => {
      let detail = {};
      try {
        detail = typeof ligne.contenu_json === 'string'
          ? JSON.parse(ligne.contenu_json)
          : (ligne.contenu_json || {});
      } catch {
        detail = {};
      }
      const programme = completerProgramme(detail, ligne.destination, Number(ligne.budget), ligne.duree);
      return {
        ...programme,
        id: ligne.id,
        titre: ligne.titre,
        destination: ligne.destination,
        budget: Number(ligne.budget),
        duree: ligne.duree,
        nb_jours: ligne.duree,
        created_at: ligne.created_at,
        content: {
          ...programme,
          id: ligne.id,
          destination: ligne.destination,
          nbJours: detail.nbJours || ligne.duree,
          budget: Number(ligne.budget),
        },
      };
    });

    res.json(programmes);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Erreur lors du chargement des programmes.' });
  }
});

// Modifier un programme par IA (Sprint 3 - #8)
router.put('/:id/modifier-ia', async (req, res) => {
  const programmeId = Number(req.params.id);
  const instruction = typeof req.body.instruction === 'string' ? req.body.instruction.trim() : '';

  if (!Number.isInteger(programmeId) || programmeId < 1) {
    return res.status(400).json({ message: 'Identifiant de programme invalide.' });
  }
  if (instruction.length < 5 || instruction.length > 1000) {
    return res.status(400).json({ message: 'Décris les changements en 5 à 1000 caractères.' });
  }
  if (!process.env.GEMINI_API_KEY?.trim()) {
    return res.status(503).json({ message: "La modification par IA n'est pas configurée." });
  }

  try {
    const [lignes] = await db.query(
      `SELECT id, titre, destination, budget, duree, contenu_json
       FROM programmes WHERE id = ? AND utilisateur_id = ?`,
      [programmeId, req.utilisateur.id]
    );
    if (!lignes[0]) {
      return res.status(404).json({ message: 'Programme introuvable.' });
    }

    const ligne = lignes[0];
    const contenuBrut = typeof ligne.contenu_json === 'string'
      ? JSON.parse(ligne.contenu_json)
      : (ligne.contenu_json || {});
    const contenu = completerProgramme(contenuBrut, ligne.destination, Number(ligne.budget), ligne.duree);
    const joursExistants = Array.isArray(contenu.jours) ? contenu.jours : [];
    if (joursExistants.length === 0) {
      return res.status(400).json({ message: 'Ce programme ne contient pas d’itinéraire modifiable.' });
    }

    const nombreJours = Number(ligne.duree) || joursExistants.length;
    const nombrePersonnes = Math.max(1, Number(contenu.nombrePersonnes) || 1);
    const budgetParPersonne = Number((Number(ligne.budget) / nombrePersonnes).toFixed(2));
    const budget = Number(ligne.budget) || 0;
    const hebergementActuel = construireHebergement(
      ligne.destination,
      nombreJours,
      nombrePersonnes,
      contenu.hebergement,
      budget
    );
    const budgetActivites = Number((budget - hebergementActuel.totalEstime).toFixed(2));
    if (budgetActivites < 0) {
      return res.status(422).json({
        message: `L’hébergement estimé coûte ${hebergementActuel.totalEstime} TND, au-dessus du budget de ${budget} TND. Augmente le budget ou réduis la durée.`,
      });
    }

    const contexteTunisie = preparerContexteTunisie({
      destination: ligne.destination,
      duree: nombreJours,
      budget,
      nombrePersonnes,
      style: contenu.style,
      centresInteret: instruction,
    });
    const listeLieuxTexte = formaterLieuxPourPrompt(contexteTunisie, ligne.destination);

    const prompt = `Tu es l'assistant officiel de TounesTrip, guide touristique spécialisé exclusivement en Tunisie.
Modifie cet itinéraire selon la demande de l'utilisateur en restant strictement concentré sur "${ligne.destination}" en Tunisie et sur le catalogue TounesTrip ci-dessous.
Si la demande indique un élément à changer sans préciser le remplacement, choisis une alternative tunisienne adaptée dans le catalogue ci-dessous. Ne change pas les autres jours ni les autres activités sans nécessité. Réponds uniquement avec un objet JSON contenant une propriété "jours".

Catalogue de lieux recommandés par TounesTrip pour ${ligne.destination} :
${listeLieuxTexte}

Contraintes :
- Conserve exactement ${nombreJours} jours, dans le même ordre, pour ${nombrePersonnes} voyageur(s).
- Budget TOTAL du groupe : ${budget} TND (${budgetParPersonne} TND/pers).
- Hébergement inclus séparément : ${hebergementActuel.nom}, ${hebergementActuel.totalEstime} TND au total.
- Le coût de toutes les activités, repas et transports ne doit pas dépasser ${budgetActivites} TND pour le groupe.
- Les jours doivent avoir les propriétés jour, titre, matin, apresMidi, soir et coutEstime (en TND pour le groupe entier).

Itinéraire actuel :
${JSON.stringify(joursExistants)}

Demande de modification :
${instruction}`;

    try {
      const texteJson = await appelerGemini({
        prompt,
        jsonMode: true,
        maxOutputTokens: 250 + nombreJours * 220,
        thinkingLevel: 'low',
      });
      if (!texteJson) {
        return res.status(503).json({ message: "La génération IA n'est pas disponible pour le moment." });
      }

      const resultat = JSON.parse(texteJson.replace(/```json|```/gi, '').trim());
      if (!resultat || !Array.isArray(resultat.jours) || resultat.jours.length !== nombreJours) {
        return res.status(502).json({ message: "L'IA n'a pas renvoyé un itinéraire valide. Réessaie avec une autre demande." });
      }

      const jours = resultat.jours.map((jour, index) => {
        if (
          !jour ||
          Number(jour.jour) !== index + 1 ||
          !['titre', 'matin', 'apresMidi', 'soir'].every((champ) =>
            typeof jour[champ] === 'string' && jour[champ].trim()
          )
        ) {
          throw new Error('Itinéraire IA invalide');
        }
        const coutEstime = Number(jour.coutEstime);
        if (!Number.isFinite(coutEstime) || coutEstime < 0) {
          throw new Error('Coût IA invalide');
        }
        return {
          jour: index + 1,
          titre: jour.titre.trim(),
          matin: jour.matin.trim(),
          apresMidi: jour.apresMidi.trim(),
          soir: jour.soir.trim(),
          coutEstime: Number(coutEstime.toFixed(2)),
        };
      });

      const totalActivites = Number(jours.reduce((total, jour) => total + jour.coutEstime, 0).toFixed(2));
      const hebergement = hebergementActuel;
      const totalHebergement = hebergement.totalEstime;
      const totalEstime = Number((totalActivites + totalHebergement).toFixed(2));
      if (totalEstime > budget) {
        return res.status(422).json({
          message: `Cette modification porterait le programme à ${totalEstime} TND, au-dessus du budget de ${budget} TND. Demande des activités moins coûteuses.`,
        });
      }

      const programmeMisAJour = {
        ...contenu,
        id: Number(ligne.id),
        titre: ligne.titre,
        destination: ligne.destination,
        budget,
        nombrePersonnes,
        budgetParPersonne,
        duree: nombreJours,
        nbJours: nombreJours,
        jours,
        totalActivites,
        totalEstime,
        hebergement,
        resteBudget: Number((budget - totalEstime).toFixed(2)),
        moteur: 'Gemini + Catalogue TounesTrip',
      };

      await db.query(
        'UPDATE programmes SET contenu_json = ? WHERE id = ? AND utilisateur_id = ?',
        [JSON.stringify(programmeMisAJour), programmeId, req.utilisateur.id]
      );

      res.json({ message: 'Programme modifié et sauvegardé.', programme: programmeMisAJour });
    } catch (iaErr) {
      console.error('Erreur de modification IA :', iaErr);
      if (iaErr.code === 'GEMINI_TIMEOUT') {
        return res.status(504).json({ message: "L'IA met trop de temps à répondre. Réessaie dans quelques instants." });
      }
      if (iaErr.status === 429) {
        return res.status(429).json({ message: "Les limites Gemini des modèles disponibles sont atteintes. Réessaie plus tard." });
      }
      if (iaErr.status === 403) {
        return res.status(502).json({ message: "La clé Gemini ou l'accès au modèle de secours n'est pas autorisé." });
      }
      if (iaErr.status === 400) {
        return res.status(502).json({ message: "Gemini a refusé la demande. Reformule la modification souhaitée." });
      }
      res.status(502).json({ message: "Gemini n'a pas renvoyé une modification exploitable. Réessaie." });
    }
  } catch (err) {
    console.error('Erreur modification du programme :', err);
    res.status(500).json({ message: 'Erreur lors de la modification du programme.' });
  }
});

// Lire un programme précis (Sprint 2 - #7)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [lignes] = await db.query(
      `SELECT id, titre, destination, budget, duree, contenu_json, created_at
       FROM programmes WHERE id = ? AND utilisateur_id = ?`,
      [id, req.utilisateur.id]
    );
    if (!lignes[0]) {
      return res.status(404).json({ message: 'Programme introuvable.' });
    }

    const ligne = lignes[0];
    let detail = {};
    try {
      detail = typeof ligne.contenu_json === 'string'
        ? JSON.parse(ligne.contenu_json)
        : (ligne.contenu_json || {});
    } catch {
      detail = {};
    }

    const programme = completerProgramme(detail, ligne.destination, Number(ligne.budget), ligne.duree);
    const content = {
      ...programme,
      id: ligne.id,
      destination: ligne.destination,
      nbJours: detail.nbJours || ligne.duree,
      budget: Number(ligne.budget),
    };

    res.json({
      id: ligne.id,
      destination: ligne.destination,
      nb_jours: ligne.duree,
      budget: Number(ligne.budget),
      created_at: ligne.created_at,
      content,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Erreur lors de la lecture du programme.' });
  }
});

// Supprimer un programme sauvegardé (Sprint 2 - #7)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [resultat] = await db.query(
      'DELETE FROM programmes WHERE id = ? AND utilisateur_id = ?',
      [id, req.utilisateur.id]
    );
    if (resultat.affectedRows === 0) {
      return res.status(404).json({ message: 'Programme introuvable.' });
    }
    res.json({ message: 'Programme supprimé.' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Erreur lors de la suppression.' });
  }
});

// Récupérer les avis et la note moyenne d'un programme (Sprint 3 - #9)
router.get('/:id/avis', verifierToken, async (req, res) => {
  try {
    const programmeId = Number(req.params.id);
    if (!programmeId) {
      return res.status(400).json({ message: 'Identifiant de programme invalide.' });
    }

    const [avis] = await db.query(
      `SELECT a.id, a.note, a.commentaire, a.created_at, u.nom AS auteur
       FROM avis_programmes a
       JOIN utilisateurs u ON a.utilisateur_id = u.id
       WHERE a.programme_id = ?
       ORDER BY a.created_at DESC`,
      [programmeId]
    );

    const [stats] = await db.query(
      'SELECT COUNT(*) AS total, ROUND(AVG(note), 1) AS moyenne FROM avis_programmes WHERE programme_id = ?',
      [programmeId]
    );

    res.json({
      moyenne: stats[0].moyenne ? Number(stats[0].moyenne) : 0,
      total: stats[0].total,
      avis,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Erreur lors du chargement des avis.' });
  }
});

// Ajouter ou mettre à jour une note et un avis (Sprint 3 - #9)
router.post('/:id/avis', verifierToken, async (req, res) => {
  try {
    const programmeId = Number(req.params.id);
    const utilisateurId = req.utilisateur.id;
    const note = Number(req.body.note);
    const commentaire = typeof req.body.commentaire === 'string' ? req.body.commentaire.trim() : '';

    if (!programmeId) {
      return res.status(400).json({ message: 'Identifiant de programme invalide.' });
    }
    if (!Number.isInteger(note) || note < 1 || note > 5) {
      return res.status(400).json({ message: 'La note doit être comprise entre 1 et 5.' });
    }

    const [programmes] = await db.query('SELECT id FROM programmes WHERE id = ?', [programmeId]);
    if (programmes.length === 0) {
      return res.status(404).json({ message: 'Programme introuvable.' });
    }

    await db.query(
      `INSERT INTO avis_programmes (programme_id, utilisateur_id, note, commentaire)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE note = VALUES(note), commentaire = VALUES(commentaire), created_at = CURRENT_TIMESTAMP`,
      [programmeId, utilisateurId, note, commentaire || null]
    );

    res.status(201).json({ message: 'Avis enregistré avec succès.' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Erreur lors de l’enregistrement de l’avis.' });
  }
});

module.exports = router;
