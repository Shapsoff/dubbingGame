import React, { useState } from "react";

const UploadVideos = ({socket}) => {
    const [title, setTitle] = useState('');

    const sendVideos = () => {
        console.log('fichier déposé');
        socket.emit('uploadVideo', {title: title})
    };

    return (
        <div>
            <h1>Envoyer les vidéos sur la database</h1>
            <input 
                type="file" 
                accept="video"
                onChange={sendVideos} 
            />
            <input type="text" onChange={(e) => setTitle(e.target.value)}/>
        </div>
    );
};

export default UploadVideos;