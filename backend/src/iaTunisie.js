const lieuxParDestination = {
  ariana: [
    ['Parc Ennahli', 'nature', 0],
    ['Palais Ben Ayed', 'culture', 5],
    ['Marché de l’Ariana', 'gastronomie', 10],
    ['Parc de la Soukra', 'nature', 0],
    ['Centre-ville de l’Ariana', 'culture', 0],
    ['Corniche de Gammarth (proche)', 'plage', 0],
    ['Pâtisseries traditionnelles de l’Ariana', 'gastronomie', 12],
    ['Balade dans les quartiers historiques de l’Ariana', 'culture', 0],
    ['Espaces verts de Borj Louzir', 'nature', 0],
  ],
  beja: [
    ['Site antique de Dougga', 'culture', 12],
    ['Médina de Testour', 'culture', 0],
    ['Grande Mosquée de Testour', 'culture', 0],
    ['Paysages du nord-ouest', 'nature', 0],
    ['Barrage Sidi Salem', 'nature', 0],
    ['Ruines romaines de Thugga', 'culture', 12],
    ['Fromageries et produits de Testour', 'gastronomie', 15],
    ['Collines verdoyantes de Béja', 'nature', 0],
    ['Marché local de Béja', 'gastronomie', 10],
  ],
  'ben arous': [
    ['Site archéologique d’Oudhna', 'culture', 10],
    ['Djebel Boukornine', 'nature', 0],
    ['Promenade de Radès', 'plage', 0],
    ['Marché local de Ben Arous', 'gastronomie', 10],
    ['Aqueduc antique près d’Oudhna', 'culture', 0],
    ['Sentier forestier de Boukornine', 'aventure', 5],
    ['Plage de Radès', 'plage', 0],
    ['Vue sur le golfe de Tunis depuis Boukornine', 'nature', 0],
    ['Spécialités de poisson à Radès', 'gastronomie', 18],
  ],
  bizerte: [
    ['Vieux port de Bizerte', 'culture', 0],
    ['Parc national de l’Ichkeul', 'nature', 10],
    ['Cap Angela', 'nature', 0],
    ['Plage de Bizerte', 'plage', 0],
    ['Kasbah de Bizerte', 'culture', 5],
    ['Corniche de Bizerte', 'plage', 0],
    ['Restaurant de fruits de mer au vieux port', 'gastronomie', 22],
    ['Lac Ichkeul et oiseaux migrateurs', 'nature', 10],
    ['Balade dans la médina de Bizerte', 'culture', 0],
  ],
  gabes: [
    ['Oasis maritime de Gabès', 'nature', 0],
    ['Souk Jara', 'gastronomie', 0],
    ['Musée de Gabès', 'culture', 5],
    ['Plage de Chenini Gabès', 'plage', 0],
    ['Palmeraie de Chenini Nahal', 'nature', 0],
    ['Henné et épices du Souk Jara', 'gastronomie', 10],
    ['Sources chaudes d’El Hamma (proche)', 'nature', 8],
    ['Promenade en bord de mer à Gabès', 'plage', 0],
    ['Quartier traditionnel de Menzel', 'culture', 0],
  ],
  gafsa: [
    ['Piscines romaines de Gafsa', 'culture', 0],
    ['Médina de Gafsa', 'culture', 0],
    ['Oasis de Gafsa', 'nature', 0],
    ['Marché de Gafsa', 'gastronomie', 10],
    ['Musée archéologique de Gafsa', 'culture', 6],
    ['Palmeraie et sources de Gafsa', 'nature', 0],
    ['Couscous et plats du Sud à Gafsa', 'gastronomie', 15],
    ['Randonnée douce autour de l’oasis', 'aventure', 8],
    ['Vieille ville et souks de Gafsa', 'culture', 0],
  ],
  jendouba: [
    ['Site antique de Bulla Regia', 'culture', 10],
    ['Site antique de Chemtou', 'culture', 10],
    ['Forêt d’Aïn Draham', 'nature', 0],
    ['Plage de Tabarka', 'plage', 0],
    ['Villas souterraines de Bulla Regia', 'culture', 10],
    ['Barrage Beni Mtir', 'nature', 0],
    ['Randonnée en forêt de Kroumirie', 'aventure', 10],
    ['Grillades et miel de montagne à Aïn Draham', 'gastronomie', 16],
    ['Cascades et sentiers de Jendouba', 'nature', 0],
  ],
  kairouan: [
    ['Grande Mosquée de Kairouan', 'culture', 10],
    ['Bassins des Aghlabides', 'culture', 5],
    ['Médina de Kairouan', 'culture', 0],
    ['Atelier de tapis de Kairouan', 'gastronomie', 10],
    ['Mosquée du Barbier (Zaouia de Sidi Sahbi)', 'culture', 8],
    ['Remparts et portes de la médina', 'culture', 0],
    ['Makroudh artisanal de Kairouan', 'gastronomie', 8],
    ['Musée des arts islamiques de Raqqada', 'culture', 8],
    ['Balade dans les ruelles historiques de Kairouan', 'culture', 0],
  ],
  kasserine: [
    ['Site archéologique de Sbeïtla', 'culture', 10],
    ['Capitole de Sbeïtla', 'culture', 10],
    ['Paysages du Djebel Chambi', 'nature', 0],
    ['Marché local de Kasserine', 'gastronomie', 10],
    ['Basiliques byzantines de Sbeïtla', 'culture', 10],
    ['Parc national de Chambi', 'nature', 8],
    ['Ascension ou sentier du Djebel Chambi', 'aventure', 12],
    ['Saveurs du centre-ouest à Kasserine', 'gastronomie', 12],
    ['Ruines romaines de Cillium (Kasserine)', 'culture', 5],
  ],
  kebili: [
    ['Palmeraie de Kébili', 'nature', 0],
    ['Chott el-Jérid', 'nature', 0],
    ['Dunes du Grand Erg oriental', 'aventure', 30],
    ['Marché de Kébili', 'gastronomie', 10],
    ['Dattes deglet nour dans la palmeraie', 'gastronomie', 8],
    ['Coucher de soleil sur les dunes', 'nature', 15],
    ['Balade à dos de dromadaire', 'aventure', 25],
    ['Village saharien de Sabria', 'culture', 0],
    ['Oasis de Douz / Kébili', 'nature', 0],
  ],
  'le kef': [
    ['Kasbah du Kef', 'culture', 0],
    ['Médina du Kef', 'culture', 0],
    ['Table de Jugurtha', 'nature', 10],
    ['Marché traditionnel du Kef', 'gastronomie', 10],
    ['Basilique Saint-Pierre du Kef', 'culture', 5],
    ['Zaouia de Sidi Bou Makhlouf', 'culture', 0],
    ['Montée vers la Table de Jugurtha', 'aventure', 10],
    ['Cuisine du nord-ouest au Kef', 'gastronomie', 15],
    ['Panorama sur les montagnes du Kef', 'nature', 0],
  ],
  mahdia: [
    ['Skifa el Kahla', 'culture', 0],
    ['Médina de Mahdia', 'culture', 0],
    ['Cimetière marin de Mahdia', 'nature', 0],
    ['Plage de Mahdia', 'plage', 0],
    ['Cap Afrique', 'nature', 0],
    ['Fort Borj El Kebir de Mahdia', 'culture', 8],
    ['Poisson grillé et spécialités côtières', 'gastronomie', 20],
    ['Tissage de soie traditionnelle à Mahdia', 'culture', 5],
    ['Baignade à la plage de Mahdia', 'plage', 0],
  ],
  'la manouba': [
    ['Domaine d’El Battan', 'culture', 0],
    ['Médina de Tébourba', 'culture', 0],
    ['Parc de la Manouba', 'nature', 0],
    ['Marché de la Manouba', 'gastronomie', 10],
    ['Palais de Ksar Saïd', 'culture', 5],
    ['Pont romain de Tébourba', 'culture', 0],
    ['Promenade dans les domaines agricoles', 'nature', 0],
    ['Produits du terroir à La Manouba', 'gastronomie', 12],
    ['Balade au parc de la Manouba', 'nature', 0],
  ],
  medenine: [
    ['Ksar Ouled Soltane', 'culture', 10],
    ['Houmt Souk à Djerba', 'gastronomie', 0],
    ['Djerbahood à Erriadh', 'culture', 0],
    ['Plages de Zarzis', 'plage', 0],
    ['Ksar Haddada', 'culture', 10],
    ['Marché aux poissons de Houmt Souk', 'gastronomie', 15],
    ['Plage de Sidi Mahrez', 'plage', 0],
    ['Oliveraies centenaires de Zarzis', 'nature', 0],
    ['Balade côtière à Zarzis', 'plage', 0],
  ],
  monastir: [
    ['Ribat de Monastir', 'culture', 8],
    ['Mausolée de Bourguiba', 'culture', 0],
    ['Marina de Monastir', 'plage', 0],
    ['Médina de Monastir', 'gastronomie', 10],
    ['Plage de la Falaise à Monastir', 'plage', 0],
    ['Vue panoramique depuis le Ribat', 'culture', 8],
    ['Café et terrasse à la Marina', 'gastronomie', 12],
    ['Promenade en bord de mer à Monastir', 'nature', 0],
    ['Souk et artisanat de Monastir', 'culture', 0],
  ],
  nabeul: [
    ['Médina de Nabeul', 'culture', 0],
    ['Ateliers de poterie de Nabeul', 'culture', 5],
    ['Marché de Nabeul', 'gastronomie', 10],
    ['Plage de Nabeul', 'plage', 0],
    ['Harissa et épices du Cap Bon', 'gastronomie', 10],
    ['Céramique artisanale à Nabeul', 'culture', 5],
    ['Promenade le long de la plage de Nabeul', 'plage', 0],
    ['Vergers et agrumes du Cap Bon', 'nature', 0],
    ['Marché du vendredi à Nabeul', 'gastronomie', 10],
  ],
  sfax: [
    ['Médina de Sfax', 'culture', 0],
    ['Musée Dar Jellouli', 'culture', 5],
    ['Marché central de Sfax', 'gastronomie', 10],
    ['Excursion aux îles Kerkennah', 'nature', 25],
    ['Grande Mosquée de Sfax', 'culture', 0],
    ['Remparts de la médina de Sfax', 'culture', 0],
    ['Charmoula et fruits de mer à Sfax', 'gastronomie', 18],
    ['Balade tranquille aux îles Kerkennah', 'plage', 15],
    ['Musée des arts populaires de Sfax', 'culture', 5],
  ],
  'sidi bouzid': [
    ['Centre-ville de Sidi Bouzid', 'culture', 0],
    ['Marché agricole de Sidi Bouzid', 'gastronomie', 10],
    ['Paysages des oliveraies', 'nature', 0],
    ['Parc urbain de Sidi Bouzid', 'nature', 0],
    ['Balade dans les champs d’oliviers', 'nature', 0],
    ['Produits frais au marché local', 'gastronomie', 10],
    ['Randonnée douce dans les collines', 'aventure', 8],
    ['Découverte du patrimoine local', 'culture', 0],
    ['Détente au parc urbain', 'nature', 0],
  ],
  siliana: [
    ['Site antique de Makthar', 'culture', 10],
    ['Village de Kesra', 'culture', 0],
    ['Paysages de Kesra', 'nature', 0],
    ['Marché de Siliana', 'gastronomie', 10],
    ['Arc de Trajan à Makthar', 'culture', 10],
    ['Randonnée sur les hauteurs de Kesra', 'aventure', 10],
    ['Miel et figues de Kesra', 'gastronomie', 12],
    ['Sentiers naturels de Siliana', 'nature', 0],
    ['Ruines antiques de Mactaris', 'culture', 10],
  ],
  sousse: [
    ['Médina de Sousse', 'culture', 10],
    ['Ribat de Sousse', 'culture', 8],
    ['Musée archéologique de Sousse', 'culture', 10],
    ['Port El Kantaoui', 'plage', 0],
    ['Grande Mosquée de Sousse', 'culture', 8],
    ['Kasbah de Sousse', 'culture', 8],
    ['Plage de Boujaafar', 'plage', 0],
    ['Dîner tunisien dans la médina de Sousse', 'gastronomie', 18],
    ['Promenade à la marina d’El Kantaoui', 'nature', 0],
  ],
  tataouine: [
    ['Ksar Ouled Soltane', 'culture', 10],
    ['Village de Chenini', 'culture', 0],
    ['Village de Douiret', 'nature', 0],
    ['Paysages du Dahar', 'aventure', 20],
    ['Greniers berbères de Ksar Haddada', 'culture', 10],
    ['Mosquée des Sept Dormants à Chenini', 'culture', 0],
    ['Randonnée dans les montagnes du Dahar', 'aventure', 15],
    ['Cornes de gazelle et pâtisseries du Sud', 'gastronomie', 10],
    ['Ancien village abandonné de Douiret', 'nature', 0],
  ],
  tozeur: [
    ['Médina de Tozeur', 'culture', 0],
    ['Palmeraie de Tozeur', 'nature', 0],
    ['Chott el-Jérid', 'nature', 0],
    ['Oasis de montagne de Chebika', 'aventure', 15],
    ['Oasis de Tamerza et cascade', 'nature', 10],
    ['Canyon de Midès', 'aventure', 15],
    ['Musée Dar Chraït', 'culture', 12],
    ['Architecture en briques de la médina', 'culture', 0],
    ['Dattes et cuisine oasienne à Tozeur', 'gastronomie', 15],
  ],
  tunis: [
    ['Médina de Tunis', 'culture', 0],
    ['Musée national du Bardo', 'culture', 13],
    ['Avenue Habib Bourguiba', 'culture', 0],
    ['Marché central de Tunis', 'gastronomie', 10],
    ['Mosquée Zitouna', 'culture', 5],
    ['Parc du Belvédère', 'nature', 0],
    ['Casse-croûte tunisien et plats au marché central', 'gastronomie', 12],
    ['Cité de la Culture de Tunis', 'culture', 0],
    ['Flânerie dans les souks de Tunis', 'culture', 0],
  ],
  zaghouan: [
    ['Temple des Eaux', 'culture', 5],
    ['Aqueduc romain de Zaghouan', 'culture', 0],
    ['Médina de Zaghouan', 'culture', 0],
    ['Randonnée au Djebel Zaghouan', 'nature', 0],
    ['Sources naturelles de Zaghouan', 'nature', 0],
    ['Eau de rose et pâtisseries de Zaghouan', 'gastronomie', 12],
    ['Sentier forestier du Djebel Zaghouan', 'aventure', 10],
    ['Vieille ville de Zaghouan', 'culture', 0],
    ['Vue panoramique sur la plaine', 'nature', 0],
  ],
  djerba: [
    ['Djerbahood à Erriadh', 'culture', 0],
    ['Synagogue de la Ghriba', 'culture', 5],
    ['Musée de Guellala', 'culture', 8],
    ['Plage de Sidi Mahrez', 'plage', 0],
    ['Houmt Souk et son marché', 'gastronomie', 10],
    ['Potiers traditionnels de Guellala', 'culture', 5],
    ['Lagune et flamants roses (selon saison)', 'nature', 0],
    ['Plage de la Seguia', 'plage', 0],
    ['Dîner de fruits de mer à Djerba', 'gastronomie', 22],
  ],
  hammamet: [
    ['Médina de Hammamet', 'culture', 0],
    ['Site archéologique de Pupput', 'culture', 5],
    ['Plage de Hammamet', 'plage', 0],
    ['Marché de Hammamet', 'gastronomie', 10],
    ['Villa Sebastian et jardins', 'culture', 8],
    ['Kasbah de Hammamet', 'culture', 6],
    ['Promenade sur la plage de Hammamet', 'plage', 0],
    ['Cuisine méditerranéenne à Hammamet', 'gastronomie', 18],
    ['Jasmin et jardins de Hammamet', 'nature', 0],
  ],
  'sidi bou said': [
    ['Village de Sidi Bou Saïd', 'culture', 0],
    ['Palais Ennejma Ezzahra', 'culture', 8],
    ['Café des Nattes', 'gastronomie', 10],
    ['Promenade au-dessus du golfe de Tunis', 'nature', 0],
    ['Ruelles bleues et blanches', 'culture', 0],
    ['Bambalouni chaud à Sidi Bou Saïd', 'gastronomie', 6],
    ['Vue sur la mer depuis les hauteurs', 'nature', 0],
    ['Galeries d’art de Sidi Bou Saïd', 'culture', 5],
    ['Descente vers le port de Sidi Bou Saïd', 'plage', 0],
  ],
  carthage: [
    ['Thermes d’Antonin', 'culture', 12],
    ['Colline de Byrsa', 'culture', 12],
    ['Ports puniques de Carthage', 'culture', 12],
    ['Promenade de Carthage', 'nature', 0],
    ['Amphithéâtre romain de Carthage', 'culture', 12],
    ['Quartier Magon et villas romaines', 'culture', 12],
    ['Bord de mer à Carthage', 'plage', 0],
    ['Pause café et pâtisserie près de Byrsa', 'gastronomie', 12],
    ['Cathédrale Saint-Louis sur la colline', 'culture', 0],
  ],
  douz: [
    ['Dunes du Grand Erg oriental', 'aventure', 35],
    ['Musée du Sahara de Douz', 'culture', 5],
    ['Palmeraie de Douz', 'nature', 0],
    ['Marché de Douz', 'gastronomie', 10],
    ['Balade en quad ou 4x4 dans les dunes', 'aventure', 40],
    ['Coucher de soleil dans le désert', 'nature', 15],
    ['Cuisine saharienne à Douz', 'gastronomie', 15],
    ['Place du marché de Douz', 'culture', 0],
    ['Promenade au bord de la palmeraie', 'nature', 0],
  ],
  tabarka: [
    ['Fort génois de Tabarka', 'culture', 0],
    ['Aiguilles de Tabarka', 'nature', 0],
    ['Plage de Tabarka', 'plage', 0],
    ['Forêt de chênes-lièges', 'aventure', 0],
    ['Port de plaisance de Tabarka', 'nature', 0],
    ['Plongée ou balade côtière à Tabarka', 'plage', 20],
    ['Poisson et grillades au port de Tabarka', 'gastronomie', 22],
    ['Randonnée en forêt autour de Tabarka', 'aventure', 10],
    ['Vue depuis le fort génois', 'culture', 0],
  ],
  kelibia: [
    ['Fort de Kélibia', 'culture', 8],
    ['Plage d’El Mansoura', 'plage', 0],
    ['Site punique de Kerkouane', 'culture', 10],
    ['Port de pêche de Kélibia', 'gastronomie', 10],
    ['Plage de la Mansoura', 'plage', 0],
    ['Vue panoramique depuis le fort', 'nature', 0],
    ['Poisson frais au port de Kélibia', 'gastronomie', 20],
    ['Ruines de Kerkouane face à la mer', 'culture', 10],
    ['Balade le long de la côte de Kélibia', 'plage', 0],
  ],
  matmata: [
    ['Maisons troglodytiques de Matmata', 'culture', 0],
    ['Hôtel Sidi Driss et son décor de cinéma', 'culture', 5],
    ['Paysages lunaires de Matmata', 'nature', 0],
    ['Marché de Matmata', 'gastronomie', 10],
    ['Visite d’une habitation troglodytique', 'culture', 8],
    ['Randonnée sur le plateau de Matmata', 'aventure', 12],
    ['Pain tabouna et miel local à Matmata', 'gastronomie', 12],
    ['Collines arides autour de Matmata', 'nature', 0],
    ['Village berbère de Tamezret (proche)', 'culture', 0],
  ],
  tamerza: [
    ['Oasis de Tamerza', 'nature', 0],
    ['Cascade de Tamerza', 'nature', 0],
    ['Ancien village de Tamerza', 'culture', 0],
    ['Canyon de Midès', 'aventure', 0],
    ['Marche dans la palmeraie de Tamerza', 'nature', 0],
    ['Point de vue sur le canyon de Midès', 'aventure', 10],
    ['Ruines de l’ancien village abandonné', 'culture', 0],
    ['Dattes et thé à la menthe près de l’oasis', 'gastronomie', 8],
    ['Randonnée autour des gorges de Tamerza', 'aventure', 12],
  ],
};

