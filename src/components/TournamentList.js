import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, query, getDocs, orderBy, limit, updateDoc, doc, arrayUnion } from 'firebase/firestore';
import { FaPlus, FaTrophy } from 'react-icons/fa';

const TournamentList = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const q = query(collection(db, 'tournaments'), orderBy('createdAt', 'desc'), limit(10));
        const querySnapshot = await getDocs(q);
        const tournamentList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTournaments(tournamentList);
      } catch (error) {
        console.error("Error fetching tournaments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  const joinTournament = async (tournamentId) => {
    try {
      const userId = auth.currentUser.uid;
      await updateDoc(doc(db, 'tournaments', tournamentId), {
        participants: arrayUnion(userId)
      });
      // Update local state
      setTournaments(tournaments.map(tournament => 
        tournament.id === tournamentId 
          ? { ...tournament, participants: [...(tournament.participants || []), userId] }
          : tournament
      ));
    } catch (error) {
      console.error("Error joining tournament:", error);
    }
  };

  if (loading) {
    return <div className="text-center text-2xl font-bold text-black">Loading tournaments...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-black">Tournaments</h2>
        <Link 
          to="/create-tournament" 
          className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300 flex items-center"
        >
          <FaPlus className="mr-2" /> Create Tournament
        </Link>
      </div>
      {tournaments.length > 0 ? (
        <div className="space-y-4">
          {tournaments.map(tournament => (
            <div key={tournament.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-semibold text-black">{tournament.name}</h3>
                  <p className="text-gray-600">Date: {new Date(tournament.date).toLocaleDateString()}</p>
                  <p className="text-gray-600">Location: {tournament.location}</p>
                </div>
                <FaTrophy className="text-4xl text-yellow-500" />
              </div>
              <div className="mt-4">
                <p className="text-black">Participants: {tournament.participants ? tournament.participants.length : 0}</p>
                <p className="text-black">Status: {tournament.status}</p>
              </div>
              <div className="mt-4 flex justify-end">
                {tournament.status === 'upcoming' && !tournament.participants?.includes(auth.currentUser.uid) && (
                  <button 
                    onClick={() => joinTournament(tournament.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
                  >
                    Join Tournament
                  </button>
                )}
                <Link 
                  to={`/tournament/${tournament.id}`}
                  className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-black">No tournaments found. Create one to get started!</p>
      )}
    </div>
  );
};

export default TournamentList;