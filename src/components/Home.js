import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { currentUser } = useAuth();

  if (currentUser) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to Pickleball Scorer</h1>
      <p className="text-xl mb-8">Track your games, organize tournaments, and climb the leaderboard!</p>
      <Link to="/auth" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300">
        Get Started
      </Link>
    </div>
  );
};

export default Home;