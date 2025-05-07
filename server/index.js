require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require("cors");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { title } = require('process');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(bodyParser.json());


const username = process.env.MONGO_USER;
const password = process.env.MONGO_PASSWORD
const dbName = process.env.MONGO_DB_NAME;

app.post('/api/check-password', (req, res) => {
  console.log('Il y reception d\'un post');
  const { password } = req.body;
  const PASSWORD = process.env.GAME_PASSWORD; // A changer plus tard, mettre dans une base de données sécurisé ou variable d'environnement
  if (password === PASSWORD) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

let users = {};
const usersResults = [];

// mongoose.connect('mongodb+srv://${username}:${password}@cluster0.cci8cqg.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0');
const uri = `mongodb+srv://${username}:${password}@cluster0.cci8cqg.mongodb.net/${dbName}?retryWrites=true&w=majority`;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));


// Schéma pour les enregistrements audio
const audioSchema = new mongoose.Schema({
  playerId: String,
  audioData: Buffer, // Stocke l'audio en binaire
  manche: String,
  timestamp: { type: Date, default: Date.now },
});

const Audio = mongoose.model('Audio', audioSchema);

const videoSchema = new mongoose.Schema({
  title: String
});
// Si on veut un nom de collection personnalisée il faut mettre un 3e arguments
// const Video = mongoose.model('Video', videoSchema, 'video');
const Video = mongoose.model('Video', videoSchema);

io.on('connection', (socket) => {
  socket.on('setPseudo', (player) => {
    console.log("player's name : ", player.nickname);
    console.log('id : ', socket.id);
    users[socket.id] = player;
    io.emit('updateUsers', Object.values(users));
  });

  socket.on("updatePlayerStatus", (updatedPlayer) => {  
    // Update the user's status in the `users` object
    if (users[socket.id]) { // ← check if user exists in the users object using socket.id
      users[socket.id].isReady = updatedPlayer.isReady;
      console.log('users : ', updatedPlayer.isReady);
    }  
    // Emit the updated list of users to all clients
    io.emit('updateUsers', Object.values(users));
  });

  socket.on('startGame', () => {
    console.log('startGame');
    io.emit('startGame');
  });

  socket.on('nextVid', () => {
    console.log('Jai ressu nextVid');
    io.emit('nextVid');
  });

  socket.on('prevVid', () => {
    io.emit('prevVid');
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', { pseudo: users[socket.id], message: msg }); // Renvoie le message à tous les clients
  });

  socket.on('sound', (sound) => {
    io.emit('sound', sound);
  });

  socket.on('audio', async (data) => {
    // const { playerId, audioData, manche } = data;
    // const audio = new Audio({ playerId, audioData, manche });
    // await audio.save();
    const { playerId, audioData, manche } = data;

    try {
      // Find an existing audio and replace it, or create a new one if it doesn't exist
      const audio = await Audio.findOneAndUpdate(
        { playerId, manche }, // Query to find the existing audio
        { playerId, audioData, manche, timestamp: Date.now() }, // Data to update or insert
        { upsert: true, new: true } // Options: upsert creates a new document if none is found
      );      
    } catch (error) {
      console.error('Error saving or updating audio:', error);
      socket.emit('audioError', { message: 'Failed to save or update audio.' });
    }
  });

  socket.on('getAudiosByManche', async (manche) => {
    const audios = await Audio.find({manche});
    socket.emit('audios', audios);
  });

  socket.on('nextPlayer', () => {
    io.emit('nextPlayer');
  });

  socket.on('startWatching', () => {
    io.emit('startWatching');
  });

  socket.on('results', (data) => {
    // Find the player in the users array by their playerId
    const player = usersResults.find(user => String(user.playerId) === String(data.playerId));
    console.log('player : ', player);

    if (player) {
        // If the player exists, add the rating to their existing rating
        console.log('IF : users nickname: ', data.playerId);
        console.log('IF : rating to add : ', data.rating);
        player.rating += data.rating;
    } else {
        // If the player doesn't exist, create a new object and add it to the array
        console.log('ELSE : users nickname: ', data.playerId);
        console.log('ELSE : rating to add : ', data.rating);
        usersResults.push({ playerId: data.playerId, rating: data.rating });
    }

    // Emit the updated users array to all clients
    // io.emit('results', users);
});

  socket.on('getResults', () => {
    // Emit the users object to all clients
    io.emit('results', usersResults);
  });

  socket.on('clearAudios', async () => {
    try {
      await Audio.deleteMany({}); // Deletes all documents in the "audios" collection
      console.log('All audios have been cleared.');
      usersResults.length = 0; // Clears all elements in the usersResults array
      socket.emit('clearAudiosSuccess', { message: 'Audios cleared successfully.' });
    } catch (error) {
      console.error('Error clearing audios:', error);
      socket.emit('clearAudiosError', { message: 'Failed to clear audios.' });
    }
  });

  // socket.on('endGame', async () => {
  //   await Audio.deleteMany({});
  // });

  // Uploade Video
  socket.on('uploadVideo', async (data) => {
    const { title } = data;
    const video = new Video({ title });
    await video.save();
  });

  socket.on('disconnect', () => {
    delete users[socket.id];
    io.emit('updateUsers', Object.values(users));
  });
});

server.listen(3001, () => {
  console.log('✅ Serveur Socket.io en écoute sur *:3001');
});
