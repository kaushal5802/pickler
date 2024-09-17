import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import TournamentCreation from './components/TournamentCreation';
import MatchSetup from './components/MatchSetup';
import ScoreTracker from './components/ScoreTracker';
import Leaderboard from './components/Leaderboard';
import UserProfile from './components/UserProfile';
import MatchHistory from './components/MatchHistory';
import TournamentList from './components/TournamentList';
import Statistics from './components/Statistics';
import TeamList from './components/TeamList';
import TournamentBracket from './components/TournamentBracket';
import TournamentScoreTracker from './components/TournamentScoreTracker';



const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return currentUser ? children : <Navigate to="/auth" />;
};

const PublicRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return !currentUser ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 text-white">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
              <Route path="/auth" element={<PublicRoute><Auth /></PublicRoute>} />
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/create-tournament" element={<PrivateRoute><TournamentCreation /></PrivateRoute>} />
              <Route path="/match-setup" element={<PrivateRoute><MatchSetup /></PrivateRoute>} />
              <Route path="/score-tracker/:matchId" element={<PrivateRoute><ScoreTracker /></PrivateRoute>} />
              <Route path="/leaderboard" element={<PrivateRoute><Leaderboard /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
              <Route path="/match-history" element={<PrivateRoute><MatchHistory /></PrivateRoute>} />
              <Route path="/tournaments" element={<PrivateRoute><TournamentList /></PrivateRoute>} />
              <Route path="/statistics" element={<PrivateRoute><Statistics /></PrivateRoute>} />
              <Route path="/tournament/:tournamentId/bracket" element={<TournamentBracket />} />
              <Route path="/tournament/:tournamentId/match/:matchIndex" element={<TournamentScoreTracker />} />
              <Route path="/teams" element={<PrivateRoute><TeamList /></PrivateRoute>} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;