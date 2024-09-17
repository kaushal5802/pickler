import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FaUsers } from 'react-icons/fa';

const TeamList = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const q = query(collection(db, 'teams'), where('createdBy', '==', auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        const teamList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTeams(teamList);
      } catch (error) {
        console.error("Error fetching teams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  if (loading) {
    return <div className="text-center text-2xl font-bold text-black">Loading teams...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-black">Your Teams</h2>
        <Link 
          to="/create-team" 
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Create New Team
        </Link>
      </div>
      {teams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teams.map(team => (
            <div key={team.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-semibold text-black mb-4">{team.name}</h3>
              <div className="flex items-center mb-2">
                <FaUsers className="text-blue-500 mr-2" />
                <p className="text-black">Players:</p>
              </div>
              <ul className="list-disc list-inside mb-4">
                {team.players.map((player, index) => (
                  <li key={index} className="text-black">{player}</li>
                ))}
              </ul>
              <Link 
                to={`/team/${team.id}`}
                className="text-blue-500 hover:text-blue-700 transition duration-300"
              >
                View Team Details
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-black">You haven't created any teams yet. Create a team to get started!</p>
      )}
    </div>
  );
};

export default TeamList;