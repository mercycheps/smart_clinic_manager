import React from "react";

const RecentActivity = ({ activities = [] }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 mt-6">
      <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
      <ul className="space-y-2">
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <li key={index} className="text-sm text-gray-700">
              • {activity}
            </li>
          ))
        ) : (
          <li className="text-gray-500">No recent activities</li>
        )}
      </ul>
    </div>
  );
};

export default RecentActivity;
