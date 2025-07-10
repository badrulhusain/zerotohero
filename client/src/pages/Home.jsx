import React, { useState, useEffect } from 'react';
import socket from '../socket.js';
import axios from 'axios';
import CandidateCard from '../components/candidateCard.jsx';
import { motion } from "framer-motion";
// import { image } from '../assets/index.js';

function Home() {
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

  // Animation variants for card entry
  const cardVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.97 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.09,
        type: "spring",
        stiffness: 120,
        damping: 13,
      }
    })
  };

  return (
    <div className="min-h-screen overflow-hidden w-full flex flex-col items-center justify-start bg-gradient-to-tr from-green-100 via-green-200 to-green-400 relative overflow-x-hidden">
      {/* Subtle animated green background blobs */}
      <div className="absolute top-0 left-0 z-0 w-full h-full pointer-events-none">
        <motion.div
          className="absolute bg-green-300 opacity-40 rounded-full w-[500px] h-[500px] filter blur-3xl left-[-120px] top-[-120px]"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 14, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bg-green-500 opacity-25 rounded-full w-[400px] h-[400px] filter blur-3xl right-[-100px] top-[200px]"
          animate={{ scale: [1, 1.09, 1], rotate: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bg-green-200 opacity-20 rounded-full w-[350px] h-[350px] filter blur-3xl left-[50%] bottom-[-100px] translate-x-[-50%]"
          animate={{ scale: [1, 1.13, 1], rotate: [0, 13, 0] }}
          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
        />
      </div>
      {/* Header */}
      <header className="relative z-10 mt-10 mb-8 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold  tracking-tight drop-shadow-xl bg-gradient-to-r from-green-700 via-green-500 to-green-400 bg-clip-text text-transparent animate-pulse">
          🏆 Candidate Leaderboard
        </h1>
      </header>

      {/* Main content */}
      <div className="relative z-10  flex flex-col items-center">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 p-6"
          initial="hidden"
          animate="visible"
        >
          {[...candidates]
            .sort((a, b) => {
              const aPoints = marks.find(c => c.candidateId === a.candidateId)?.points || 0;
              const bPoints = marks.find(c => c.candidateId === b.candidateId)?.points || 0;
              return bPoints - aPoints;
            })
            .map((item, index) => {
              const match = marks.find(c => c.candidateId === item.candidateId);

              // Rank styling (label only)
              let rankLabel = "";
              let borderStyle = "";
              let rankTextColor = "";
              if (index === 0) {
                rankLabel = "🥇 1st Place";
                borderStyle = "border-4 border-green-500";
                rankTextColor = "text-green-800";
              } else if (index === 1) {
                rankLabel = "🥈 2nd Place";
                borderStyle = "border-4 border-green-300";
                rankTextColor = "text-green-600";
              } else if (index === 2) {
                rankLabel = "🥉 3rd Place";
                borderStyle = "border-4 border-green-200";
                rankTextColor = "text-green-500";
              } else {
                borderStyle = "border border-green-100";
                rankTextColor = "text-green-400";
              }

              return (
                <motion.div
                  key={item.candidateId}
                  className={`
                    bg-white 
                    w-[36rem]
                    rounded-3xl p-6 flex flex-col items-center 
                    hover:scale-[1.04] transition-transform duration-200 
                    ${borderStyle}
                  `}
                  custom={index}
                  variants={cardVariants}
                  whileHover={{ scale: 1.07 }}
                >
                  {rankLabel && (
                    <motion.p
                      className={`text-3xl md:text-4xl font-black text-center mb-4 tracking-wide ${rankTextColor}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + index * 0.07, type: "spring" }}
                    >
                      {rankLabel}
                    </motion.p>
                  )}
                  <CandidateCard
                    name={item.name}
                    image={item.candidateId}
                    id={item.candidateId}
                    points={match?.points || 0}
                  />
                </motion.div>
              );
            })}
        </motion.div>
      </div>
    </div>
  );
}

export default Home;