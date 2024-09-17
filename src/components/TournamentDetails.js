import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { FaCalendar, FaMapMarkerAlt, FaUsers, FaTrophy } from 'react-icons/fa';

const TournamentDetails = () => {
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isParticipant, setIsParticipant] = useState(false);

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const tournamentDoc = await getDoc(doc(db, 'tournaments', tournamentId));
        if (tournamentDoc.exists()) {
          const tournamentData = tournamentDoc.data();
          setTournament(tournamentData);
          setIsParticipant(tournamentData.participants.includes(auth.currentUser.uid));
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

  const joinTournament = async () => {
    if (tournament.participants.length >= tournament.maxParticipants) {
      toast.error("Tournament is full");
      return;
    }

    try {
      const tournamentRef = doc(db, 'tournaments', tournamentId);
      await updateDoc(tournamentRef, {
        participants: arrayUnion(auth.currentUser.uid)
      });
      setIsParticipant(true);
      toast.success("You have joined the tournament!");
      
      // Refresh tournament data
      const updatedTournamentDoc = await getDoc(tournamentRef);
      setTournament(updatedTournamentDoc.data());
    } catch (error) {
      console.error("Error joining tournament:", error);
      toast.error("Failed to join tournament");
    }
  };

  if (loading) {
    return <div className="text-center text-2xl font-bold text-black">Loading tournament details...</div>;
  }

  if (!tournament) {
    return <div className="text-center text-2xl font-bold text-black">Tournament not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-black text-center">{tournament.name}</h2>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-4">
          <FaCalendar className="text-blue-500 mr-2" />
          <p className="text-black">Date: {new Date(tournament.date).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center mb-4">
          <FaMapMarkerAlt className="text-red-500 mr-2" />
          <p className="text-black">Location: {tournament.location}</p>
        </div>
        <div className="flex items-center mb-4">
          <FaUsers className="text-green-500 mr-2" />
          <p className="text-black">Participants: {tournament.participants.length} / {tournament.maxParticipants}</p>
        </div>
        <div className="flex items-center mb-4">
          <FaTrophy className="text-yellow-500 mr-2" />
          <p className="text-black">Status: {tournament.status}</p>
        </div>
        {tournament.description && (
          <p className="text-black mb-4">{tournament.description}</p>
        )}
        
        {!isParticipant && tournament.status === 'upcoming' && (
          <button
            onClick={joinTournament}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
          >
            Join Tournament
          </button>
        )}
        
        {isParticipant && (
          <p className="text-green-600 font-semibold">You are participating in this tournament</p>
        )}
        
        {tournament.status !== 'upcoming' && (
          <Link 
            to={`/tournament/${tournamentId}/bracket`}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition duration-300 inline-block mt-4"
          >
            View Tournament Bracket
          </Link>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-2xl font-bold mb-4 text-black">Participants</h3>
        {tournament.participants.length > 0 ? (
          <ul className="list-disc list-inside">
            {tournament.participants.map((participantId, index) => (
              <li key={index} className="text-black mb-2">Participant {index + 1}</li>
              // You might want to fetch and display actual user names here
            ))}
          </ul>
        ) : (
          <p className="text-black">No participants yet</p>
        )}
      </div>
    </div>
  );
};

export default TournamentDetails;