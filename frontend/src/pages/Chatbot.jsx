import { useEffect, useRef, useState } from 'react';
import { api } from '../api';

const SUGGESTIONS = [
  'Que visiter à Sidi Bou Saïd ?',
  'Meilleure saison pour le Sahara ?',
  'Spécialités culinaires à Djerba',
  'Comment aller de Tunis à Sousse ?',
];

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      auteur: 'bot',
      texte: 'Aslema ! Je suis ton guide touristique TounesTrip. Pose-moi une question sur une ville, un site ou ton budget en Tunisie.',
    },
  ]);
  const [saisie, setSaisie] = useState('');
  const [chargement, setChargement] = useState(false);
  const finRef = useRef(null);

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chargement]);

  async function envoyer(texteQuestion) {
    const question = (texteQuestion ?? saisie).trim();
    if (!question || chargement) return;

    const suivants = [...messages, { auteur: 'user', texte: question }];
    setMessages(suivants);
    setSaisie('');
    setChargement(true);

    try {
      const rep = await api.envoyerChatbot(question);
      setMessages([...suivants, { auteur: 'bot', texte: rep.reply }]);
    } catch (err) {
      setMessages([...suivants, { auteur: 'bot', texte: 'Erreur : ' + err.message }]);
    } finally {
      setChargement(false);
    }
  }

  return (
    <>
      <section className="bandeau">
        <h1>Guide touristique</h1>
        <p>Discute avec ton assistant pour préparer ton voyage en Tunisie.</p>
      </section>

      <div className="carte chat-conteneur">
        <div className="chat-suggestions">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              className="bouton secondaire chat-chip"
              onClick={() => envoyer(s)}
              disabled={chargement}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="chat-messages" role="log" aria-live="polite">
          {messages.map((m, i) => (
            <div key={i} className={`chat-bulle ${m.auteur}`}>
              <span className="chat-auteur">{m.auteur === 'bot' ? '✈ Guide TounesTrip' : 'Moi'}</span>
              <p>{m.texte}</p>
            </div>
          ))}
          {chargement && (
            <div className="chat-bulle bot">
              <span className="chat-auteur">✈ Guide TounesTrip</span>
              <p className="discret">Réflexion en cours...</p>
            </div>
          )}
          <div ref={finRef} />
        </div>

        <form
          className="chat-saisie"
          onSubmit={(e) => {
            e.preventDefault();
            envoyer();
          }}
        >
          <input
            type="text"
            placeholder="Pose ta question sur la Tunisie..."
            value={saisie}
            onChange={(e) => setSaisie(e.target.value)}
            disabled={chargement}
          />
          <button className="bouton" disabled={chargement || !saisie.trim()}>
            Envoyer
          </button>
        </form>
      </div>
    </>
  );
}