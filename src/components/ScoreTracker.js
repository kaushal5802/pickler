import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { FaMinus, FaPlus, FaTrophy } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import confetti from 'canvas-confetti';

const ScoreTracker = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [currentGame, setCurrentGame] = useState(1);
  const [scores, setScores] = useState({ team1: 0, team2: 0 });
  const [games, setGames] = useState({ team1: 0, team2: 0 });
  const [showRoundWinModal, setShowRoundWinModal] = useState(false);
  const [showGameWinModal, setShowGameWinModal] = useState(false);
  const [winnerInfo, setWinnerInfo] = useState({ teams: [], message: '' });

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const matchDoc = await getDoc(doc(db, 'matches', matchId));
        if (matchDoc.exists()) {
          const matchData = matchDoc.data();
          setMatch({
            ...matchData,
            scores: matchData.scores || []
          });
          if (matchData.scores && matchData.scores.length > 0) {
            const lastGame = matchData.scores[matchData.scores.length - 1];
            setScores(lastGame);
            setCurrentGame(matchData.scores.length);
            setGames({
              team1: matchData.scores.filter(game => game.team1 > game.team2).length,
              team2: matchData.scores.filter(game => game.team2 > game.team1).length
            });
          }
        } else {
          toast.error("Match not found. Redirecting to dashboard.");
          navigate('/dashboard');
        }
      } catch (error) {
        toast.error("Error loading match data. Please try again.");
        console.error("Error fetching match:", error);
      }
    };
    fetchMatch();
  }, [matchId, navigate]);

  const updateScore = async (team, change) => {
    if (!match) return;

    const otherTeam = team === 'team1' ? 'team2' : 'team1';
    const newScore = Math.max(0, scores[team] + change);
    
    if (newScore > match.pointsPerGame) {
      toast.warn("Maximum score reached for this game.");
      return;
    }

    const newScores = { ...scores, [team]: newScore };
    setScores(newScores);

    const winningScore = Math.max(newScores.team1, newScores.team2);
    const scoreDifference = Math.abs(newScores.team1 - newScores.team2);

    try {
      if (winningScore >= match.pointsPerGame && scoreDifference >= 2) {
        // Game over
        const winningTeams = newScores.team1 > newScores.team2 ? ['team1'] : ['team2'];
        const newGames = {
          ...games,
          [winningTeams[0]]: games[winningTeams[0]] + 1
        };
        setGames(newGames);

        if (newGames[winningTeams[0]] >= match.gamesToWin) {
          // Match over
          await updateDoc(doc(db, 'matches', matchId), {
            scores: [...match.scores, newScores],
            status: 'completed',
            winner: winningTeams[0]
          });
          setWinnerInfo({
            teams: winningTeams.map(t => ({
              name: match[t].name,
              players: match[t].players
            })),
            message: `Congratulations! You've won the match!`
          });
          setShowGameWinModal(true);
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } else {
          // Round over
          await updateDoc(doc(db, 'matches', matchId), {
            scores: [...match.scores, newScores]
          });
          setWinnerInfo({
            teams: winningTeams.map(t => ({
              name: match[t].name,
              players: match[t].players
            })),
            message: `You've won game ${currentGame}!`
          });
          setShowRoundWinModal(true);
          setTimeout(() => {
            setShowRoundWinModal(false);
            setScores({ team1: 0, team2: 0 });
            setCurrentGame(currentGame + 1);
          }, 3000);
        }
      } else if (winningScore >= match.pointsPerGame && scoreDifference === 0) {
        // Tie
        const tiedTeams = ['team1', 'team2'];
        setWinnerInfo({
          teams: tiedTeams.map(t => ({
            name: match[t].name,
            players: match[t].players
          })),
          message: `It's a tie in game ${currentGame}!`
        });
        setShowRoundWinModal(true);
        setTimeout(() => {
          setShowRoundWinModal(false);
          setScores({ team1: 0, team2: 0 });
          setCurrentGame(currentGame + 1);
        }, 3000);
      } else {
        // Update current game score
        await updateDoc(doc(db, 'matches', matchId), {
          [`scores.${currentGame - 1}`]: newScores
        });
      }
    } catch (error) {
      toast.error("Error updating score. Please try again.");
      console.error("Error updating score:", error);
    }
  };

  const WinModal = ({ isGameWin }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg text-center shadow-lg">
        <FaTrophy className={`${isGameWin ? 'text-8xl' : 'text-6xl'} text-yellow-500 mx-auto mb-4`} />
        {winnerInfo.teams.map((team, index) => (
          <div key={index} className="mb-4">
            <h2 className={`${isGameWin ? 'text-4xl' : 'text-3xl'} font-bold mb-2 text-black`}>{team.name}</h2>
            {match.matchType === 'doubles' && (
              <p className="text-xl text-gray-700">{team.players.join(' & ')}</p>
            )}
          </div>
        ))}
        <p className={`${isGameWin ? 'text-2xl' : 'text-xl'} mb-4 text-gray-700`}>{winnerInfo.message}</p>
        {isGameWin && (
          <button
            onClick={() => navigate('/leaderboard')}
            className="bg-blue-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-600 transition duration-300"
          >
            View Leaderboard
          </button>
        )}
      </div>
    </div>
  );

  if (!match) return <div className="text-center text-2xl font-bold text-white">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <ToastContainer position="top-center" autoClose={3000} />
      {showRoundWinModal && <WinModal isGameWin={false} />}
      {showGameWinModal && <WinModal isGameWin={true} />}
      <h2 className="text-4xl font-bold mb-6 text-white text-center">Score Tracker</h2>
      <div className="mb-6 bg-white bg-opacity-20 p-4 rounded-lg">
        <p className="text-2xl text-white"><span className="font-semibold">Current Game:</span> {currentGame}</p>
        <p className="text-2xl text-white"><span className="font-semibold">Games to Win:</span> {match.gamesToWin}</p>
        <p className="text-2xl text-white"><span className="font-semibold">Match Type:</span> {match.matchType}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {['team1', 'team2'].map(team => (
          <div key={team} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-3xl font-bold mb-2 text-gray-800">{match[team].name}</h3>
            <p className="text-xl mb-4 text-gray-600">
              {match[team].players.join(match.matchType === 'doubles' ? ' & ' : '')}
            </p>
            <p className="text-6xl font-bold mb-6 text-center text-blue-600">{scores[team]}</p>
            <div className="flex justify-center space-x-8">
              <button
                onClick={() => updateScore(team, -1)}
                className="bg-red-500 text-white p-4 rounded-full hover:bg-red-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                aria-label="Decrease Score"
              >
                <FaMinus className="text-2xl" />
              </button>
              <button
                onClick={() => updateScore(team, 1)}
                className="bg-green-500 text-white p-4 rounded-full hover:bg-green-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                aria-label="Increase Score"
              >
                <FaPlus className="text-2xl" />
              </button>
            </div>
            <p className="mt-6 text-xl text-center text-gray-700">Games Won: <span className="font-bold">{games[team]}</span></p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoreTracker;