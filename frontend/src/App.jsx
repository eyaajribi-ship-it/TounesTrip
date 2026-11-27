import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import RouteProtegee from './components/RouteProtegee';
import Accueil from './pages/Accueil';
import Inscription from './pages/Inscription';
import Connexion from './pages/Connexion';
import Profil from './pages/Profil';
import Preferences from './pages/Preferences';
import MesProgrammes from './pages/MesProgrammes';
import Statistiques from './pages/Statistiques';
import Chatbot from './pages/Chatbot';
import Offres from './pages/OffresReservation';
import MesReservations from './pages/MesReservations';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="page">
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/offres" element={<Offres />} />
          <Route path="/reservations" element={<RouteProtegee><MesReservations /></RouteProtegee>} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/profil" element={<RouteProtegee><Profil /></RouteProtegee>} />
          <Route path="/preferences" element={<RouteProtegee><Preferences /></RouteProtegee>} />
          <Route path="/programmes" element={<RouteProtegee><MesProgrammes /></RouteProtegee>} />
          <Route path="/statistiques" element={<RouteProtegee><Statistiques /></RouteProtegee>} />
          <Route path="/chatbot" element={<RouteProtegee><Chatbot /></RouteProtegee>} />
        </Routes>
      </main>
      <footer className="pied">
        <p className="pied-bas">© 2026 TounesTrip · Ton programme de voyage en Tunisie, jour par jour.</p>
      </footer>
    </>
  );
}
