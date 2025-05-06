import React, { useState, useEffect } from 'react';

const ShowPlayersBis = ({ socket }) => {
    const [users, setUsers] = useState([]);
    
    useEffect(() => { 
        const handleUpdateUsers = (updatedUsers) => {
            setUsers(updatedUsers);
        };
        
        socket.on('updateUsers', handleUpdateUsers);

        return () => {
            socket.off('updateUsers', handleUpdateUsers);
        };
    }, [socket]);
  
    return ( 
        <div className='usersList'>
            <h3>Utilisateurs connectés:</h3>
            <ul>
                {users.map((user, index) => (
                    <li key={index}>{user.nickname}{user.isReady ? "✅" : "❌"}</li>
                ))}
            </ul>
        </div>
    );
};

export default ShowPlayersBis;