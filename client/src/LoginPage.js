import React, { useState, useRef, useEffect } from 'react';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [pseudo, setPseudo] = useState('');

  const [receivedAudio, setReceivedAudio] = useState(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const [volume, setVolume] = useState(0); // Niveau de volume pour la barre
  const audioStream = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const timeoutRef = useRef(null); // Référence pour le timeout

  const handleSubmit = (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    onLogin(password, pseudo); // Appelle la fonction `onLogin` avec le mot de passe | i.e handleLogin(password) du composant App
  };

  // fonctionnalité de test micro avant d'entrer dans la game
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStream.current = stream;

      // Initialiser l'API Web Audio
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);

      // Connecter l'analyseur au flux audio
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.fftSize = 32; // Taille de la FFT (Fast Fourier Transform)

      // Démarrer l'enregistrement
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setReceivedAudio(audioUrl);
        // socket.emit("audio", { playerId: pseudo, audioData: audioBlob });
        audioChunksRef.current = [];
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Démarrer la mise à jour du volume
      updateVolume();
      // Arrêter automatiquement après 7 secondes
      timeoutRef.current = setTimeout(() => {
        stopRecording();
      }, 7000);
    } catch (error) {
      console.error("Erreur lors de l'accès au microphone :", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (audioStream.current) {
        audioStream.current.getTracks().forEach((track) => track.stop());
      }
    }
    // Nettoyer le timeout si nécessaire
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const updateVolume = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Calculer le volume moyen
    const volumeLevel = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
    setVolume(volumeLevel);

    // Continuer à mettre à jour le volume
    requestAnimationFrame(updateVolume);
  };
  //FIN fonctionnalité de test micro avant d'entrer dans la game

  // Nettoyer le timeout si le composant est démonté
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  return (
    <div className='loginContainer'>
      <h1>Connexion</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Entrez le mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="text"
          placeholder="Choisissez un pseudo"
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
        />
        <button type="submit">Se connecter</button>
      </form>
      <div>
        <button onClick={startRecording} disabled={isRecording}>
          Démarrer l'enregistrement
        </button>
        {/* <button onClick={stopRecording} disabled={!isRecording}>
          Arrêter l'enregistrement
        </button> */}

        {/* Barre de volume */}
        <div
          style={{
            width: "100%",
            height: "20px",
            backgroundColor: "#ddd",
            marginTop: "10px",
          }}
        >
          <div
            style={{
              width: `${volume}%`,
              height: "100%",
              backgroundColor: "green",
            }}
          />
        </div>
        <div>
          {receivedAudio && (
            <audio controls src={receivedAudio}></audio>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
