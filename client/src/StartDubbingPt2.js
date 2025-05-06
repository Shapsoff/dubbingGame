import React from "react";

const StartDubbingPt2 = ({ isRecording, startRecording, stopRecording }) => {
    // const [audioStream, setAudioStream] = useState(null);
    // const [isRecording, setIsRecording] = useState(false);
    // // const [manche, setManche] = useState(1);
    // // const manche = 1;
    // const mediaRecorderRef = useRef(null);
    // const audioChunksRef = useRef([]);
    

    // const startRecording = async () => {
    //     try {
    //       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    //       setAudioStream(stream);
    
    //       const mediaRecorder = new MediaRecorder(stream);
    //       mediaRecorderRef.current = mediaRecorder;
    
    //       mediaRecorder.ondataavailable = (event) => {
    //         if (event.data.size > 0) {
    //           audioChunksRef.current.push(event.data);
    //         }
    //       };
    
    //       mediaRecorder.onstop = () => {
    //         const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
    //         socket.emit("audio", { playerId: pseudo, audioData: audioBlob, manche: i });
    //         audioChunksRef.current = [];
    //       };
    
    //       mediaRecorder.start();
    //       setIsRecording(true);
    //     } catch (error) {
    //       console.error("Erreur lors de l'accès au microphone :", error);
    //     }
    //   };
    
    //   const stopRecording = () => {
    //     if (mediaRecorderRef.current) {
    //       mediaRecorderRef.current.stop();
    //       setIsRecording(false);
    //       if (audioStream) {
    //         audioStream.getTracks().forEach((track) => track.stop());
    //       }
    //     }
    //   };


    return (
        <div className="toggleRecodingBtn">
            {!isRecording ? ( // De base il devrait pas y avoir de btn "demarrer l'enregistrement"
                <button onClick={startRecording}>Démarrer l'enregistrement</button>
            ) : (
                <button onClick={stopRecording}>Arrêter l'enregistrement</button>
            )}
        </div>
    );
};

export default StartDubbingPt2;