const hebergements = {
  ariana: ['Tunis Grand Hotel', 'Hôtel', 180, 'Ariana, Grand Tunis', 'https://www.tunis-grandhotel.com/en/'],
  tunis: ['Dar El Jeld Hotel & Spa', 'Hôtel boutique', 350, 'Médina de Tunis', 'https://www.dareljeld.com/'],
  sousse: ['Dar Antonia', 'Maison d’hôtes', 220, 'Médina de Sousse', 'https://darantonia.com/'],
  nabeul: ['Dar Sabri', 'Maison d’hôtes', 180, 'Médina de Nabeul', 'https://dar-sabri.com/fr/'],
  djerba: ['Dar Bibine', 'Maison d’hôtes', 180, 'Erriadh, Djerba', 'https://www.darbibine.com/'],
  tozeur: ['Dar Tozeur', 'Maison d’hôtes', 220, 'Médina de Tozeur', 'https://dartozeur.com/'],
  tabarka: ['La Cigale Tabarka', 'Hôtel', 300, 'Tabarka', 'https://lacigaletabarka.com/'],
  kairouan: ['Hôtel La Kasbah', 'Hôtel', 180, 'Kairouan', 'https://www.goldenyasmin.com/'],
  sfax: ['Borj Dhiafa', 'Hôtel', 240, 'Sfax', 'https://www.borjdhiafa.com/'],
  douz: ['El Mouradi Douz', 'Hôtel', 160, 'Douz', 'https://www.elmouradi.com/'],
  tataouine: ['Hôtel Dakyanus', 'Hôtel', 140, 'Tataouine', 'https://www.dakyanushotel.com/'],
  matmata: ['Hôtel Sidi Driss', 'Hôtel troglodytique', 90, 'Matmata', ''],
};

