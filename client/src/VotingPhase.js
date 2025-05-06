import React, { useEffect, useState, useRef } from "react";
import videoData from "./video.json";
import StarRating from './StarRating';
import "./VotingPhase.css";


// TO DO :
//
// 1. Strart listening everybody at the same time
// 2. DONE : When going for next player everybody change at the same time
// 3. If last player of this round, emit ratings without needing to click on next player

const VotingPhase = ({ socket, videoNb, setVideoNb }) => {
    const [rating, setRating] = useState(0);
    // const [videoNb, setVideoNb] = useState(1);
    const [audios, setAudios] = useState([]);
    const [playerRank, setPlayerRank] = useState(0);
    const maxVideoNb = 2;
    const audioRefs = useRef([]);
    const [nextButtonText, setNextButtonText] = useState("Joueur suivant"); 

    // Start of potentiel component

        const playerRef = useRef(null);
        // const [i, setI] = useState(1);

    const startWatching = () => {
      socket.emit("startWatching");
    }
    useEffect(() => {
      socket.on("startWatching", start); // Register the listener
      return () => {
        socket.off("startWatching", start); // Cleanup the listener when the component unmounts
      };
    });

    const start = () => {
      // start audio too
      // start for everybody
        if (playerRef.current) {          
          playerRef.current.mute()
          playerRef.current.seekTo(0);
          playerRef.current.playVideo();
          console.log('Lecture de la vidéo');
        }
        const currentAudio = audioRefs.current[playerRank];
        if (currentAudio) {
            currentAudio.currentTime = 0; // Reset audio to the beginning
            currentAudio.play();
            console.log('Lecture de l\'audio');
        }
      };

          useEffect(() => {
            const handleNextVid = () => {
              // if (!(playerRank < audios.length - 1)) {
              //   console.log("Emitting : "+audios[playerRank]?.playerId+" rating: "+rating+"rank: "+playerRank);
              //   socket.emit("results", {
              //     playerId: audios[playerRank]?.playerId,
              //     rating: rating
              //   });
              // }
              setNextButtonText('Joueur suivant'); // Reset button text
              setVideoNb((prevVideoNb) => {
                if (prevVideoNb < maxVideoNb) {
                    setPlayerRank(0);
                    return prevVideoNb + 1; // Increment safely
                  } else {
                    // Fin de jeu → passer à la phase de résultats
                    console.log("Fin du jeu, passer à la phase de résultats");
                    return 0; // change scene
                  }
                }); // Increment i safely
            };

            const handlePrevVid = () => {
              setVideoNb((prevVideoNb) => {
                if (prevVideoNb === 1) {
                    return 1; // Prevent going below 1
                } else {
                    return prevVideoNb - 1; // Decrement i safely
                }
              }); // Decrement i safely
            }; 

      
            socket.on('nextVid', handleNextVid); // Register the listener
            socket.on('prevVid', handlePrevVid);
      
            // Cleanup the listener when the component unmounts
            return () => {
                socket.off('nextVid', handleNextVid); // Remove the listener
                socket.off('prevVid', handlePrevVid);
            };
          }, [socket, setVideoNb]); // Add dependencies to the effect

    useEffect(() => {
        const onYouTubeIframeAPIReady = () => {
          const videoKey = `video${videoNb}`; // Dynamically construct the key using i
          const videoId = videoData[videoKey]?.videoId; // Safely access the videoId
  
          if (!videoId) {
            console.log("Fin du jeu");
            // console.error(`No video found for key: ${videoKey}`);
            return;
          }

          playerRef.current = new window.YT.Player('youtube-player', {
            videoId: videoId, // ID de la vidéo
            playerVars: {
              rel: 0,
              modestbranding: 1,
              controls: 0,
              autoplay: 0, // Désactive l'autoplay initial
            },
            // events: {
            //   onReady: () => {
            //     console.log('Lecteur prêt');
            //     getVideoDuration(); // Obtenir la durée une fois le lecteur prêt
            //   },
            //   onStateChange: handleStateChange,
            // },
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
                }, [videoNb]);

    // END of potentiel component


    const nextDub = () => { 
        socket.emit("nextVid");
        // setVideoNb((prevVideoNb) => {
        //   if (prevVideoNb < 2) {
        //     setPlayerRank(0);
        //     return prevVideoNb + 1; // Increment safely
        //   } else {
        //     // Fin de jeu → passer à la phase de résultats
        //     console.log("Fin du jeu, passer à la phase de résultats");
        //     return 0; // change scene
        //   }
        // }); // Increment videoNb safely
        // if last video
          // receive the results and display them
    };

    // const prevDub = () => {
    //     socket.emit("prevVid");
    //     setVideoNb((prevVideoNb) => Math.max(prevVideoNb - 1, 1)); // Prevent going below 1
    // };

    useEffect(() => {
      socket.emit("getAudiosByManche", videoNb); // videoNb is aproximately the round number

      socket.on("audios", (audios) => {
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
    }, [socket, videoNb]);

    useEffect(() => {
      // console.log(`Selected rating: ${rating}`);
      // console.log(`Player ID: ${audios[playerRank]?.playerId}`);
      socket.on("results", (results) => {
        results.forEach((result) => {
          console.log(result);
        });
      });

      return () => {
        socket.off("results"); // Cleanup the listener when the component unmounts
      };
    }, [socket]);

    const nextPlayerHandler = () => {
        setPlayerRank((prevPlayerRank) => {
            if (prevPlayerRank < audios.length - 1) {
            //   console.log("Emitting : "+audios[playerRank]?.playerId+" rating: "+rating);
            //   socket.emit("results", {
            //     playerId: audios[playerRank]?.playerId,
            //     rating: rating
            //   });
            if (prevPlayerRank === audios.length - 2) { // Check if it's the last player
              setNextButtonText("Vidéo suivante"); // Change button text
            }
                return prevPlayerRank + 1; // Increment safely
            } else {
                nextDub(); // Prevent going out of bounds
            }
          });
          // Get playerId and client rating
          // send it to the server
          console.log("Verifying ... Emitting : "+audios[playerRank]?.playerId+" rating: "+rating+" rank: "+playerRank);
          socket.emit("results", {
            playerId: audios[playerRank]?.playerId,
            rating: rating
          });
    };

    const nextPlayer = () => {
      socket.emit("nextPlayer");
    }

    useEffect(() => {
      socket.on('nextPlayer', nextPlayerHandler);
      return () => {
        socket.off('nextPlayer', nextPlayerHandler); // Cleanup the listener when the component unmounts
      };
    });


    // const prevPlayer = () => {
    //     setPlayerRank((prevPlayerRank) => {
    //         if (prevPlayerRank > 0) {
    //             return prevPlayerRank - 1; // Decrement safely
    //         } else {
    //             return prevPlayerRank; // Prevent going out of bounds
    //         }
    //     });
    // };

    // const getResults = () => {
    //   socket.emit("getResults");
    // };

    return (
        <div className="containerVotingPhase">
          <div className="ytbPlayerVoting">
            <div id="youtube-player"></div>
          </div>
          {/* <div className="nextVidBtnVoting">
            <button onClick={nextDub}>Vidéo suivante :)</button>
          </div> */}
          {/* <div className="prevVidBtnVoting">
            <button onClick={prevDub}>Vidéo précedente :)</button>
          </div> */}
            <button onClick={startWatching} className="startBtnVoting">Commencer</button>
            {videoNb > 0 ? (
              <div className="audioContainer">
                <p>Le doublage de {audios[playerRank]?.playerId}</p>
                {audios.map((audio, index) => (
                  <div key={index} style={{ display: 'none' }}>
                    <audio  controls src={audio.audioUrl} ref={(el) => (audioRefs.current[index] = el)}/>
                    {/* <p>Le doublage de {audio.playerId}</p> */}
                  </div>
                ))}
              </div>
            ) : (
              // ne se passe jamais
              <div> 
                <p>Pas de doublage disponible</p>
                <p>Aller au résultat</p>
              </div>
            )}
              

            <div className="ratingContainer">
              <StarRating setRating={setRating} />
              {/* <p>Current rating: {rating} of 5</p> */}
            </div>
            <div className="nextPlayerBtnVoting">
              <button onClick={() => nextPlayer()}>{nextButtonText}</button>
            </div>
            {/* <div className="prevPlayerBtnVoting">
              <button onClick={prevPlayer}>Joueur précedent</button>
            </div> */}
            {/* <button onClick={getResults}>Resultat !!</button> */}
        </div>
    );
};

export default VotingPhase;