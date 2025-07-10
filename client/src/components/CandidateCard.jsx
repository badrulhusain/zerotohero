import React from 'react';

const CandidateCard = ({ name, image, points, id }) => {
  return (
    <div className="
      bg-white 
      rounded-2xl 
      p-8 
      w-80 
      text-center 
      transition-all 
      duration-300 
      shadow-xl
      hover:scale-105
      border-2
      border-green-400
      flex flex-col items-center
    ">
      <img
        src={`/assets/${id}.png`}
        alt={`${name}'s profile`}
        className="mx-auto rounded-full border-4 border-green-400 object-cover mb-4 w-[144px] h-[144px] bg-green-50"
      />
      <h2 className="text-2xl font-bold text-green-800 truncate uppercase tracking-wide">{name}</h2>
      <p className="text-2xl font-semibold text-green-600 mt-2">
        🎯 Points: <span className="font-extrabold text-green-900">{points}</span>
      </p>
      <p className="text-lg text-green-500 mt-1">Code: {id}</p>
    </div>
  );
};

export default CandidateCard;