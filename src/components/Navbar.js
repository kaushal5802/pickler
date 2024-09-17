import React, { useState } from 'react';
import { FaBars, FaHome, FaUser, FaGamepad, FaTrophy } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const HamburgerMenu = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            <button onClick={toggleMenu} className="p-2 text-white bg-gray-800 rounded">
                <FaBars size={24} />
            </button>
            {isOpen && (
                <div className="absolute top-16 left-0 right-0 bg-gray-800 text-white flex flex-col p-4">
                    <Link to="/dashboard" className="flex items-center p-2 hover:bg-gray-700">
                        <FaHome size={20} />
                        <span className="ml-2">Dashboard</span>
                    </Link>
                    <Link to="/profile" className="flex items-center p-2 hover:bg-gray-700">
                        <FaUser size={20} />
                        <span className="ml-2">Profile</span>
                    </Link>
                    <Link to="/quick-match" className="flex items-center p-2 hover:bg-gray-700">
                        <FaGamepad size={20} />
                        <span className="ml-2">Quick Match</span>
                    </Link>
                    <Link to="/tournaments" className="flex items-center p-2 hover:bg-gray-700">
                        <FaTrophy size={20} />
                        <span className="ml-2">Tournament</span>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default HamburgerMenu;