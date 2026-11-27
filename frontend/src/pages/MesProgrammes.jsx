import { useEffect, useState } from 'react';
import { api } from '../api';
import Programme from './Programme';
import AvisProgramme from '../components/AvisProgramme';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useRef } from 'react';

function formaterDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function MesProgrammes() {
  const [liste, setListe] = useState(null);
  const [ouvert, setOuvert] = useState(null);
  const [erreur, setErreur] = useState('');
  const [editionIA, setEditionIA] = useState(false);
  const [instruction, setInstruction] = useState('');
  const [chargementIA, setChargementIA] = useState(false);
  const [messageIA, setMessageIA] = useState('');
  const detailRef = useRef(null);
  const { deconnecter } = useAuth();
  const navigate = useNavigate();

  function gererSessionExpiree(err) {
    if (err.status !== 401) return false;
    deconnecter();
    navigate('/connexion', { state: { message: 'Ta session a expiré. Connecte-toi à nouveau pour consulter tes programmes.' } });
    return true;
  }

  useEffect(() => {
    if (ouvert) detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [ouvert]);

  async function charger() {
    try {
      setListe(await api.listerProgrammes());
    } catch (err) {
      if (!gererSessionExpiree(err)) setErreur(err.message);
    }
  }

  useEffect(() => {
    charger();
  }, []);

  async function voir(id) {
    setErreur('');
    setMessageIA('');
    setEditionIA(false);
    try {
      const rep = await api.lireProgramme(id);
      setOuvert({ id, programme: rep.content });
    } catch (err) {
      if (!gererSessionExpiree(err)) setErreur(err.message);
    }
  }

  async function modifierAvecIA(e) {
    e.preventDefault();
    if (!ouvert || chargementIA) return;
    setMessageIA('');
    setChargementIA(true);
    try {
      const resultat = await api.modifierProgrammeAvecIA(ouvert.id, instruction.trim());
      setOuvert((courant) => ({ ...courant, programme: resultat.programme }));
      setInstruction('');
      setEditionIA(false);
      setMessageIA(resultat.message);
    } catch (err) {
      setMessageIA(err.message);
    } finally {
      setChargementIA(false);
    }
  }

  async function supprimer(id) {
    if (!window.confirm('Supprimer ce programme ?')) return;
    setErreur('');
    try {
      await api.supprimerProgramme(id);
      if (ouvert && ouvert.id === id) setOuvert(null);
      await charger();
    } catch (err) {
      setErreur(err.message);
    }
  }

  if (!liste) return <p className="discret">{erreur || 'Chargement...'}</p>;

  return (
    <div className="mes-programmes">
      <section>
        <h2>Mes programmes</h2>
        {erreur && <p className="erreur" role="alert">{erreur}</p>}
        {liste.length === 0 && (
          <div className="vide">
            <p>Aucun programme sauvegardé pour le moment.</p>
            <p className="discret">Génère un voyage dans « Planifier » puis sauvegarde-le ici.</p>
          </div>
        )}
        <ul className="liste">
          {liste.map((p) => (
            <li key={p.id} className={'carte ligne' + (ouvert && ouvert.id === p.id ? ' actif' : '')}>
              <div>
                <strong>{p.destination}</strong>
                <p className="discret">
                  {p.nb_jours} jour{p.nb_jours > 1 ? 's' : ''} · {p.nombrePersonnes || 1} voyageur{(p.nombrePersonnes || 1) > 1 ? 's' : ''} · {p.budget} TND · créé le {formaterDate(p.created_at)}
                </p>
              </div>
              <div className="actions">
                <button type="button" className="bouton secondaire" onClick={() => voir(p.id)}>Voir</button>
                <button type="button" className="bouton danger" onClick={() => supprimer(p.id)}>Supprimer</button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {ouvert && (
        <div ref={detailRef} className="detail-programme">
          <Programme
            programme={ouvert.programme}
            actions={(
              <button
                type="button"
                className="bouton secondaire"
                onClick={() => {
                  setEditionIA(!editionIA);
                  setMessageIA('');
                }}
              >
                {editionIA ? 'Fermer la modification' : 'Modifier avec l’IA'}
              </button>
            )}
          />

          {editionIA && (
            <form className="carte editeur-ia" onSubmit={modifierAvecIA}>
              <h3>Comment veux-tu modifier l’itinéraire ?</h3>
              <p className="discret">La destination, la durée et le budget seront conservés.</p>
              <label htmlFor="instruction-ia">Changements souhaités</label>
              <textarea
                id="instruction-ia"
                rows={4}
                minLength={5}
                maxLength={1000}
                required
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                placeholder="Ex. Remplace les activités en intérieur par des visites de plein air et ajoute une pause déjeuner locale."
              />
              <div className="actions">
                <button type="submit" className="bouton" disabled={chargementIA || instruction.trim().length < 5}>
                  {chargementIA ? 'Modification en cours…' : 'Générer et sauvegarder'}
                </button>
                <button type="button" className="bouton secondaire" disabled={chargementIA} onClick={() => setEditionIA(false)}>
                  Annuler
                </button>
              </div>
            </form>
          )}

          {messageIA && <p className="succes" role="status">{messageIA}</p>}
          <AvisProgramme programmeId={ouvert.id} />
        </div>
      )}
    </div>
  );
}
