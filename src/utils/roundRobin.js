export const generateRoundRobinSchedule = (teams) => {
    const schedule = [];
    const numberOfRounds = teams.length - 1;
    const halfSize = teams.length / 2;
  
    const playersList = teams.slice(0);
    playersList.splice(0, 1);
  
    for (let round = 0; round < numberOfRounds; round++) {
      const roundMatches = [];
  
      const firstTeam = teams[0];
      const lastTeam = playersList[playersList.length - 1];
      roundMatches.push([firstTeam, lastTeam]);
  
      for (let i = 0; i < halfSize - 1; i++) {
        const firstTeam = playersList[i];
        const secondTeam = playersList[playersList.length - 2 - i];
        roundMatches.push([firstTeam, secondTeam]);
      }
  
      playersList.push(playersList.shift());
      schedule.push(roundMatches);
    }
  
    return schedule;
  };