import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const TournamentScoreTracker = () => {
  const { tournamentId, matchIndex } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [match, setMatch] = useState(null);
  const [scores, setScores] = useState({ team1: 0, team2: 0 });

  useEffect(() => {
    const fetchMatch = async () => {
      // Parse URL parameters
      const params = new URLSearchParams(location.search);
      const initialMatch = {
        team1: { name: params.get('team1') },
        team2: { name: params.get('team2') },
        score: {
          team1: parseInt(params.get('score1') || 0),
          team2: parseInt(params.get('score2') || 0)
        }
      };
      setMatch(initialMatch);
      setScores(initialMatch.score);

      // Fetch the latest data from Firestore
      const tournamentDoc = await getDoc(doc(db, 'tournaments', tournamentId));
      if (tournamentDoc.exists()) {
        const tournamentData = tournamentDoc.data();
        const latestMatch = tournamentData.bracket[matchIndex];
        setMatch(latestMatch);
        setScores(latestMatch.score);
      }
    };
    fetchMatch();
  }, [tournamentId, matchIndex, location.search]);

  const updateScore = async (team, value) => {
    const newScores = { ...scores, [team]: Math.max(0, scores[team] + value) };
    setScores(newScores);

    const tournamentRef = doc(db, 'tournaments', tournamentId);
    const tournamentDoc = await getDoc(tournamentRef);
    const bracket = tournamentDoc.data().bracket;
    bracket[matchIndex].score = newScores;

    await updateDoc(tournamentRef, { bracket });
  };

  const endMatch = async () => {
    const winner = scores.team1 > scores.team2 ? match.team1 : match.team2;
    const tournamentRef = doc(db, 'tournaments', tournamentId);
    const tournamentDoc = await getDoc(tournamentRef);
    const bracket = tournamentDoc.data().bracket;
    bracket[matchIndex].winner = winner;

    await updateDoc(tournamentRef, { bracket });
    navigate(`/tournament/${tournamentId}/bracket`);
  };

  if (!match) return <div className="text-black text-center">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-black text-center">Match Score Tracker</h2>
      <div className="flex justify-between mb-8">
        {['team1', 'team2'].map((team) => (
          <div key={team} className="text-center">
            <h3 className="text-xl font-bold text-black mb-2">{match[team].name}</h3>
            <p className="text-4xl font-bold text-black mb-4">{scores[team]}</p>
            <button 
              onClick={() => updateScore(team, 1)} 
              className="bg-green-500 text-white px-4 py-2 rounded mr-2"
            >
              +1
            </button>
            <button 
              onClick={() => updateScore(team, -1)} 
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              -1
            </button>
          </div>
        ))}
      </div>
      <button 
        onClick={endMatch} 
        className="w-full bg-blue-500 text-white px-4 py-2 rounded"
      >
        End Match
      </button>
    </div>
  );
};

export default TournamentScoreTracker;