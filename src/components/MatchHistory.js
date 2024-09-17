import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

const MatchHistory = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatchHistory = async () => {
      const q = query(
        collection(db, 'matches'),
        where('createdBy', '==', auth.currentUser.uid),
        orderBy('createdAt', 'desc'),
        limit(10)
      );
      const querySnapshot = await getDocs(q);
      const matchHistory = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMatches(matchHistory);
    };

    fetchMatchHistory();
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Match History</h2>
      <div className="space-y-4">
        {matches.map(match => (
          <div key={match.id} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-2">
              <p className="font-semibold">{match.team1.name} vs {match.team2.name}</p>
              <p className="text-sm text-gray-600">{new Date(match.createdAt.toDate()).toLocaleDateString()}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium">{match.team1.name}</p>
                <p>Score: {match.scores[match.scores.length - 1].team1}</p>
              </div>
              <div>
                <p className="font-medium">{match.team2.name}</p>
                <p>Score: {match.scores[match.scores.length - 1].team2}</p>
              </div>
            </div>
            <p className="mt-2 text-sm font-medium">
              Winner: {match.winner === 'team1' ? match.team1.name : match.team2.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchHistory;