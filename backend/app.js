const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv=require('dotenv')
const app = express();
const server = http.createServer(app);
const mongoose = require('mongoose');
const Candidate = require('./models/Candidate');
dotenv.config()


const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // ✅ Correct port for Vite
    methods: ["GET", "POST"],
    credentials: true
  }
});
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend Vite port
  credentials: true
}));
// Initial mark data for 6 candidates
let points = [
  { candidateId: 100, points: 0 },
  { candidateId: 101, points: 0 },
  { candidateId: 102, points: 0 },
  // Add more as needed
];


app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));
// 🔍 API to fetch all marks
app.get('/points', async (req, res) => {
  try {
    const allPoints = await Candidate.find().select("candidateId points");
    res.json(allPoints);
  } catch (error) {
    console.error(error);
    res.status(500).json("Failed to fetch points");
  }
});

app.post('/candidate',async(req,res)=>{
    const {candidateId,name,image,points}=req.body;
   if(!candidateId||!name||!image ){
    return res.status(400).json("please fill all the fields")
   }
    const candidate =await  Candidate.create({
        candidateId,
        name,
        image,
        points

    })
    console.log(candidate);
    

    res.status(200).json("user created success fully",candidate)
})
app.get('/candidates', async (req, res) => {
  try {
    const all = await Candidate.find();
    res.json(all);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch candidates" });
  }
});


// 🟢 Real-time logic
io.on('connection', (socket) => {
  console.log("Client connected");

  // Send current marks on connect
  socket.emit('pointsUpdated', points);

 socket.on('updatePoints', async (updated) => {
  try {
    // Update each candidate's points in MongoDB
    for (const update of updated) {
      await Candidate.updateOne(
        { candidateId: update.candidateId },
        { $set: { points: update.points } }
      );
    }

    // Fetch fresh updated data from DB
    const allUpdated = await Candidate.find().select("candidateId points");
    
    // Emit to all clients
    io.emit('pointsUpdated', allUpdated);

  } catch (error) {
    console.error("Error updating candidate points:", error);
  }
});


 socket.on('updatePoints', (updated) => {
  points = updated; // replace in-memory
  io.emit('pointsUpdated', points); // broadcast to all clients
});

});

// 🚀 Start server
server.listen(4000, () => {
  console.log('Server running on http://localhost:4000');
});
