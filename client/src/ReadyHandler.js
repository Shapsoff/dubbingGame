import React, { useState } from 'react';

const ReadyHandler = ({ socket }) => {
    const [playerReady, setplayerReady] = useState(false);
    const [hovering, setHovering] = useState(false);

    const ready = () => { 
        const updatedPlayer = {
            ...playerReady,
            isReady: !playerReady,
        };
        setplayerReady(!playerReady);
        socket.emit("updatePlayerStatus", updatedPlayer);
        // connect to server, this player is ready
        // button turn green
        console.log("Player's ready !"); //faire un toggle, player can not be ready
    };
  
  return (
   <div className='readyHandler'>
        <button 
            onClick={ready}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            id="readyBtn" 
            className={playerReady ? 'green' : 'red'}
        >
            {hovering
                ? playerReady
                    ? 'Pas prêt'
                    : 'Prêt'
                : playerReady
                ? 'Prêt'
                : 'Pas prêt'
            }
        </button>
   </div>
  );
};

export default ReadyHandler;