export default function Programme({ programme, actions }) {
  const nuitsHebergement = Number(programme.hebergement?.nbNuits ?? Math.max(0, Number(programme.nbJours || programme.duree || 1) - 1));
  const totalHebergement = Number(programme.hebergement?.totalEstime ?? (Number(programme.hebergement?.prixParNuit || 0) * nuitsHebergement));
  const totalActivites = Number(programme.totalActivites ?? programme.totalEstime ?? 0);
  const totalEstime = Number(programme.totalActivites != null ? programme.totalEstime : totalActivites + totalHebergement);
  const resteBudget = Number(programme.budget || 0) - totalEstime;
  const nombrePersonnes = Math.max(1, Number(programme.nombrePersonnes) || 1);
  const budgetParPersonne = Number(programme.budgetParPersonne ?? (Number(programme.budget || 0) / nombrePersonnes));
  const coutParPersonne = totalEstime / nombrePersonnes;
  return (
    <article className="carte programme">
      <header className="programme-tete">
        <div>
          <h3>{programme.destination}</h3>
          <p className="discret">
            {programme.nbJours} jour{programme.nbJours > 1 ? 's' : ''} {String.fromCharCode(183)} budget groupe {programme.budget} TND {String.fromCharCode(183)}
            {nombrePersonnes} voyageur{nombrePersonnes > 1 ? 's' : ''} {String.fromCharCode(183)} {budgetParPersonne.toFixed(2)} TND/personne {String.fromCharCode(183)}
            niveau {programme.niveau}
            {programme.style ? ` ${String.fromCharCode(183)} ${programme.style}` : ''}
          </p>
        </div>
        {actions && <div className="actions">{actions}</div>}
      </header>

      {(
        <section className="hebergement">
          <h4>H&eacute;bergement conseill&eacute;</h4>
          <p><strong>Nom : {programme.hebergement.nom}</strong></p>
          <p>Type : {programme.hebergement.type}</p>
          <p>{programme.hebergement.description}</p>
          <p className="discret">Prix indicatif : {programme.hebergement.prixParNuit} TND par chambre et par nuit · {programme.hebergement.nombreChambres || 1} chambre{(programme.hebergement.nombreChambres || 1) > 1 ? 's' : ''} · {nuitsHebergement} nuit{nuitsHebergement > 1 ? 's' : ''} · total : {totalHebergement} TND</p>
          {programme.hebergement.lien && <p><a href={programme.hebergement.lien} target="_blank" rel="noreferrer">Consulter l’&eacute;tablissement</a></p>}
        </section>
      )}

      <ol className="jours">
        {programme.jours.map((j) => (
          <li key={j.jour} className="jour">
            <div className="jour-num">J{j.jour}</div>
            <div className="jour-corps">
              <h4>{j.titre}</h4>
              <dl>
                <dt>Matin</dt>
                <dd>{j.matin}</dd>
                <dt>Apr&egrave;s-midi</dt>
                <dd>{j.apresMidi}</dd>
                <dt>Soir</dt>
                <dd>{j.soir}</dd>
              </dl>
              <p className="cout">Co&ucirc;t estim&eacute; : {j.coutEstime} TND</p>
            </div>
          </li>
        ))}
      </ol>

      <footer className="bilan">
        <div>
          <span>Activit&eacute;s et d&eacute;penses quotidiennes</span>
          <strong>{totalActivites} TND</strong>
        </div>
        {(
          <div>
            <span>H&eacute;bergement ({nuitsHebergement} nuit{nuitsHebergement > 1 ? 's' : ''})</span>
            <strong>{totalHebergement} TND</strong>
          </div>
        )}
        <div>
          <span>Total estim&eacute;</span>
          <strong>{totalEstime} TND</strong>
        </div>
        <div>
          <span>Co&ucirc;t estim&eacute; par personne</span>
          <strong>{coutParPersonne.toFixed(2)} TND</strong>
        </div>
        <div>
          <span>Reste sur le budget</span>
          <strong className={resteBudget < 0 ? 'negatif' : ''}>{resteBudget} TND</strong>
        </div>
      </footer>
      {Array.isArray(programme.sources) && programme.sources.length > 0 && (
        <section className="sources-programme" aria-label="Sources de recherche">
          <h4>Sources consultées</h4>
          <ul>
            {programme.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noreferrer">{source.titre}</a>
              </li>
            ))}
          </ul>
          <p className="discret">Tarifs indicatifs, à confirmer auprès de l’établissement avant réservation.</p>
        </section>
      )}
    </article>
  );
}
