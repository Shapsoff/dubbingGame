import React, { useEffect } from "react";
// import videoData from "./video.json";
// TO DO :

// maybe create a const for progressBAr instead of using querySelector multiple times
// check if not possible to reduce the length of getVideoDuration function
// Add a protector, not being able to launch the video with the button "commencer" before it's loaded
// → it creates a crash





const StartDubbingPt1 = ({ socket,setI, start }) => {
    // const playerRef = useRef(null);
    // const [duration, setDuration] = useState(0);


    useEffect(() => {
      const handleNextVid = () => {
        setI((prevI) => prevI + 1); // Increment i safely
      };

      socket.on('nextVid', handleNextVid); // Register the listener

      // Cleanup the listener when the component unmounts
      return () => {
          socket.off('nextVid', handleNextVid); // Remove the listener
      };
    }, [socket, setI]);
    
      // Fonction pour démarrer la vidéo
      // const start = () => {
      //   if (playerRef.current) {
      //     const progressBar = document.querySelector('.progress-bar');
      //     // Reset the animation by removing and re-adding the class
      //     progressBar.style.animation = 'none'; // Disable the animation
      //     void progressBar.offsetWidth; // Trigger reflow to reset the animation
      //     progressBar.style.animation = `progress ${duration}s linear`;
          
      //     playerRef.current.mute()
      //     playerRef.current.seekTo(0);
      //     playerRef.current.playVideo();
      //     console.log('Lecture de la vidéo');
      //   }
      // };
      // const handleStateChange = (event) => {
      //   if (event.data === window.YT.PlayerState.PAUSED) {
      //     // Set --animation-duration to 0 when the video is paused
      //     document.querySelector('.progress-bar').style.setProperty('animation-play-state', 'paused');
      //     console.log('Vidéo en pause, animation arrêtée.');
      //   }
      // }
      // // const getVideoDuration = () => {
      // //   if (playerRef.current) {
      // //     const videoDuration = playerRef.current.getDuration();
      // //     setDuration(videoDuration);
      // //     console.log('Durée de la vidéo :', videoDuration, 'secondes');
      // //   }
      // // };
      //   // Initialisation du lecteur après le rendu
      //   useEffect(() => {
      //     const onYouTubeIframeAPIReady = () => {
      //       const videoKey = `video${i}`; // Dynamically construct the key using i
      //       const videoId = videoData[videoKey]?.videoId; // Safely access the videoId
    
      //       if (!videoId) {
      //         console.log("Fin du jeu");
      //         onVotingPhase();
      //         // console.error(`No video found for key: ${videoKey}`);
      //         return;
      //       }

      //       playerRef.current = new window.YT.Player('youtube-player', {
      //         videoId: videoId, // ID de la vidéo
      //         playerVars: {
      //           rel: 0,
      //           modestbranding: 1,
      //           controls: 0,
      //           autoplay: 0, // Désactive l'autoplay initial
      //         },
      //         events: {
      //           onReady: () => {
      //             console.log('Lecteur prêt');
      //             if (playerRef.current) {
      //               const videoDuration = playerRef.current.getDuration();
      //               setDuration(videoDuration);
      //               console.log('Durée de la vidéo :', videoDuration, 'secondes');
      //             } // Obtenir la durée une fois le lecteur prêt
      //           },
      //           onStateChange: handleStateChange,
      //         },
      //       });
      //     };
      
      //     // Si l'API est déjà chargée
      //     if (window.YT) {
      //       onYouTubeIframeAPIReady();
      //     } else {
      //       // Sinon, on attend qu'elle soit prête
      //       window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
      //     }
      
      //     return () => {
      //       if (playerRef.current) {
      //         playerRef.current.destroy();
      //       }
      //     };
      //   }, [i, onVotingPhase]);
        return (
            <div className="ytbAndProgressBar">
                <div id="youtube-player" className="ytbPlayer"></div>
                <div className="progress-container">
                    <div className="progress-bar"></div>
                </div>
                {/* <button onClick={start}>Commencer</button> */}
            </div>
        )
};

export default StartDubbingPt1;