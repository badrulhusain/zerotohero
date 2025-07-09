import React,{useState,useEffect} from 'react'
import socket from '../socket.js';
import axios from 'axios';
import CandidateCard from '../components/candidateCard.jsx';

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
        return bPoints - aPoints;
      })
      .map((item, index) => {
        const match = marks.find(c => c.candidateId === item.candidateId);

        // Rank styling
        let rankStyle = "";
        let rankLabel = "";
        if (index === 0) {
          rankStyle = "border-4 border-yellow-500 shadow-lg ";
          rankLabel = "🥇 1st Place";
        } else if (index === 1) {
          rankStyle = "border-4 border-gray-400 shadow-md";
          rankLabel = "🥈 2nd Place";
        } else if (index === 2) {
          rankStyle = "border-4 border-orange-400 shadow-sm";
          rankLabel = "🥉 3rd Place";
        }

        return (
          <div key={item.candidateId} className={`${rankStyle} rounded-3xl p-4`}>
            {rankLabel && (
              <p className="text-lg font-semibold text-center text-[40px] montserrat text-green-400  mb-2">
                {rankLabel}
              </p>
            )}
            <CandidateCard
              name={item.name}
              image={item.image}
              id={item.candidateId}
              points={match?.points || 0}
            />
          </div>
        );
      })}
  </div>
</div>


  )
}

export default Home