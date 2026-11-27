# TounesTrip

Application web de **tourisme intelligent en Tunisie** : l'utilisateur crée son compte, saisit ses préférences de voyage, génère un programme jour par jour grâce à l'IA (Gemini + catalogue des lieux tunisiens), consulte des offres de séjours réservables et discute avec un guide touristique virtuel.

Projet d'intégration – 3ᵉ année Technologies de l'Informatique – ISET Zaghouan.

## Fonctionnalités (backlog Scrum)

| Sprint | Fonctionnalité | Description |
|---|---|---|
| 1 | Créer un compte, se connecter et gérer le profil | Inscription, connexion (JWT), modification du profil et du mot de passe |
| 1 | Saisir ses préférences de voyage | Destination, budget, durée, centres d'intérêt |
| 1 | Générer et afficher le programme de voyage | Programme jour par jour (matin, après-midi, soir), hébergement et coût estimé |
| 2 | Sauvegarder un programme et consulter son historique | Liste « Mes programmes », consultation et suppression |
| 2 | Consulter les offres de séjours en Tunisie et réserver | Offres avec dates de départ, places disponibles, réservation, annulation, paiement sur place |
| 2 | Discuter avec le chatbot guide touristique | Questions sur la Tunisie (période, transport, cuisine, visites…) |
| 3 | Modifier un programme de voyage par l'IA | L'utilisateur demande un changement en langage naturel |
| 3 | Évaluer un programme et laisser un avis | Note et commentaire, note moyenne |
| 3 | Statistiques | Tableau de bord des données de l'application |

## Technologies

- **Frontend** : React 19, Vite, React Router
- **Backend** : Node.js, Express 5, JWT, bcryptjs
- **Base de données** : MySQL (mysql2)
- **IA** : API Google Gemini, guidée par le catalogue de lieux et d'hébergements TounesTrip (`backend/src/iaTunisie.js`)

## Structure du projet

```
TounesTrip/
├── backend/     API Express (src/server.js, routes, authentification, IA)
├── frontend/    Application React (pages, composants, contexte d'authentification)
├── database/    schema.sql : structure MySQL et données des offres
└── docs/        Documentation des sprints
```

## Installation

### Prérequis

- Node.js 18 ou plus
- MySQL (serveur lancé)
- Une clé API Gemini (gratuite sur https://aistudio.google.com/apikey)

### 1. Base de données

Avec XAMPP, démarre d'abord MySQL, puis importe les deux fichiers dans cet ordre :

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p tounestrip < database/schema_complet.sql
```

- `schema.sql` : crée la base `tounestrip` et insère les offres de séjours et leurs dates de départ.
- `schema_complet.sql` : crée toutes les tables (utilisateurs, préférences, programmes, avis, offres, départs, réservations).

Le mot de passe de `root` est vide par défaut avec XAMPP : appuie simplement sur Entrée.

### 2. Backend

```bash
cd backend
npm install
```

Crée un fichier `backend/.env` (ne jamais le publier sur GitHub) :

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=ton_mot_de_passe_mysql
DB_NAME=tounestrip
JWT_SECRET=une_longue_phrase_secrete
GEMINI_API_KEY=ta_cle_gemini
```

Lancer l'API :

```bash
node src/server.js
```

Sous PowerShell (Windows) :

```powershell
cd backend
$env:PORT=5000; node .\src\server.js
```

L'API démarre sur http://localhost:5000 (test : http://localhost:5000/api/health).

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

L'application s'ouvre sur l'adresse affichée par Vite (en général http://localhost:5173).
Si l'API n'est pas sur le port 5000, définir `VITE_API_URL` (ex. `VITE_API_URL=http://localhost:5000/api`).

## Principales routes de l'API

| Route | Rôle |
|---|---|
| `/api/auth` | Inscription et connexion |
| `/api/users` | Profil et mot de passe |
| `/api/preferences` | Préférences de voyage |
| `/api/programmes` | Génération, historique, modification par l'IA, avis |
| `/api/offres` | Offres de séjours, départs et réservations |
| `/api/chatbot` | Guide touristique |
| `/api/statistiques` | Statistiques |
| `/api/health` | État de l'API |

## Comment fonctionne l'IA

Le backend envoie à Gemini une consigne qui contient le **catalogue TounesTrip** (lieux à visiter par destination, hébergements et prix) ainsi que les préférences de l'utilisateur. Gemini compose le programme à partir de ce catalogue et renvoie un JSON (jour, titre, matin, après-midi, soir, coût estimé) que l'application affiche et sauvegarde. Le chatbot utilise le même principe, avec un rôle de guide touristique spécialisé sur la Tunisie.

## Auteure

Eya Ajribi – ISET Zaghouan
