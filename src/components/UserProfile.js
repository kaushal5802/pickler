import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { FaTrophy, FaUserFriends, FaChartLine } from 'react-icons/fa';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          throw new Error("No authenticated user found");
        }

        const userDoc = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userDoc);
        
        if (userSnap.exists()) {
          // Combine Firestore data with auth data
          setUser({
            ...userSnap.data(),
            photoURL: currentUser.photoURL || userSnap.data().photoURL || 'https://via.placeholder.com/100',
            email: currentUser.email || userSnap.data().email,
          });
        } else {
          throw new Error("User document not found in Firestore");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <div className="text-center text-2xl font-bold text-black">Loading...</div>;
  if (!user) return <div className="text-center text-2xl font-bold text-black">User not found.</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-black text-center">User Profile</h2>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <img
            src={user.photoURL}
            alt="Profile"
            className="w-20 h-20 rounded-full mr-4 object-cover"
          />
          <div>
            <h3 className="text-2xl font-semibold text-black">{user.name}</h3>
            <p className="text-black">{user.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard icon={FaTrophy} title="Wins" value={user.stats.wins} />
          <StatCard icon={FaUserFriends} title="Matches" value={user.stats.matches} />
          <StatCard 
            icon={FaChartLine} 
            title="Win Rate" 
            value={`${user.stats.matches > 0 ? ((user.stats.wins / user.stats.matches) * 100).toFixed(1) : 0}%`} 
          />
        </div>
        <div className="mb-4">
          <p className="font-bold text-black">Level: {user.stats.level}</p>
          <p className="text-black">XP: {user.stats.xp} / {user.stats.level * 100}</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${(user.stats.xp / (user.stats.level * 100)) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, title, value }) => (
  <div className="bg-gray-100 rounded-lg p-4 text-center">
    <Icon className="text-3xl mx-auto mb-2 text-blue-500" />
    <h4 className="font-semibold text-black">{title}</h4>
    <p className="text-2xl font-bold text-black">{value}</p>
  </div>
);

export default UserProfile;