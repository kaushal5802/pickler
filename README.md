# Pickler - Pickleball Score Tracker

#### Overview
Pickler is a web application built with React and Firebase, designed to help pickleball players and tournament organizers keep track of scores, manage teams, and host round-robin tournaments seamlessly. The platform supports Google Authentication for user access and provides a simple, intuitive interface for score tracking.

#### Features
- Google Authentication: Users can log in with their Google accounts for a secure and personalized experience.
- Team Entry: Easily create and manage teams for matches.
- Score Tracking: Real-time score updates during matches.
- Tournament Management: Organize and track round-robin tournaments.

#### Technology Stack
- Frontend: ReactJS 
- Backend: Firebase (Authentication, Firestore for data storage)

#### Installation
- To run the project locally, follow these steps:
- Clone the repository: git clone https://github.com/kaushal5802/pickler.git

#### Navigate to the project directory:
- cd pickler
- Install dependencies: npm install
- Create a Firebase project and configure Firebase for your app (add your Firebase config to a .env file).

#### Run the app:
- npm start
- Access the app at http://localhost:3000.

#### Firebase Setup
To use Firebase services, create a new project in Firebase Console and set up:
- Firebase Authentication (Google provider)
- Firestore for storing team and tournament data
- Log in using Google authentication.
- Create a new team and add players.
- Start a match and track scores.
- Leaderboards: Adding player and team rankings.
- Match History: View previous match details.

# Contributing
We welcome contributions! Feel free to submit a pull request or raise issues for new features or bug fixes.

# License
This project is licensed under the MIT License - see the LICENSE file for details.
