import React, { useState } from 'react';
import io from 'socket.io-client';
import LoginPage from './LoginPage';
import MainPage from './MainPage';
import GamePhase from './GamePhase';
import VotingPhase from './VotingPhase'; // Assurez-vous d'importer le composant VotingPhase
import Result from './Result';

console.log('Server URL:', process.env.REACT_APP_SERVER_URL);
const socket = io(`${process.env.REACT_APP_SERVER_URL}`, {
  transports: ['websocket'], // Force l'utilisation de WebSockets
});

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [votingPhase, setVotingPhase] = useState(false);
  const [player, setPlayer] = useState({});

  // ↓ If == 0 → change to result phase
  // ↓ manage the video playing (round) 
  const [videoNb, setVideoNb] = useState(1);
  

  const handleLogin = (password, pseudo) => {
    console.log('On est dans la fonction handleLogin, on va essayer de post, est voici le mdp entré: ' + password);
    // Envoyer le mot de passe au serveur pour vérification
    fetch(`${process.env.REACT_APP_SERVER_URL}/api/check-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setIsLoggedIn(true);
          const newPlayer = { nickname: pseudo, isReady: false };
          setPlayer(newPlayer);
          console.log('Voici le pseudo envoyé au serveur: ' + newPlayer.nickname);
          socket.emit('setPseudo', newPlayer);
        } else {
          alert('Mot de passe incorrect');
        }
      });
  };

  // const backToLobby = () => {
  //   socket.emit('setPseudo', player.nickname); // Doesnt show player's name in the lobby
  //   setGameStarted(false);
  //   setVotingPhase(false);
  //   setVideoNb(1); // Reset video number to 1 when going back to lobby
  //   // socket.emit('resetGame'); // Notify server to reset game state
  // };

  return (
    <div>
      {isLoggedIn ? (
        gameStarted ? (
          votingPhase ? (
            (videoNb === 0) ? (
              <Result socket={socket} />
            ) : (
              <VotingPhase socket={socket} videoNb={videoNb} setVideoNb={setVideoNb} />
            )
          ) :(
            <GamePhase pseudo={player.nickname} socket={socket} onVotingPhase={() => setVotingPhase(true)}/>
          )          
        ) : (
          // Same here, I think pseudo is useless here
          <MainPage pseudo={player.nickname} socket={socket} onGameStart={() => setGameStarted(true)}/> 
        )
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
