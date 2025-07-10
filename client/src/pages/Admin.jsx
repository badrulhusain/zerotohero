import React, { useState, useEffect } from 'react';
import socket from '../socket.js';
import axios from 'axios';

function Admin() {
  const [inputMark, setInputMark] = useState("");
  const [candidateId, setCandidateId] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [marks, setMarks] = useState([]);
  const [feedback, setFeedback] = useState('');

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

    if (isNaN(id) || isNaN(markToAdd)) {
      setFeedback("❗ Invalid input!");
      return;
    }

    const candidateToUpdate = candidates.find(c => c.candidateId === id);
    if (!candidateToUpdate) {
      setFeedback("❗ Candidate not found!");
      return;
    }

    const updated = marks.map(c =>
      c.candidateId === id
        ? { ...c, points: c.points + markToAdd }
        : c
    );

    setMarks(updated);
    setInputMark("");
    setCandidateId("");
    setFeedback("✅ Mark added successfully!");
    socket.emit('updatePoints', updated);
  };

  const handleMinusMarkById = () => {
    const id = parseInt(candidateId);
    const markToAdd = parseInt(inputMark);

    if (isNaN(id) || isNaN(markToAdd)) {
      setFeedback("❗ Invalid input!");
      return;
    }

    const candidateToUpdate = candidates.find(c => c.candidateId === id);
    if (!candidateToUpdate) {
      setFeedback("❗ Candidate not found!");
      return;
    }

    const updated = marks.map(c =>
      c.candidateId === id
        ? { ...c, points: c.points - markToAdd }
        : c
    );

    setMarks(updated);
    setInputMark("");
    setCandidateId("");
    setFeedback("✅ Mark subtracted successfully!");
    socket.emit('updatePoints', updated);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-200">
      <div className="w-[95vw] md:w-[85vw] lg:w-[75vw] xl:w-[70vw] 2xl:w-[60vw] mx-auto p-12 md:p-20 rounded-3xl bg-white shadow-2xl border-4 border-green-300 flex flex-col items-center">
        <h2 className="text-4xl mb-12 text-center font-extrabold text-green-700 tracking-tight drop-shadow-lg">
          Admin Panel: Update Candidate Marks
        </h2>
        <div className="w-full max-w-2xl flex flex-col gap-10">
          <input
            type="number"
            value={candidateId}
            onChange={(e) => setCandidateId(e.target.value)}
            placeholder="Enter Candidate ID"
            className="w-full p-5 rounded-xl border-2 border-green-200 focus:border-green-500 focus:outline-none text-green-700 text-2xl font-medium bg-green-50 transition"
          />
          <input
            type="number"
            value={inputMark}
            onChange={(e) => setInputMark(e.target.value)}
            placeholder="Enter Mark"
            className="w-full p-5 rounded-xl border-2 border-green-200 focus:border-green-500 focus:outline-none text-green-700 text-2xl font-medium bg-green-50 transition"
          />
          <div className="flex flex-col md:flex-row gap-8">
            <button
              onClick={handleAddMarkById}
              className="w-full py-5 rounded-xl bg-gradient-to-r from-green-400 to-green-600 text-white font-bold text-2xl shadow-xl hover:from-green-500 hover:to-green-700 transition"
            >
              Add Mark
            </button>
            <button
              onClick={handleMinusMarkById}
              className="w-full py-5 rounded-xl bg-gradient-to-r from-green-300 to-green-500 text-white font-bold text-2xl shadow-xl hover:from-green-400 hover:to-green-600 transition"
            >
              Subtract Mark
            </button>
          </div>
          {feedback && (
            <div className={`w-full text-center text-lg font-semibold mt-6 ${feedback.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
              {feedback}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;