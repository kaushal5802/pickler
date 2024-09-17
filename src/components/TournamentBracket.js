import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const TournamentBracket = () => {
  const { tournamentId } = useParams();
  const [tournament, setTournament] = useState(null);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchTournament = async () => {
      const tournamentDoc = await getDoc(doc(db, 'tournaments', tournamentId));
      if (tournamentDoc.exists()) {
        setTournament(tournamentDoc.data());
        if (!tournamentDoc.data().bracket) {
          generateBracket(tournamentDoc.data().teams);
        } else {
          setMatches(tournamentDoc.data().bracket);
        }
      }
    };
    fetchTournament();
  }, [tournamentId]);

  const generateBracket = (teams) => {
    // Shuffle teams
    const shuffledTeams = teams.sort(() => 0.5 - Math.random());
    
    // Generate matches
    const generatedMatches = [];
    for (let i = 0; i < shuffledTeams.length; i += 2) {
      generatedMatches.push({
        team1: shuffledTeams[i],
        team2: shuffledTeams[i + 1],
        winner: null,
        score: { team1: 0, team2: 0 }
      });
    }

    setMatches(generatedMatches);
    updateBracketInFirestore(generatedMatches);
  };

  const updateBracketInFirestore = async (bracketMatches) => {
    await updateDoc(doc(db, 'tournaments', tournamentId), {
      bracket: bracketMatches
    });
  };

  const renderMatch = (match, index) => (
    <div key={index} className="bg-white rounded-lg shadow-md p-4 mb-4">
      <p className="font-bold text-black">{match.team1.name} vs {match.team2.name}</p>
      <p className="text-black">Score: {match.score.team1} - {match.score.team2}</p>
      {!match.winner && (
        <button 
          onClick={() => navigateToScoreTracker(match, index)}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Start Match
        </button>
      )}
      {match.winner && (
        <p className="text-green-600 font-bold">Winner: {match.winner.name}</p>
      )}
    </div>
  );

  const navigateToScoreTracker = (match, matchIndex) => {
    // Navigate to ScoreTracker component with match details
    // You'll need to implement this navigation and the ScoreTracker component
  };

  if (!tournament) return <div className="text-black text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-black text-center">{tournament.name} Bracket</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {matches.map((match, index) => renderMatch(match, index))}
      </div>
    </div>
  );
};

export default TournamentBracket;