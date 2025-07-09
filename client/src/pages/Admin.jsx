import React,{useState,useEffect} from 'react'
import socket from '../socket.js';
import axios from 'axios';
function Admin() {
       const [inputMark, setInputMark] = useState("");
    const [candidateId, setCandidateId] = useState("");
    const [candidates, setCandidates] = useState([]);
    const [marks, setMarks] = useState([]);


  useEffect(() => {
    // Fetch full candidate data
    axios.get('http://localhost:4000/candidates')
      .then(res => {
        setCandidates(res.data);
        setMarks(res.data.map(c => ({
          candidateId: c.candidateId,
          points: c.points
        })));
      })
      .catch(err => console.error('❌ Failed to fetch candidates:', err));

    // Handle real-time updates
    const handlePointsUpdated = (updated) => {
      setMarks(updated);
    };

    socket.on('pointsUpdated', handlePointsUpdated);
    return () => socket.off('pointsUpdated', handlePointsUpdated);
  }, []);

   const handleAddMarkById = () => {
    const id = parseInt(candidateId);
    const markToAdd = parseInt(inputMark);

    if (isNaN(id) || isNaN(markToAdd)) return alert("❗ Invalid input!");

    const candidateToUpdate = candidates.find(c => c.candidateId === id);
    if (!candidateToUpdate) return alert("❗ Candidate not found!");
  


    const updated = marks.map(c =>
      c.candidateId === id
        ? { ...c, points: c.points + markToAdd }
        : c
    );

    setMarks(updated);
    setInputMark("");
    setCandidateId("");
    socket.emit('updatePoints', updated);
  };
  const handleMinusMarkById = () => {
    const id = parseInt(candidateId);
    const markToAdd = parseInt(inputMark);

    if (isNaN(id) || isNaN(markToAdd)) return alert("❗ Invalid input!");

    const candidateToUpdate = candidates.find(c => c.candidateId === id);
    if (!candidateToUpdate) return alert("❗ Candidate not found!");
  


    const updated = marks.map(c =>
      c.candidateId === id
        ? { ...c, points: c.points - markToAdd }
        : c
    );

    setMarks(updated);
    setInputMark("");
    setCandidateId("");
    socket.emit('updatePoints', updated);
  };

  return (
    <div className='flex  flex-col justify-center items-center'>
       <div className="mt-10 w-full max-w-md space-y-3">
        <input
          type="number"
          value={inputMark}
          onChange={(e) => setInputMark(e.target.value)}
          placeholder="Enter mark"
          className="w-full px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          value={candidateId}
          onChange={(e) => setCandidateId(e.target.value)}
          placeholder="Enter candidate ID"
          className="w-full px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddMarkById}
          className="w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700"
        >
          Add Mark
        </button>
        <button
          onClick={handleMinusMarkById}
          className="w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700"
        >
          minus mark
        </button>
      </div>
    </div>
  )
}

export default Admin