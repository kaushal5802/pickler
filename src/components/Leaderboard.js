import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

const Leaderboard = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const q = query(collection(db, 'users'), orderBy('stats.wins', 'desc'), limit(10));
      const querySnapshot = await getDocs(q);
      const leaderboardData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPlayers(leaderboardData);
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-black">Leaderboard</h2>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-black">Rank</th>
              <th className="px-4 py-2 text-left text-black">Player</th>
              <th className="px-4 py-2 text-right text-black">Wins</th>
              <th className="px-4 py-2 text-right text-black">Matches</th>
              <th className="px-4 py-2 text-right text-black">Win Rate</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, index) => (
              <tr key={player.id} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                <td className="px-4 py-2 text-black">{index + 1}</td>
                <td className="px-4 py-2 text-black">{player.name}</td>
                <td className="px-4 py-2 text-right text-black">{player.stats.wins}</td>
                <td className="px-4 py-2 text-right text-black">{player.stats.matches}</td>
                <td className="px-4 py-2 text-right text-black">
                  {player.stats.matches > 0
                    ? `${((player.stats.wins / player.stats.matches) * 100).toFixed(1)}%`
                    : '0%'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;