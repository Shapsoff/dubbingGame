import React, { useEffect, useState } from "react";

const ChangeVid = ({ socket, stopRecording }) => {
    const [playerReady, setplayerReady] = useState(false);
        
    
    useEffect(() => {
        const notify = () => {
            console.log("nextVid event received from server");
            socket.emit('updatePlayerStatus', { isReady: false });
            setplayerReady(false);
        };
    
        socket.on('nextVid', notify);
    
        return () => {
            socket.off('nextVid', notify);
        };
    }, [socket]);


    const nextVid = async () => {

        if (stopRecording) {
            stopRecording(); // Stop recording if it's still active
        }
        const updatedPlayer = {
            isReady: !playerReady,
        };
        setplayerReady(!playerReady);
        socket.emit("updatePlayerStatus", updatedPlayer);

        const waitForUpdateUsers = () => {
            return new Promise((resolve) => {
                const handleUpdateUsersTwo = (updatedUsers) => {
                    socket.off("updateUsers", handleUpdateUsersTwo); // Clean up the listener
                    resolve(updatedUsers);
                };
                socket.on("updateUsers", handleUpdateUsersTwo);
            });
        };

        try {
            const updatedUsers = await waitForUpdateUsers();
            const allReady = updatedUsers.every((user) => user.isReady);
            if (allReady) {
                console.log("All players are ready. Emitting nextVid...");
                // if (audioBlob) {
                //     socket.emit("audio", { playerId: pseudo, audioData: audioBlob, manche: i });
                // }
                socket.emit("nextVid");
            } else {
                console.log("Not all players are ready yet.");
            }
        } catch (error) {
            console.error("Error waiting for updateUsers:", error);
        }
    };

    return (
        <div className="changeVidBtn">
            <button onClick={nextVid}>Suivant</button>
        </div>
    )
};

export default ChangeVid;