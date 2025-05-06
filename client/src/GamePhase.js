import React, { useEffect, useState, useRef } from 'react';
import './GamePhase.css';
import StartDubbingPt1 from './StartDubbingPt1';
// import StartDubbingPt2 from './StartDubbingPt2';
// import TestingAudio from './TestingAudio';
import ChangeVid from './ChangeVid';
import ShowPlayersBis from './ShowPlayersBis';
import videoData from "./video.json";

// TO DO :
//
// check line 207
// send the audio only when changing the video (allow user to redo the dubbing)


const GamePhase = ({ pseudo, socket, onVotingPhase }) => {
  const [i, setI] = useState(1); // Round

  // ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
  // StartDubbingPt1 
  const playerRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const progressBar = document.querySelector('.progress-bar');

      // Fonction pour démarrer la vidéo
      const start = () => {
        if (playerRef.current) {
          // Reset the animation by removing and re-adding the class
          progressBar.style.animation = 'none'; // Disable the animation
          void progressBar.offsetWidth; // Trigger reflow to reset the animation
          progressBar.style.animation = `progress ${duration}s linear`;
          
          playerRef.current.mute()
          playerRef.current.seekTo(0);
          playerRef.current.playVideo();
          console.log('Lecture de la vidéo');
        }
      };
      const handleStateChange = (event) => {
        if (event.data === window.YT.PlayerState.PAUSED) {
          // Set --animation-duration to 0 when the video is paused
          document.querySelector('.progress-bar').style.setProperty('animation-play-state', 'paused');
          console.log('Vidéo en pause, animation arrêtée.');
          if (isRecording) {
            stopRecording();
          }
        } else if (event.data === window.YT.PlayerState.ENDED) {
          console.log('Vidéo terminée, arrêt de l\'enregistrement.');
          stopRecording();
        }
      };
      // const getVideoDuration = () => {
      //   if (playerRef.current) {
      //     const videoDuration = playerRef.current.getDuration();
      //     setDuration(videoDuration);
      //     console.log('Durée de la vidéo :', videoDuration, 'secondes');
      //   }
      // };
        // Initialisation du lecteur après le rendu
        useEffect(() => {
          const onYouTubeIframeAPIReady = () => {
            const videoKey = `video${i}`; // Dynamically construct the key using i
            const videoId = videoData[videoKey]?.videoId; // Safely access the videoId
    
            if (!videoId) {
              console.log("Fin du jeu");
              onVotingPhase();
              // console.error(`No video found for key: ${videoKey}`);
              return;
            }

            playerRef.current = new window.YT.Player('youtube-player', {
              videoId: videoId, // ID de la vidéo
              playerVars: {
                rel: 0,
                modestbranding: 1,
                controls: 1,
                autoplay: 0, // Désactive l'autoplay initial
              },
              events: {
                onReady: () => {
                  console.log('Lecteur prêt');
                  if (playerRef.current) {
                    const videoDuration = playerRef.current.getDuration();
                    setDuration(videoDuration);
                    console.log('Durée de la vidéo :', videoDuration, 'secondes');
                  } // Obtenir la durée une fois le lecteur prêt
                },
                onStateChange: handleStateChange,
              },
            });
          };
      
          // Si l'API est déjà chargée
          if (window.YT) {
            onYouTubeIframeAPIReady();
          } else {
            // Sinon, on attend qu'elle soit prête
            window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
          }
      
          return () => {
            if (playerRef.current) {
              playerRef.current.destroy();
            }
          };
        }, [i, onVotingPhase]);


  // End of StartDubbingPt1
  // ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

  // ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
  // StartDubbingPt2

    const [audioStream, setAudioStream] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    // const [manche, setManche] = useState(1);
    // const manche = 1;
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    // const [audioBlob, setAudioBlob] = useState(null);
    

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
            // const newAudioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
            socket.emit("audio", { playerId: pseudo, audioData: audioBlob, manche: i });
            // setAudioBlob(newAudioBlob);
            audioChunksRef.current = [];
          };
    
          mediaRecorder.start();
          setIsRecording(true);
        } catch (error) {
          console.error("Erreur lors de l'accès au microphone :", error);
        }
      };
    
      const stopRecording = () => {
        playerRef.current.seekTo(0);          // │ → Reset
        playerRef.current.pauseVideo();       // ┘

        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
          if (audioStream) {
            audioStream.getTracks().forEach((track) => track.stop());
          }
        }
      };

  // End of StartDubbingPt2
  // ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬


  socket.emit('updatePlayerStatus', { isReady: false });

  useEffect(() => {
    console.log("nextVid event received from server : " + i);
  }, [i]);

  const handleStartBoth = () => {
    start(); // Start the video
    startRecording(); // Start the audio recording
    console.log("Start both video and audio recording");
  };

  // StartDubbingPt1 cover the animation of the progress bar 
  // (starting, pause, getting the duration)
  // the control of the video (starting from 0)

  // StartDubbingPt2 will cover the use of the microphone
  // and the recording of  the audio
  // sending it to mongodb

  // To Do :
  // Reinitialize the progress bar when going onto the next video


  return (
    <div className='containerGamePhase'>
      <StartDubbingPt1 
        socket={socket} 
        setI={setI}
        start={start}
      />
      {/* <StartDubbingPt2 
        isRecording={isRecording}
        startRecording={startRecording}
        stopRecording={stopRecording}
      /> */}
      <ChangeVid socket={socket} stopRecording={stopRecording}/>
      <ShowPlayersBis socket={socket} />
      {/* <TestingAudio socket={socket} /> */}
      <div className='startBothBtn'>
          {!isRecording ? ( // De base il devrait pas y avoir de btn "demarrer l'enregistrement"
              <button onClick={handleStartBoth}>Commencer <br></br>l'enregistrement</button>
          ) : (
            // Faire un hover
            // réinitialiser le progress bar
              <button onClick={stopRecording}>Arrêter l'enregistrement <br></br>pour recommencer</button> 
          )}        
      </div>
    </div>
  );
};

export default GamePhase;