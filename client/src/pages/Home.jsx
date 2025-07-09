import React,{useState,useEffect} from 'react'
import socket from '../socket.js';
import axios from 'axios';
import CandidateCard from '../components/CandidateCard.jsx';
function Home() {
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



  return (
  <div className="p-6 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">🎯 Real-Time Mark Table</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {[...candidates]
          .sort((a, b) => {
            const aPoints = marks.find(c => c.candidateId === a.candidateId)?.points || 0;
            const bPoints = marks.find(c => c.candidateId === b.candidateId)?.points || 0;
            return bPoints - aPoints; // descending
          })
          .map((item) => {
            const match = marks.find(c => c.candidateId === item.candidateId);
            return (
              <CandidateCard
                key={item.candidateId}
                name={item.name}
                image={item.image}
                id={item.candidateId}
                points={match?.points || 0}
              />
            );
          })}
      </div>

      
    </div>

  )
}

export default Home