const hebergementRegional = {
  'ben arous': 'tunis',
  'la manouba': 'tunis',
  'sidi bou said': 'tunis',
  carthage: 'tunis',
  beja: 'tabarka',
  bizerte: 'tabarka',
  jendouba: 'tabarka',
  'le kef': 'tabarka',
  siliana: 'tabarka',
  gabes: 'matmata',
  gafsa: 'tozeur',
  kasserine: 'kairouan',
  'sidi bouzid': 'kairouan',
  zaghouan: 'tunis',
  kebili: 'douz',
  tamerza: 'tozeur',
  medenine: 'djerba',
  monastir: 'sousse',
  mahdia: 'sousse',
  hammamet: 'nabeul',
  kelibia: 'nabeul',
};

const normaliser = (texte) => String(texte || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

function obtenirHebergement(destination, budget = 300, nbNuits = 1, nombreChambres = 1) {
  const cle = normaliser(destination);
  const hotel = hebergements[cle] || hebergements[hebergementRegional[cle]];
  if (!hotel) {
    return {
      nom: `Maison d’hôtes locale à ${destination}`,
      type: 'Maison d’hôtes',
      prixParNuit: 100,
      description: `Suggestion indicative dans le centre de ${destination}.`,
      lien: '',
    };
  }

  let [nom, type, prixParNuit, ville, lien] = hotel;
  const regionale = normaliser(ville) !== cle && !ville.toLowerCase().includes(cle.toLowerCase());

  const capaciteNuitsChambres = Math.max(1, nbNuits * nombreChambres);
  const budgetMaxHebergement = Number(budget) > 0 ? Number(budget) * 0.65 : prixParNuit * capaciteNuitsChambres;
  if (prixParNuit * capaciteNuitsChambres > budgetMaxHebergement && prixParNuit > 110) {
    prixParNuit = 110;
    type = 'Maison d’hôtes économique';
    nom = `Maison d’hôtes (${ville})`;
  }

  return {
    nom,
    type,
    prixParNuit,
    description: `${ville}${regionale ? ` (hébergement régional, prévoir le trajet vers ${destination})` : ''}.`,
    lien,
  };
}

function construireTagsPrioritaires(style, centresInteret) {
  const texteStyle = normaliser(style);
  const interets = Array.isArray(centresInteret)
    ? centresInteret.map((item) => normaliser(item)).join(' ')
    : normaliser(centresInteret);
  const combine = `${texteStyle} ${interets}`.trim();

  const tags = [];
  const ajouterTag = (tag) => {
    if (!tags.includes(tag)) tags.push(tag);
  };

  if (combine.includes('plage') || combine.includes('mer') || combine.includes('balneaire')) {
    ajouterTag('plage');
  }
  if (combine.includes('sahara') || combine.includes('aventure') || combine.includes('desert') || combine.includes('randonnee')) {
    ajouterTag('aventure');
  }
  if (combine.includes('gastronomie') || combine.includes('cuisine') || combine.includes('plat') || combine.includes('marche')) {
    ajouterTag('gastronomie');
  }
  if (combine.includes('nature') || combine.includes('parc') || combine.includes('foret') || combine.includes('oasis')) {
    ajouterTag('nature');
  }
  if (combine.includes('culture') || combine.includes('histoire') || combine.includes('musee') || combine.includes('medina') || combine.includes('patrimoine')) {
    ajouterTag('culture');
  }

  ['culture', 'nature', 'gastronomie', 'plage', 'aventure'].forEach(ajouterTag);
  return tags;
}

function preparerContexteTunisie({ destination, duree, days, budget, nombrePersonnes = 1, style, centresInteret }) {
  const dest = String(destination || '').trim();
  const cle = normaliser(dest);
  const nbJours = Math.max(1, Math.min(14, Number(days ?? duree) || 3));
  const personnes = Math.max(1, Math.min(20, Number(nombrePersonnes) || 1));
  const nombreChambres = Math.max(1, Math.ceil(personnes / 2));
  const nbNuits = Math.max(0, nbJours - 1);

  const hebergement = obtenirHebergement(dest, budget, nbNuits, nombreChambres);
  const lieuxBruts = lieuxParDestination[cle] || [];
  const tagsPrioritaires = construireTagsPrioritaires(style, centresInteret);

  const lieuxClasses = [...lieuxBruts]
    .sort((a, b) => {
      const ia = tagsPrioritaires.indexOf(a[1]);
      const ib = tagsPrioritaires.indexOf(b[1]);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    })
    .map(([nom, categorie, prixParPersonne]) => ({
      nom,
      categorie,
      prixParPersonne,
      coutGroupe: prixParPersonne * personnes,
    }));

  return {
    destination: dest,
    estDansCatalogue: lieuxClasses.length > 0,
    hebergement,
    nombreChambres,
    nbNuits,
    lieuxRecommandes: lieuxClasses,
  };
}

function choisirActivites(lieux, style, nbJours, budgetVisites, nombrePersonnes = 1, centresInteret = []) {
  const tagsPrioritaires = construireTagsPrioritaires(style, centresInteret);
  const score = (lieu) => {
    const index = tagsPrioritaires.indexOf(lieu[1]);
    return index < 0 ? tagsPrioritaires.length : index;
  };

  const classes = [...lieux].sort((a, b) => score(a) - score(b));
  const selection = [];
  const dejaChoisis = new Set();
  let budgetRestant = Math.max(0, budgetVisites);

  for (let index = 0; index < nbJours * 3; index += 1) {
    const coutGroupe = (lieu) => Number(lieu[2]) * nombrePersonnes;
    let candidats = classes.filter((lieu, rang) => coutGroupe(lieu) <= budgetRestant && !dejaChoisis.has(rang));
    if (candidats.length === 0) {
      dejaChoisis.clear();
      candidats = classes.filter((lieu) => coutGroupe(lieu) <= budgetRestant);
    }
    const lieu = candidats[0] || classes.find((item) => coutGroupe(item) === 0) || classes[0];
    const rang = classes.indexOf(lieu);
    selection.push(lieu);
    dejaChoisis.add(rang);
    budgetRestant = Math.max(0, budgetRestant - coutGroupe(lieu));
  }
  return selection;
}

function genererProgrammeTunisie(params) {
  const destination = String(params.destination || '').trim();
  const cle = normaliser(destination);
  const lieux = lieuxParDestination[cle];
  if (!lieux) {
    const erreur = new Error('Cette destination tunisienne n’est pas encore dans le catalogue local.');
    erreur.status = 400;
    throw erreur;
  }

  const nbJours = Math.max(1, Math.min(14, Number(params.days ?? params.duree) || 3));
  const budget = Math.max(0, Number(params.budget) || 300);
  const nombrePersonnes = Math.max(1, Math.min(20, Number(params.nombrePersonnes) || 1));
  const nombreChambres = Math.max(1, Math.ceil(nombrePersonnes / 2));
  const nbNuits = Math.max(0, nbJours - 1);

  const hebergementBase = obtenirHebergement(destination, budget, nbNuits, nombreChambres);
  const totalHebergement = Number((hebergementBase.prixParNuit * nbNuits * nombreChambres).toFixed(2));
  const repasTransportJour = 25 * nombrePersonnes;
  const budgetVisites = Math.max(0, budget - totalHebergement - (repasTransportJour * nbJours));

  const selection = choisirActivites(
    lieux,
    params.style,
    nbJours,
    budgetVisites,
    nombrePersonnes,
    params.centresInteret
  );

  const jours = [];
  for (let index = 0; index < nbJours; index += 1) {
    const activites = selection.slice(index * 3, index * 3 + 3);
    const [matin, apresMidi, soir] = activites;
    const coutVisites = activites.reduce((total, lieu) => total + (Number(lieu[2]) * nombrePersonnes), 0);
    const coutEstime = Number((coutVisites + repasTransportJour).toFixed(2));
    jours.push({
      jour: index + 1,
      titre: `${matin[0]} et découvertes locales`,
      matin: `Découverte de ${matin[0]} (${matin[1]}).`,
      apresMidi: `Visite et promenade autour de ${apresMidi[0]}.`,
      soir: `Fin de journée à ${soir[0]} et dégustation de spécialités tunisiennes.`,
      coutEstime,
    });
  }

  const totalActivites = Number(jours.reduce((total, jour) => total + jour.coutEstime, 0).toFixed(2));
  const totalEstime = Number((totalActivites + totalHebergement).toFixed(2));
  const budgetParPersonne = Number((budget / nombrePersonnes).toFixed(2));

  return {
    titre: `Séjour de ${nbJours} jour${nbJours > 1 ? 's' : ''} à ${destination}`,
    destination,
    dateDebut: params.dateDebut || null,
    dateFin: params.dateFin || null,
    duree: nbJours,
    nbJours,
    nombrePersonnes,
    budgetParPersonne,
    niveau: params.niveau || 'Découverte',
    style: params.style || 'Culture & Patrimoine',
    budget,
    totalActivites,
    totalEstime,
    resteBudget: Number((budget - totalEstime).toFixed(2)),
    hebergement: {
      ...hebergementBase,
      description: `${hebergementBase.description} Estimation de ${nombreChambres} chambre(s), à confirmer auprès de l’établissement.`,
      nombreChambres,
      nbNuits,
      totalEstime: totalHebergement,
    },
    jours,
    moteur: 'TounesTrip Local',
  };
}

function modifierProgrammeTunisie(programme, instruction) {
  const cle = normaliser(programme.destination);
  const lieux = lieuxParDestination[cle] || lieuxParDestination.tunis;
  const nombrePersonnes = Math.max(1, Number(programme.nombrePersonnes) || 1);
  const budget = Math.max(0, Number(programme.budget) || 0);
  const totalHebergement = Number(programme.hebergement?.totalEstime) || 0;
  const budgetMaxActivites = Math.max(0, budget - totalHebergement);

  const texteInstruction = normaliser(instruction);
  const tagsCibles = construireTagsPrioritaires(texteInstruction, [instruction]);
  const lieuCible = lieux.find((lieu) => tagsCibles.includes(lieu[1])) || lieux[0];

  const joursOriginaux = Array.isArray(programme.jours) ? programme.jours : [];
  const joursModifies = joursOriginaux.map((jour, index) => {
    const copie = {
      jour: index + 1,
      titre: jour.titre,
      matin: jour.matin,
      apresMidi: jour.apresMidi,
      soir: jour.soir,
      coutEstime: Number(jour.coutEstime) || 0,
    };

    if (index === 0 || texteInstruction.includes('tout') || texteInstruction.includes('chaque jour')) {
      const coutLieu = Number(lieuCible[2]) * nombrePersonnes;
      if (texteInstruction.includes('matin')) {
        copie.matin = `Découverte de ${lieuCible[0]} (${lieuCible[1]}).`;
      } else if (texteInstruction.includes('soir')) {
        copie.soir = `Soirée à ${lieuCible[0]} et spécialités locales.`;
      } else {
        copie.apresMidi = `Visite de ${lieuCible[0]} (${lieuCible[1]}).`;
      }
      copie.titre = `${lieuCible[0]} - programme ajusté`;
      copie.coutEstime = Math.max(0, Number((copie.coutEstime + coutLieu).toFixed(2)));
    }

    if (texteInstruction.includes('moins cher') || texteInstruction.includes('econom') || texteInstruction.includes('reduire')) {
      copie.coutEstime = Math.max(25 * nombrePersonnes, Number((copie.coutEstime * 0.8).toFixed(2)));
    }

    return copie;
  });

  let totalActivites = Number(joursModifies.reduce((sum, j) => sum + j.coutEstime, 0).toFixed(2));
  if (budget > 0 && totalActivites > budgetMaxActivites && totalActivites > 0) {
    const ratio = budgetMaxActivites / totalActivites;
    joursModifies.forEach((jour) => {
      jour.coutEstime = Number((jour.coutEstime * ratio).toFixed(2));
    });
    totalActivites = Number(joursModifies.reduce((sum, j) => sum + j.coutEstime, 0).toFixed(2));
  }

  const totalEstime = Number((totalActivites + totalHebergement).toFixed(2));
  return {
    ...programme,
    jours: joursModifies,
    totalActivites,
    totalEstime,
    resteBudget: Number((budget - totalEstime).toFixed(2)),
    moteur: 'TounesTrip Local',
  };
}

module.exports = {
  genererProgrammeTunisie,
  obtenirHebergement,
  modifierProgrammeTunisie,
  preparerContexteTunisie,
};