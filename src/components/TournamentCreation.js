import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { FaPlus, FaTimes } from 'react-icons/fa';

const TournamentCreation = () => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [teams, setTeams] = useState([{ name: '', players: ['', ''] }]);
  const navigate = useNavigate();

  const handleAddTeam = () => {
    setTeams([...teams, { name: '', players: ['', ''] }]);
  };

  const handleRemoveTeam = (index) => {
    if (teams.length > 3) {
      const newTeams = teams.filter((_, i) => i !== index);
      setTeams(newTeams);
    } else {
      alert("A minimum of 3 teams is required for the tournament.");
    }
  };

  const handleTeamChange = (index, field, value) => {
    const newTeams = [...teams];
    if (field === 'name') {
      newTeams[index].name = value;
    } else {
      // Validate player name (only letters and spaces)
      if (/^[a-zA-Z\s]*$/.test(value) || value === '') {
        newTeams[index].players[field] = value;
      }
    }
    setTeams(newTeams);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (teams.length < 3) {
      alert("A minimum of 3 teams is required for the tournament.");
      return;
    }
    try {
      const tournamentData = {
        name,
        date,
        location,
        teams,
        createdBy: auth.currentUser.uid,
        createdAt: new Date(),
        status: 'upcoming'
      };
      const docRef = await addDoc(collection(db, 'tournaments'), tournamentData);
      // Redirect to MatchSetup with the new tournament ID
      navigate(`/match-setup/${docRef.id}`);
    } catch (error) {
      console.error('Error creating tournament:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Create a New Tournament</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2">Tournament Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md text-gray-700"
          />
        </div>
        <div>
          <label className="block mb-2">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md text-gray-700"
          />
        </div>
        <div>
          <label className="block mb-2">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md text-gray-700"
          />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Teams (Minimum 3)</h3>
          {teams.map((team, index) => (
            <div key={index} className="mb-4 p-4 border rounded-md">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-medium">Team {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => handleRemoveTeam(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTimes />
                </button>
              </div>
              <input
                type="text"
                value={team.name}
                onChange={(e) => handleTeamChange(index, 'name', e.target.value)}
                placeholder="Team Name"
                required
                className="w-full px-3 py-2 border rounded-md text-gray-700 mb-2"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={team.players[0]}
                  onChange={(e) => handleTeamChange(index, 0, e.target.value)}
                  placeholder="Player 1 (letters only)"
                  required
                  className="w-full px-3 py-2 border rounded-md text-gray-700"
                />
                <input
                  type="text"
                  value={team.players[1]}
                  onChange={(e) => handleTeamChange(index, 1, e.target.value)}
                  placeholder="Player 2 (letters only)"
                  required
                  className="w-full px-3 py-2 border rounded-md text-gray-700"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddTeam}
            className="flex items-center justify-center w-full py-2 mt-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
          >
            <FaPlus className="mr-2" /> Add Team
          </button>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
        >
          Create Tournament
        </button>
      </form>
    </div>
  );
};

export default TournamentCreation;