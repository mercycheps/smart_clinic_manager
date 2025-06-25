import React from "react";

const SummaryCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-4">
      <div className="text-3xl">{icon}</div>
      <div>
        <div className="text-gray-600 text-sm">{title}</div>
        <div className="text-xl font-bold">{value}</div>
      </div>
    </div>
  );
};

export default SummaryCard;
