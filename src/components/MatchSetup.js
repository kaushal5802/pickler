import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

const MatchSetup = () => {
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const tournamentDoc = await getDoc(doc(db, 'tournaments', tournamentId));
        if (tournamentDoc.exists()) {
          setTournament(tournamentDoc.data());
        } else {
          console.error("Tournament not found");
          navigate('/tournaments');
        }
      } catch (error) {
        console.error("Error fetching tournament:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchTournament();
    }
  }, [tournamentId, navigate, currentUser]);

  if (loading) {
    return <div className="text-center text-2xl font-bold text-black">Loading...</div>;
  }

  if (!tournament) {
    return <div className="text-center text-2xl font-bold text-black">Tournament not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-black">Match Setup for {tournament.name}</h2>
      <p className="text-black mb-2">Tournament Date: {tournament.date}</p>
      <p className="text-black mb-4">Location: {tournament.location}</p>
      <h3 className="text-2xl font-bold mt-4 mb-2 text-black">Teams:</h3>
      <ul className="list-disc list-inside mb-6">
        {tournament.teams.map((team, index) => (
          <li key={index} className="text-black mb-2">
            <span className="font-semibold">{team.name}:</span> {team.players.join(', ')}
          </li>
        ))}
      </ul>
      
      {/* Add match setup logic here */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h4 className="text-xl font-bold mb-4 text-black">Set Up Matches</h4>
        {/* Add form or UI elements for setting up matches */}
        <p className="text-black">Implement your match setup logic here. This could include:</p>
        <ul className="list-disc list-inside text-black">
          <li>Pairing teams for matches</li>
          <li>Setting match schedules</li>
          <li>Assigning courts or play areas</li>
          <li>Setting match durations or scoring rules</li>
        </ul>
      </div>

      <button
        onClick={() => {/* Implement logic to start the tournament */}}
        className="mt-6 w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
      >
        Start Tournament
      </button>
    </div>
  );
};

export default MatchSetup;