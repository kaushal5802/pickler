import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { FaTrophy, FaChartLine, FaUserFriends } from 'react-icons/fa';

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          setStats(userDoc.data().stats);
        } else {
          console.error("User document not found");
        }
      } catch (error) {
        console.error("Error fetching user stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center text-2xl font-bold text-black">Loading statistics...</div>;
  }

  if (!stats) {
    return <div className="text-center text-2xl font-bold text-black">No statistics available</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-black text-center">Your Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={FaTrophy} title="Wins" value={stats.wins} />
        <StatCard icon={FaUserFriends} title="Matches Played" value={stats.matches} />
        <StatCard 
          icon={FaChartLine} 
          title="Win Rate" 
          value={`${stats.matches > 0 ? ((stats.wins / stats.matches) * 100).toFixed(1) : 0}%`} 
        />
      </div>
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-2xl font-semibold text-black mb-4">Level Progress</h3>
        <p className="text-black mb-2">Level: {stats.level}</p>
        <p className="text-black mb-2">XP: {stats.xp} / {stats.level * 100}</p>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${(stats.xp / (stats.level * 100)) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, title, value }) => (
  <div className="bg-white rounded-lg shadow-md p-6 text-center">
    <Icon className="text-4xl mx-auto mb-4 text-blue-500" />
    <h3 className="text-xl font-semibold text-black mb-2">{title}</h3>
    <p className="text-3xl font-bold text-black">{value}</p>
  </div>
);

export default Statistics;