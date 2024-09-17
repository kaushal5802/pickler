import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { toast } from 'react-toastify';

const JoinTournament = () => {
  const { tournamentId } = useParams();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const tournamentDoc = await getDoc(doc(db, 'tournaments', tournamentId));
        if (tournamentDoc.exists()) {
          setTournament(tournamentDoc.data());
        } else {
          toast.error("Tournament not found");
          navigate('/tournaments');
        }
      } catch (error) {
        console.error("Error fetching tournament:", error);
        toast.error("Error loading tournament details");
      } finally {
        setLoading(false);
      }
    };

    fetchTournament();
  }, [tournamentId, navigate]);

  const handleJoinTournament = async () => {
    try {
      const userId = auth.currentUser.uid;
      await updateDoc(doc(db, 'tournaments', tournamentId), {
        participants: arrayUnion(userId)
      });
      toast.success("You've successfully joined the tournament!");
      navigate(`/tournament/${tournamentId}`);
    } catch (error) {
      console.error("Error joining tournament:", error);
      toast.error("Failed to join tournament. Please try again.");
    }
  };

  if (loading) {
    return <div className="text-center text-2xl font-bold text-black">Loading...</div>;
  }

  if (!tournament) {
    return <div className="text-center text-2xl font-bold text-black">Tournament not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-black text-center">Join Tournament</h2>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-2xl font-semibold text-black mb-4">{tournament.name}</h3>
        <p className="text-black mb-2">Date: {new Date(tournament.date).toLocaleDateString()}</p>
        <p className="text-black mb-4">Location: {tournament.location}</p>
        <p className="text-black mb-4">Current Participants: {tournament.participants ? tournament.participants.length : 0}</p>
        <button
          onClick={handleJoinTournament}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Confirm Join Tournament
        </button>
      </div>
    </div>
  );
};

export default JoinTournament;