import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { FaTrophy, FaGamepad, FaChartLine } from 'react-icons/fa';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ level: 1, xp: 0, matches: 0, wins: 0 });

  useEffect(() => {
    const fetchUserData = async () => {
      const userDoc = doc(db, 'users', auth.currentUser.uid);
      const userSnap = await getDoc(userDoc);
      
      if (userSnap.exists()) {
        setUser(userSnap.data());
        setStats(userSnap.data().stats || { level: 1, xp: 0, matches: 0, wins: 0 });
      } else {
        // Create new user document if it doesn't exist
        const newUser = {
          uid: auth.currentUser.uid,
          email: auth.currentUser.email,
          name: auth.currentUser.displayName,
          stats: { level: 1, xp: 0, matches: 0, wins: 0 }
        };
        await setDoc(userDoc, newUser);
        setUser(newUser);
      }
    };

    fetchUserData();
  }, []);

  const xpToNextLevel = stats.level * 100;
  const xpProgress = (stats.xp / xpToNextLevel) * 100;

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-center">Welcome, {user?.name}!</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 text-gray-800">
        <h2 className="text-2xl font-semibold mb-4">Your Stats</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-bold">Level: {stats.level}</p>
            <p>XP: {stats.xp} / {xpToNextLevel}</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${xpProgress}%`}}></div>
            </div>
          </div>
          <div>
            <p>Matches Played: {stats.matches}</p>
            <p>Wins: {stats.wins}</p>
            <p>Win Rate: {stats.matches > 0 ? ((stats.wins / stats.matches) * 100).toFixed(1) : 0}%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/create-tournament" className="block">
          <div className="bg-indigo-500 hover:bg-indigo-600 transition-colors duration-300 rounded-lg shadow-md p-6 text-center">
            <FaTrophy className="text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold">Create Tournament</h3>
          </div>
        </Link>
        <Link to="/match-setup" className="block">
          <div className="bg-green-500 hover:bg-green-600 transition-colors duration-300 rounded-lg shadow-md p-6 text-center">
            <FaGamepad className="text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold">Quick Match</h3>
          </div>
        </Link>
        <Link to="/leaderboard" className="block">
          <div className="bg-yellow-500 hover:bg-yellow-600 transition-colors duration-300 rounded-lg shadow-md p-6 text-center">
            <FaChartLine className="text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold">Leaderboard</h3>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;