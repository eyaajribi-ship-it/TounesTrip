async function demanderAuModele({ prompt, cleApi, modele, jsonMode, maxOutputTokens, thinkingLevel }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modele}:generateContent?key=${encodeURIComponent(cleApi.trim())}`;

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
  };

  if (jsonMode) {
    body.generationConfig = {
      responseMimeType: 'application/json',
      maxOutputTokens,
    };
    if (thinkingLevel) {
      body.generationConfig.thinkingConfig = { thinkingLevel };
    }
  }

  const controleur = new AbortController();
  const timeout = setTimeout(() => controleur.abort(), 60000);

  try {
    const reponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controleur.signal,
    });

    if (!reponse.ok) {
      const texteErreur = await reponse.text();
      const erreur = new Error(`Erreur Gemini (${reponse.status}) : ${texteErreur}`);
      erreur.status = reponse.status;
      throw erreur;
    }

    const data = await reponse.json();
    const texte = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!texte) {
      throw new Error('Réponse IA vide');
    }
    return texte;
  } catch (e) {
    if (controleur.signal.aborted) {
      const erreur = new Error('Gemini ne répond pas après 60 secondes.');
      erreur.code = 'GEMINI_TIMEOUT';
      throw erreur;
    }
    throw e;
  } finally {
    clearTimeout(timeout);
  }
}

async function appelerGemini({ prompt, jsonMode = false, maxOutputTokens, thinkingLevel }) {
  const cleApi = process.env.GEMINI_API_KEY;
  if (!cleApi || !cleApi.trim()) {
    return null;
  }

  const modelePrincipal = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
  const modeleSecours = process.env.GEMINI_FALLBACK_MODEL || 'gemini-3.5-flash-lite';
  const options = { prompt, cleApi, jsonMode, maxOutputTokens, thinkingLevel };

  try {
    return await demanderAuModele({ ...options, modele: modelePrincipal, thinkingLevel });
  } catch (e) {
    if ((![429, 503].includes(e.status) && e.code !== 'GEMINI_TIMEOUT') || modeleSecours === modelePrincipal) {
      throw e;
    }

    console.warn(`Gemini ${modelePrincipal} indisponible (${e.status}), essai avec ${modeleSecours}.`);
    return demanderAuModele({ ...options, modele: modeleSecours });
  }
}

async function rechercherAvecGemini({ prompt, jsonMode = true, maxOutputTokens = 1800 }) {
  const cleApi = process.env.GEMINI_API_KEY;
  if (!cleApi || !cleApi.trim()) return null;

  const modele = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modele}:generateContent?key=${encodeURIComponent(cleApi.trim())}`;
  const controleur = new AbortController();
  const timeout = setTimeout(() => controleur.abort(), 25000);

  try {
    const reponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        tools: [{ googleSearch: {} }],
        generationConfig: jsonMode
          ? { responseMimeType: 'application/json', maxOutputTokens }
          : { maxOutputTokens },
      }),
      signal: controleur.signal,
    });

    if (!reponse.ok) {
      const texteErreur = await reponse.text();
      const erreur = new Error(`Erreur Gemini (${reponse.status}) : ${texteErreur}`);
      erreur.status = reponse.status;
      throw erreur;
    }

    const data = await reponse.json();
    const candidate = data?.candidates?.[0];
    const texte = candidate?.content?.parts?.map((part) => part.text || '').join('').trim();
    if (!texte) throw new Error('Réponse Gemini vide.');

    const chunks = candidate?.groundingMetadata?.groundingChunks || [];
    const sources = chunks
      .map((chunk) => chunk.web)
      .filter((web) => web && typeof web.uri === 'string' && /^https?:\/\//i.test(web.uri))
      .map((web) => ({ titre: String(web.title || web.uri), url: web.uri }));

    return {
      texte,
      sources: [...new Map(sources.map((source) => [source.url, source])).values()],
      recherches: candidate?.groundingMetadata?.webSearchQueries || [],
    };
  } catch (e) {
    if (controleur.signal.aborted) {
      const erreur = new Error('La recherche Gemini a dépassé le délai de 25 secondes.');
      erreur.code = 'GEMINI_TIMEOUT';
      throw erreur;
    }
    throw e;
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = { appelerGemini, rechercherAvecGemini };
