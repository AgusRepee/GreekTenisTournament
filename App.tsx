import React, { useState, Suspense, lazy } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CookieBanner } from './components/CookieBanner';
import { HomeScreen } from './screens/HomeScreen';
import { DirectoryScreen } from './screens/DirectoryScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { RankingsScreen } from './screens/RankingsScreen';
import { PlayerSearchScreen } from './screens/PlayerSearchScreen';
import { ContactScreen } from './screens/ContactScreen';

const TournamentDetailScreen = lazy(() => import('./screens/TournamentDetailScreen').then((m) => ({ default: m.TournamentDetailScreen })));

const App: React.FC = () => {
  const [currentScreen, setScreen] = useState('home');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [selectedTournamentId, setSelectedTournamentId] = useState<string | null>(null);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home': return <HomeScreen setScreen={setScreen} setSelectedTournamentId={setSelectedTournamentId} />;
      case 'directory': return <DirectoryScreen setScreen={setScreen} setSelectedTournamentId={setSelectedTournamentId} />;
      case 'profile': return <ProfileScreen selectedPlayerId={selectedPlayerId} />;
      case 'rankings': return <RankingsScreen setScreen={setScreen} setSelectedPlayerId={setSelectedPlayerId} />;
      case 'players': return <PlayerSearchScreen setScreen={setScreen} setSelectedPlayerId={setSelectedPlayerId} />;
      case 'contact': return <ContactScreen />;
      case 'tournament_detail':
        return (
          <Suspense fallback={<div className="flex flex-1 items-center justify-center py-20 text-[#616f89] dark:text-gray-400">Cargando torneo...</div>}>
            <TournamentDetailScreen tournamentId={selectedTournamentId} setScreen={setScreen} />
          </Suspense>
        );
      default: return <HomeScreen setScreen={setScreen} setSelectedTournamentId={setSelectedTournamentId} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Navbar currentScreen={currentScreen} setScreen={setScreen} />
      <div className="flex-1 flex flex-col">
        {renderScreen()}
      </div>
      <Footer setScreen={setScreen} />
      <CookieBanner />
    </div>
  );
};

export default App;