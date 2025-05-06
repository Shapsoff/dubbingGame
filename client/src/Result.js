import React, { useEffect, useState } from 'react';
import './Result.css';

const Result = ({ socket }) => {
    const [ranking, setRanking] = useState([]);
    
    useEffect(() => {
        socket.emit('getResults');

        socket.on('results', (results) => {
            // Sort the results array based on ratings in descending order
            const sortedRanking = results.sort((a, b) => b.rating - a.rating);
            setRanking(sortedRanking); // Update the state with the sorted ranking
        });

        return () => {
            socket.off('results'); // Cleanup the listener when the component unmounts
        };
    }, [socket]);

    const clearAudios = () => {
        socket.emit('clearAudios');
    };



    return (
        <div className='resultContainer'>
            <h1 className='title'>Résultats</h1>
            <ul className='rankingList'>
                {ranking.map((player, index) => (
                    <li key={player.playerId}>
                        {index + 1}. {player.playerId}: {player.rating} ⭐
                    </li>
                ))}
            </ul>
            <button onClick={clearAudios} className='clearAudiosBtn'>Supprimer les audios de la base de données</button>
            {/* <button onClick={backToLobby}>Retourner au lobby</button> */}
        </div>
    );
};

export default Result;