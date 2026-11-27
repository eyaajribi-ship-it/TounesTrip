import { useEffect, useState } from 'react';
import { api } from '../api';

function AfficherEtoiles({ valeur, taille = '1.15rem' }) {
  const note = Math.round(Number(valeur) || 0);

  return (
    <span className="avis-etoiles" aria-label={`${valeur} sur 5`}>
      {[1, 2, 3, 4, 5].map((etoile) => (
        <span key={etoile} aria-hidden="true" className={etoile <= note ? 'pleine' : ''} style={{ fontSize: taille }}>
          ★
        </span>
      ))}
    </span>
  );
}

export default function AvisProgramme({ programmeId }) {
  const [donnees, setDonnees] = useState({ moyenne: 0, total: 0, avis: [] });
  const [note, setNote] = useState(0);
  const [commentaire, setCommentaire] = useState('');
  const [message, setMessage] = useState('');
  const [chargement, setChargement] = useState(false);

  async function chargerAvis() {
    try {
      const data = await api.lireAvisProgramme(programmeId);
      setDonnees(data);
    } catch (err) {
      setMessage(err.message);
    }
  }

  useEffect(() => {
    if (programmeId) chargerAvis();
  }, [programmeId]);

  async function envoyerAvis(e) {
    e.preventDefault();
    if (!note) {
      setMessage('Choisis une note avant de publier.');
      return;
    }

    setChargement(true);
    setMessage('');
    try {
      await api.publierAvisProgramme(programmeId, note, commentaire);
      setMessage('Avis enregistré.');
      setCommentaire('');
      await chargerAvis();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setChargement(false);
    }
  }

  return (
    <section className="carte avis-programme" aria-labelledby="titre-avis">
      <h3 id="titre-avis">Avis et évaluations</h3>
      <div className="avis-moyenne">
        <AfficherEtoiles valeur={donnees.moyenne} taille="1.4rem" />
        <span>
          {donnees.total > 0
            ? `${donnees.moyenne} / 5 · ${donnees.total} avis`
            : 'Aucun avis pour le moment'}
        </span>
      </div>

      <form onSubmit={envoyerAvis} className="avis-formulaire">
        <fieldset className="avis-choix-note">
          <legend>Votre note</legend>
          <div role="group" aria-label="Choisir une note sur 5" className="avis-etoiles-choix">
            {[1, 2, 3, 4, 5].map((valeur) => (
              <button
                key={valeur}
                type="button"
                className={`avis-etoile-bouton${valeur <= note ? ' selectionnee' : ''}`}
                aria-label={`Noter ${valeur} sur 5`}
                aria-pressed={note === valeur}
                onClick={() => {
                  setNote(valeur);
                  setMessage('');
                }}
              >
                ★
              </button>
            ))}
          </div>
          <span className="discret">{note ? `${note} sur 5` : 'Clique sur une étoile'}</span>
        </fieldset>

        <label className="avis-label" htmlFor="commentaire-avis">Votre commentaire (facultatif)</label>
        <textarea
          id="commentaire-avis"
          rows={3}
          placeholder="Racontez votre expérience avec ce programme..."
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value)}
        />

        <button type="submit" className="bouton" disabled={chargement || !note}>
          {chargement ? 'Envoi...' : 'Publier mon avis'}
        </button>
      </form>

      {message && <p className="avis-message" role="status" aria-live="polite">{message}</p>}

      {donnees.avis.length > 0 && (
        <ul className="avis-liste">
          {donnees.avis.map((item) => (
            <li key={item.id}>
              <div className="avis-auteur">
                <strong>{item.auteur}</strong>
                <AfficherEtoiles valeur={item.note} />
                <span className="discret">{item.note}/5</span>
              </div>
              {item.commentaire && <p>{item.commentaire}</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
