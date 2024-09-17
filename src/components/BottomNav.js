import React from 'react';
import { FaHome, FaUser, FaGamepad, FaTrophy } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const BottomNav = () => {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white flex justify-around p-2">
            <Link to="/dashboard" className="flex flex-col items-center">
                <FaHome size={24} />
                <span>Dashboard</span>
            </Link>
            <Link to="/profile" className="flex flex-col items-center">
                <FaUser size={24} />
                <span>Profile</span>
            </Link>
            <Link to="/quick-match" className="flex flex-col items-center">
                <FaGamepad size={24} />
                <span>Quick Match</span>
            </Link>
            <Link to="/tournament" className="flex flex-col items-center">
                <FaTrophy size={24} />
                <span>Tournament</span>
            </Link>
        </div>
    );
};

export default BottomNav;
