import { useState } from 'react';
import { api } from '../api';
import Programme from './Programme';

const DESTINATIONS = [
  "Ariana", "Béja", "Ben Arous", "Bizerte", "Gabès", "Gafsa", "Jendouba",
  "Kairouan", "Kasserine", "Kébili", "Le Kef", "Mahdia", "La Manouba",
  "Médenine", "Monastir", "Nabeul", "Sfax", "Sidi Bouzid", "Siliana",
  "Sousse", "Tataouine", "Tozeur", "Tunis", "Zaghouan",
  "Djerba", "Hammamet", "Sidi Bou Saïd", "Carthage", "Douz", "Tabarka",
  "Kélibia", "Matmata", "Tamerza",
].sort((a, b) => a.localeCompare(b, "fr"));

const STYLES = [
  "Culture & Patrimoine",
  "Plage & Détente",
  "Sahara & Aventure",
  "Gastronomie & Découverte",
];

export default function Preferences() {
  const [form, setForm] = useState(() => {
    try {
      const offre = JSON.parse(sessionStorage.getItem('offreChoisie'));
      if (offre) {
        sessionStorage.removeItem('offreChoisie');
        return { ...offre, days: String(offre.days), nombrePersonnes: String(offre.nombrePersonnes), budget: String(offre.budget) };
      }
    } catch {
      sessionStorage.removeItem('offreChoisie');
    }
    return { destination: 'Ariana', days: '', nombrePersonnes: '1', budget: '', style: '' };
  });
  const [programme, setProgramme] = useState(null);
  const [erreur, setErreur] = useState('');
  const [message, setMessage] = useState('');
  const [chargement, setChargement] = useState(false);
  const [sauvegarde, setSauvegarde] = useState(false);

  async function generer(e) {
    e.preventDefault();
    setErreur('');
    setMessage('');
    setSauvegarde(false);
    setChargement(true);
    try {
      const data = await api.genererProgramme({
        ...form,
        days: Number(form.days),
        nombrePersonnes: Number(form.nombrePersonnes),
        budget: Number(form.budget),
      });
      setProgramme(data);
    } catch (err) {
      setErreur(err.message);
    } finally {
      setChargement(false);
    }
  }

  async function sauvegarder() {
    if (!programme || sauvegarde) return;
    setErreur('');
    setMessage('');
    try {
      await api.sauvegarderProgramme(programme);
      setSauvegarde(true);
      setMessage('Programme sauvegardé dans « Mes programmes ».');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setErreur(err.message);
    }
  }

  if (programme) {
    return (
      <>
        {message && <p className="succes" role="status">{message}</p>}
        {erreur && <p className="erreur" role="alert">{erreur}</p>}
        <Programme
          programme={programme}
          actions={
            <>
              <button type="button" className="bouton secondaire" onClick={() => setProgramme(null)}>
                ← Modifier le voyage
              </button>
              <button type="button" className="bouton" onClick={sauvegarder} disabled={sauvegarde}>
                {sauvegarde ? 'Sauvegardé ✓' : 'Sauvegarder'}
              </button>
            </>
          }
        />
      </>
    );
  }

  return (
    <>
      <section className="bandeau">
        <h1>Où pars-tu ?</h1>
      </section>

      <form className="carte formulaire" onSubmit={generer}>
        <h2>Nouveau voyage</h2>
        <p className="discret etape-aide">Choisis ta destination, ta durée, ton style et ton budget.</p>
        <label>
          Destination
          <select
            value={form.destination}
            onChange={(e) => setForm({ ...form, destination: e.target.value })}
            required
          >
            {DESTINATIONS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </label>
        <label>
          Durée (jours)
          <input
            type="number"
            min="1"
            max="14"
            placeholder="Ex. 3"
            value={form.days}
            onChange={(e) => setForm({ ...form, days: e.target.value })}
            required
          />
        </label>
        <label>
          Nombre de voyageurs
          <input
            type="number"
            min="1"
            max="20"
            value={form.nombrePersonnes}
            onChange={(e) => setForm({ ...form, nombrePersonnes: e.target.value })}
            required
          />
        </label>
        <label>
          Budget total du groupe (TND)
          <input
            type="number"
            min="20"
            placeholder="Ex. 500"
            value={form.budget}
            onChange={(e) => setForm({ ...form, budget: e.target.value })}
            required
          />
        </label>
        <label>
          Style de séjour
          <select
            value={form.style}
            onChange={(e) => setForm({ ...form, style: e.target.value })}
          >
            {STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        {erreur && <p className="erreur" role="alert">{erreur}</p>}
        <button className="bouton" disabled={chargement}>
          {chargement ? 'Génération...' : 'Générer mon programme'}
        </button>
      </form>
    </>
  );
}



