import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ClickableGrievanceTitle from "../../components/Common/ClickableGrievanceTitle";

const MyGrievances = () => {
  const { allGrievances } = useSelector((state) => state.grievance);
  const { user } = useSelector((state) => state.profile);

  const myGrievances = (allGrievances || []).filter(
    (g) => g?.user?._id === user?._id
  );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-3xl font-bold text-blue-800 mb-6">📋 My Grievances</h2>

      {myGrievances.length === 0 ? (
        <p className="text-gray-600">You haven't submitted any grievances yet.</p>
      ) : (
        <ul className="space-y-4">
          {myGrievances.map((g) => (
            <li key={g._id} className="border p-4 rounded-md bg-gray-50 shadow-sm hover:shadow transition">
              <div className="flex justify-between items-center mb-2">
                <ClickableGrievanceTitle 
                  title={g.title}
                  grievanceId={g._id}
                  className="text-lg font-semibold text-gray-800"
                />
                <span
                  className={`text-xs font-medium px-2 py-1 rounded ${
                    g.status === "Resolved"
                      ? "bg-green-100 text-green-700"
                      : g.status === "Rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {g.status}
                </span>
              </div>
              <p className="text-gray-700 text-sm mb-2 line-clamp-2">
                {g.description}
              </p>

              <Link
                to={`/grievances/${g._id}`}
                className="text-blue-600 text-sm hover:underline"
              >
                View Full Details →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyGrievances;
