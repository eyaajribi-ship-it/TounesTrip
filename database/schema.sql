CREATE DATABASE IF NOT EXISTS tounestrip CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tounestrip;

CREATE TABLE IF NOT EXISTS utilisateurs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  mot_de_passe VARCHAR(255) NOT NULL,
  role ENUM('voyageur', 'admin') NOT NULL DEFAULT 'voyageur',
  actif TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS preferences (
  id INT AUTO_INCREMENT PRIMARY KEY,
  utilisateur_id INT NOT NULL,
  destination VARCHAR(100) NOT NULL,
  date_debut DATE NOT NULL,
  date_fin DATE NOT NULL,
  budget DECIMAL(10,2) NOT NULL,
  duree INT NOT NULL,
  centres_interet VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS offres_catalogue (
  id VARCHAR(40) PRIMARY KEY,
  destination VARCHAR(150) NOT NULL,
  prix_personne DECIMAL(10,2) NOT NULL,
  actif TINYINT(1) NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS offres_departures (
  id INT AUTO_INCREMENT PRIMARY KEY,
  offre_id VARCHAR(40) NOT NULL,
  date_depart DATE NOT NULL,
  places_totales INT NOT NULL DEFAULT 12,
  places_reservees INT NOT NULL DEFAULT 0,
  UNIQUE KEY unique_depart (offre_id, date_depart),
  FOREIGN KEY (offre_id) REFERENCES offres_catalogue(id) ON DELETE CASCADE,
  CHECK (places_totales > 0),
  CHECK (places_reservees >= 0 AND places_reservees <= places_totales)
);

CREATE TABLE IF NOT EXISTS reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  utilisateur_id INT NOT NULL,
  depart_id INT NOT NULL,
  nombre_voyageurs INT NOT NULL,
  prix_total DECIMAL(10,2) NOT NULL,
  statut ENUM('confirmee', 'annulee') NOT NULL DEFAULT 'confirmee',
  mode_paiement ENUM('sur_place') NOT NULL DEFAULT 'sur_place',
  statut_paiement ENUM('a_payer', 'paye') NOT NULL DEFAULT 'a_payer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
  FOREIGN KEY (depart_id) REFERENCES offres_departures(id) ON DELETE RESTRICT,
  CHECK (nombre_voyageurs BETWEEN 1 AND 20)
);

INSERT IGNORE INTO offres_catalogue (id, destination, prix_personne) VALUES
  ('hammamet', 'Hammamet & Nabeul', 329),
  ('djerba', 'Djerba, l’île des rêves', 449),
  ('tunis', 'Tunis, Carthage & Sidi Bou Saïd', 579),
  ('sahara', 'Tozeur & portes du Sahara', 749);

INSERT IGNORE INTO offres_departures (offre_id, date_depart, places_totales) VALUES
  ('hammamet', '2026-12-12', 12), ('hammamet', '2027-01-16', 12), ('hammamet', '2027-02-13', 12), ('hammamet', '2027-03-13', 12), ('hammamet', '2027-04-10', 12), ('hammamet', '2027-05-15', 12), ('hammamet', '2027-06-12', 12),
  ('djerba', '2026-12-12', 12), ('djerba', '2027-01-16', 12), ('djerba', '2027-02-13', 12), ('djerba', '2027-03-13', 12), ('djerba', '2027-04-10', 12), ('djerba', '2027-05-15', 12), ('djerba', '2027-06-12', 12),
  ('tunis', '2026-12-12', 12), ('tunis', '2027-01-16', 12), ('tunis', '2027-02-13', 12), ('tunis', '2027-03-13', 12), ('tunis', '2027-04-10', 12), ('tunis', '2027-05-15', 12), ('tunis', '2027-06-12', 12),
  ('sahara', '2026-12-12', 12), ('sahara', '2027-01-16', 12), ('sahara', '2027-02-13', 12), ('sahara', '2027-03-13', 12), ('sahara', '2027-04-10', 12), ('sahara', '2027-05-15', 12), ('sahara', '2027-06-12', 12);

UPDATE offres_departures SET places_reservees = places_totales WHERE offre_id = 'sahara';
