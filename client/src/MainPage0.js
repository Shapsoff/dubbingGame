import React, { useState, useEffect, useRef } from "react";
import GamePhase from "./GamePhase";
import UploadVideos from "./UploadVideos";
// import io from "socket.io-client";

// const socket = io("http://localhost:3001", {
//   transports: ["websocket"], // Force l'utilisation de WebSockets
// });

// A ajouter:
//
// Sur la page de connexion un testeur de micro pour vérifier que c'est bien le bon micro utiliser

// Genre chacun met un note sur 5 à la fin y a le classement 
// et y a un moment de voir qui a mit combien à qui


const MainPage = ({ pseudo, socket  }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioStream, setAudioStream] = useState(null);
  // const [receivedAudio, setReceivedAudio] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  // const [pseudo, setPseudo] = useState('');
  const [users, setUsers] = useState([]);
  const [audios, setAudios] = useState([]);
  // const [intermediaireAudio, setIntermediaireAudio] = useState([]);

  // const [audiosBis, setAudiosBis] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [manche, setManche] = useState(1);

  const [text, setText] = useState("texte 1");
  const [resetProgress, setResetProgress] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const timeoutRef = useRef(null);


  useEffect(() => {
    socket.on('updateUsers', (updatedUsers) => {
      setUsers(updatedUsers);
    }); 
                                      // Je ne sais pas pk c'est différent entre ici et la ligne 60
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
        console.log('manche : '+manche)
        return {
          playerId: audio.playerId,
          audioUrl: audioUrl,
          manche: manche
        };
      });
      setAudios(audiosWithUrls);
    });

    socket.on("chat message", (msg) => {
      console.log('On arrive à la reception du message.');
      setMessages((prevMessages) => [...prevMessages, msg.message]);
    });

    // socket.on("audio", (arrayBuffer) => { //  client ( Blob ) → Serveur (Buffer) → Client (conversion automatique de Buffer vers ArrayBuffer)
    //   if (arrayBuffer instanceof ArrayBuffer) {
    //     const audioBlob = new Blob([arrayBuffer], { type: "audio/wav" });
    //     const audioUrl = URL.createObjectURL(audioBlob);
    //     setReceivedAudio(audioUrl);
    //   } else {
    //     console.error("Format audio non supporté :", arrayBuffer);
    //   }
    // });

     // Écouter l'événement 'audiosByManche' pour recevoir les données
    //  socket.on('audiosByManche', (audios) => {
    //   setAudiosBis(audios);
    // });

    // if (resetProgress) {
    //   // Réinitialise la barre de progression après un court délai
    //   const timeout = setTimeout(() => setResetProgress(false), 50);
    //   return () => clearTimeout(timeout);
    // }


    return () => {
      socket.off('updateUsers');
      socket.off("chat message");
      socket.off("audios");
      socket.off('audiosByManche');
      // if (timeoutRef.current) {
      //   clearTimeout(timeoutRef.current);
      // }
    };
  }, [socket, manche, resetProgress]);

  // const handleSetPseudo = () => {
  //   if (pseudo) {
  //       socket.emit('setPseudo', pseudo);
  //   }
  // };

  const sendMessage = () => {
    if (message.trim() !== "") {
      console.log('On arrive avant l\'envoie du message');
      console.log(message);
      console.log(pseudo)
      socket.emit("chat message", { pseudo, message });
      setMessage("");
      console.log('On arrive après l\'envoie du message');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        socket.emit("audio", { playerId: pseudo, audioData: audioBlob, manche: manche });
        audioChunksRef.current = [];
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Erreur lors de l'accès au microphone :", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (audioStream) {
        audioStream.getTracks().forEach((track) => track.stop());
      }
    }
  };

  const handleGetAudios = () => {
    socket.emit('getAudios', 'player2');
  };

  const handleEndGame = () => {
    socket.emit('endGame');
  };

  const startGame = () => {
    setGameStarted(true); // Démarre le jeu
    let counter = 1;
    const interval = setInterval(() => {
      counter++;
      if (counter <= 4) {
        setText(`texte ${counter}`);
        setResetProgress(true); // Active la réinitialisation
        setGameStarted(false)
        // Nettoie le timeout précédent s'il existe
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        // console.log('on est là en tous cas')
        // // Démarre un nouveau timeout
        timeoutRef.current = setTimeout(() => {
          console.log('on y arrive')
          setResetProgress(false);
          setGameStarted(true);
        }, 50); // Réinitialise la barre après un court délai
      } else {
        clearInterval(interval); // Arrête l'intervalle une fois que le texte 4 est affiché
        if (timeoutRef.current) {
          console.log('on va bien nettoyer');
          clearTimeout(timeoutRef.current);
        }
      }
    }, 10000); // Changement toutes les 10 secondes
    return () => clearInterval(interval);
  };

  
  const fetchAudiosByManche = (manche) => {
    socket.emit('getAudiosByManche', manche); // Demander tous les audios de la manche spécifiée
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % audios.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + audios.length) % audios.length);
  };

  const changeManche = (newManche) => {
    setManche(newManche);
    setCurrentIndex(0); // Réinitialiser l'index à 0 pour la nouvelle manche
  };

  return (
    <div>
      <div>
          <h1>Bienvenue, {pseudo}!</h1>
          <GamePhase />
          <h3>Utilisateurs connectés:</h3>
          <ul>
              {users.map((user, index) => (
                  <li key={index}>{user}</li>
              ))}
          </ul>
      </div>
      <button onClick={startGame}>Lancer le jeu</button>
      <h1>{text}</h1>
      <div className="progress-bar">
        <div
          className={`progress ${resetProgress ? 'resetProgress' : ''} ${gameStarted ? 'started' : ''}`}
        ></div>
      </div>
      <h1>Chat en direct</h1>
      <div>
        {messages.map((msg, index) => ( 
          <p key={index}> 
            <strong>{msg.pseudo}:</strong> {msg.message} {/* Ne met pas à jour le pseudo dans le chat post-changement de pseudo */}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Écris un message..."
      />
      <button onClick={sendMessage}>Envoyer msg</button>
      <h1>Enregistrement audio en direct</h1>
      <div>
        {!isRecording ? (
          <button onClick={startRecording}>Démarrer l'enregistrement</button>
        ) : (
          <button onClick={stopRecording}>Arrêter l'enregistrement</button>
        )}
      </div>
      <button onClick={handleGetAudios}>Get Audios</button>
      <button onClick={handleEndGame}>End Game</button>
      <div>
        {audios.map((audio, index) => (
          <audio key={index} controls src={audio.audioUrl} />
        ))}
      </div>
      {/* <div>
        {receivedAudio && (
          <audio controls src={receivedAudio}></audio>
        )}
      </div> */}
      <div>
        <h1>Lecteur audio</h1>
        <div>
          <button onClick={() => fetchAudiosByManche(manche)}>Récupérer audio de la manche</button>
          <button onClick={() => changeManche(1)}>Manche 1</button>
          <button onClick={() => changeManche(2)}>Manche 2</button>
          <button onClick={() => changeManche(3)}>Manche 3</button>
          {/* Ajoutez autant de boutons que de manches */}
        </div>
        {audios.length > 0 && (
          <div>
            {/* <h2>{audiosBis[currentIndex].playerId}</h2> */}
            <audio controls src={audios[currentIndex].audioUrl}></audio>
          </div>
        )}
        <button onClick={handlePrevious} disabled={currentIndex === 0}>
          Précédent
        </button>
        {console.log("longueur de audios: "+audios.length)}
        {console.log("currentIndex: "+currentIndex)}
        <button onClick={handleNext} disabled={currentIndex === (audios.length - 1)}>
          Suivant
        </button>
      </div>
      <UploadVideos socket={socket} />
    </div>
  );
}

export default MainPage;