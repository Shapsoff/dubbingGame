import React, { useEffect, useState} from 'react';

const StartGame = ({ socket, onGameStart }) => {
    const [players, setPlayers] = useState([]); 

    useEffect(() => {
        // Listen for updates to the player list
        socket.on("updateUsers", (updatedPlayers) => {
          setPlayers(updatedPlayers);
        });

        socket.on("startGame", () => {
            console.log('Lancement de la game !');
            onGameStart();
        });
    
        // Cleanup the listener on unmount
        return () => {
          socket.off("updateUsers");
          socket.off("startGame");
        };
      }, [socket, onGameStart]);
    
      const start = () => {
        // Check if all players are ready
        const allReady = players.every((player) => player.isReady);
        if (allReady) {
        //   console.log("All players are ready. Starting the game...");
          socket.emit("startGame"); // Notify the server to start the game
        } else {
          alert("Tous les joueurs ne sont pas prêts !");
        }
      };
    return (
        <div className='startGame'>
            <button onClick={start}>Lancer la game</button>
        </div>
    );
};

export default StartGame;