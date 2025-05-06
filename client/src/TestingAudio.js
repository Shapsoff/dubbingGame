import React, { useState } from "react";

const TestingAudio = ({ socket }) => {
    const [audios, setAudios] = useState([]);

    const handleGetAudios = () => {
        socket.emit('getAudiosByManche', 1);
    };

    socket.on('audios', (audios) => { //  client ( Blob ) → Serveur (Buffer) → DB (Buffer) → Serveur (Buffer) → Client (conversion manuel de Buffer vers ArrayBuffer)
        console.log('Audios reçus :', audios);
        const audiosWithUrls = audios.map(audio => {
          console.log(`Données audio pour ${audio.playerId}:`, audio.audioData);
          // Convertir le Buffer en ArrayBuffer
          const arrayBuffer = new Uint8Array(audio.audioData.data).buffer;
          console.log('ArrayBuffer converti :', arrayBuffer);
          // Créer un Blob à partir des données binaires
          const audioBlob = new Blob([arrayBuffer], { type: 'audio/wav' });
          console.log("audioBlob: "+audioBlob);
          // Générer une URL pour le Blob
          const audioUrl = URL.createObjectURL(audioBlob);
          console.log("audioURL: "+audioUrl)
          console.log("playerID: "+audio.playerId)
          console.log('manche : '+audio.manche)
          return {
            playerId: audio.playerId,
            audioUrl: audioUrl,
            manche: audio.manche
          };
        });
        setAudios(audiosWithUrls);
    });

    return (
        <div>
            <button onClick={handleGetAudios}>Get Audios</button>
            <div>
                {audios.map((audio, index) => (
                    <audio key={index} controls src={audio.audioUrl} />
                ))}
            </div>
        </div>
    );
};

export default TestingAudio;