import { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../AuthContext';

export default function Profil() {
  const { utilisateur, modifierUtilisateur } = useAuth();
  const [profil, setProfil] = useState({ nom: utilisateur?.nom || '', email: utilisateur?.email || '' });
  const [mdp, setMdp] = useState({ ancienMotDePasse: '', nouveauMotDePasse: '', confirmation: '' });
  const [msgProfil, setMsgProfil] = useState('');
  const [errProfil, setErrProfil] = useState('');
  const [msgMdp, setMsgMdp] = useState('');
  const [errMdp, setErrMdp] = useState('');

  useEffect(() => {
    api.lireProfil()
      .then((u) => setProfil({ nom: u.nom, email: u.email }))
      .catch(() => {});
  }, []);

  async function enregistrerProfil(e) {
    e.preventDefault();
    setMsgProfil('');
    setErrProfil('');
    try {
      const rep = await api.modifierProfil(profil.nom, profil.email);
      modifierUtilisateur({ ...utilisateur, nom: rep.nom, email: rep.email });
      setMsgProfil('Informations mises à jour.');
    } catch (err) {
      setErrProfil(err.message);
    }
  }

  async function enregistrerMdp(e) {
    e.preventDefault();
    setMsgMdp('');
    setErrMdp('');
    if (mdp.nouveauMotDePasse !== mdp.confirmation) {
      setErrMdp('Les nouveaux mots de passe ne correspondent pas.');
      return;
    }
    try {
      await api.changerMotDePasse(mdp.ancienMotDePasse, mdp.nouveauMotDePasse);
      setMdp({ ancienMotDePasse: '', nouveauMotDePasse: '', confirmation: '' });
      setMsgMdp('Mot de passe modifié avec succès.');
    } catch (err) {
      setErrMdp(err.message);
    }
  }

  return (
    <>
      <section className="bandeau">
        <h1>Mon profil</h1>
        <p>Gère tes informations personnelles et ton mot de passe.</p>
      </section>

      <div className="profil-grille">
        <form className="carte" onSubmit={enregistrerProfil}>
          <h2>Informations personnelles</h2>
          <p className="discret etape-aide">Modifie ton nom ou ton adresse e-mail.</p>
          <label>
            Nom complet
            <input value={profil.nom} onChange={(e) => setProfil({ ...profil, nom: e.target.value })} required />
          </label>
          <label>
            E-mail
            <input type="email" value={profil.email} onChange={(e) => setProfil({ ...profil, email: e.target.value })} required />
          </label>
          {msgProfil && <p className="succes" role="status">{msgProfil}</p>}
          {errProfil && <p className="erreur" role="alert">{errProfil}</p>}
          <button className="bouton">Enregistrer les modifications</button>
        </form>

        <form className="carte" onSubmit={enregistrerMdp}>
          <h2>Changer le mot de passe</h2>
          <p className="discret etape-aide">Minimum 8 caractères.</p>
          <label>
            Mot de passe actuel
            <input type="password" value={mdp.ancienMotDePasse} onChange={(e) => setMdp({ ...mdp, ancienMotDePasse: e.target.value })} required />
          </label>
          <label>
            Nouveau mot de passe
            <input type="password" minLength={8} value={mdp.nouveauMotDePasse} onChange={(e) => setMdp({ ...mdp, nouveauMotDePasse: e.target.value })} required />
          </label>
          <label>
            Confirmer le mot de passe
            <input type="password" minLength={8} value={mdp.confirmation} onChange={(e) => setMdp({ ...mdp, confirmation: e.target.value })} required />
          </label>
          {msgMdp && <p className="succes" role="status">{msgMdp}</p>}
          {errMdp && <p className="erreur" role="alert">{errMdp}</p>}
          <button className="bouton">Mettre à jour le mot de passe</button>
        </form>
      </div>
    </>
  );
}