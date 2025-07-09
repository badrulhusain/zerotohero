import React from 'react';

const CandidateCard = ({ name, image, points, id }) => {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-4 w-72 text-center hover:shadow-xl transition">
      <img
        src={image}
        alt={name}
        
        className=" mx-auto rounded-md border-4 border-blue-500 object-cover mb-3 w-[200px] h-[160px] "
      />
      <h2 className="text-xl font-semibold text-gray-800">{name}</h2>
      <p className="text-md text-green-600 font-medium">🎯 Marks: {points}</p>

    <p>{id}</p>
    </div>
  );
};

export default CandidateCard;
