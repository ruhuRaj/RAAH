import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGrievanceById } from "../services/grievanceService";
import { formatData } from "../utils/helpers";
import { AiOutlineArrowLeft } from "react-icons/ai";
import Loader from "../components/Common/Loader";

function GrievanceDetailsPage() {
  const { grievanceId } = useParams();
  const navigate = useNavigate();
  const [grievance, setGrievance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGrievance = async () => {
      try {
        const data = await getGrievanceById(grievanceId);
        console.log("Fetched grievance:", data);
        setGrievance(data);
      } 
      catch (err) {
        setError(err.message || "Failed to load grievance");
      } 
      finally {
        setLoading(false);
      }
    };
    fetchGrievance();
  }, [grievanceId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10 text-lg font-medium">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-blue-600 hover:underline"
      >
        <AiOutlineArrowLeft size={20} /> Back
      </button>

      <div className="bg-white shadow-lg rounded-2xl p-8 space-y-6 border">
        <h1 className="text-2xl font-bold text-gray-800">{grievance.title}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <p><span className="font-semibold text-gray-700">Status:</span> <span className="text-blue-600 font-medium">{grievance.status}</span></p>
    <p><span className="font-semibold text-gray-700">Severity:</span> {grievance.severity}</p>
    <p><span className="font-semibold text-gray-700">Category:</span> {grievance.category}</p>
    {grievance.subCategory && (
      <p><span className="font-semibold text-gray-700">Sub-category:</span> {grievance.subCategory}</p>
    )}
    <p><span className="font-semibold text-gray-700">Department:</span> {grievance.department?.name || "N/A"}</p>
    <p><span className="font-semibold text-gray-700">Submitted by:</span> {grievance.user?.firstName} {grievance.user?.lastName}</p>
    {/* {grievance.assignedTo && ( */}
      <p><span className="font-semibold text-gray-700">Assigned To:</span>{" "} {grievance.assignedTo ? `${grievance.assignedTo.firstName} ${grievance.assignedTo.lastName}` : "Not Assigned Yet"}</p>
    {/* )} */}
  </div>

  <div>
    <p><span className="font-semibold text-gray-700">Date Submitted:</span> {formatData(grievance.createdAt)}</p>
    {grievance.location?.addressText && (
      <p><span className="font-semibold text-gray-700">Location:</span> {grievance.location.addressText}</p>
    )}
    {grievance.feedbackRating && (
      <p><span className="font-semibold text-gray-700">Feedback Rating:</span> {grievance.feedbackRating} ⭐</p>
    )}
    {grievance.feebackComments && (
      <p><span className="font-semibold text-gray-700">Feedback:</span> {grievance.feebackComments}</p>
    )}
    {grievance.resolutionDetails && grievance.status === "Resolved" && (
      <p className="text-green-700"><span className="font-semibold">Resolution:</span> {grievance.resolutionDetails}</p>
    )}
    {grievance.rejectedReason && grievance.status === "Rejected" && (
      <p className="text-red-600"><span className="font-semibold">Rejection Reason:</span> {grievance.rejectedReason}</p>
    )}
  </div>
</div>


        <div>
          <h2 className="text-lg font-semibold text-gray-800 mt-6">Description:</h2>
          <p className="mt-2 font-bold">{grievance.description}</p>
        </div>

        {grievance.attachments && grievance.attachments.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mt-6">Attachments</h2>
            <div className="flex flex-wrap gap-4 mt-2">
              {grievance.attachments.map((file, index) => (
                <div key={index} className="border rounded-md overflow-hidden">
                  {file.fileType.startsWith("image") ? (
                    <img src={file.url} alt="attachment" className="w-32 h-32 object-cover" />
                  ) : (
                    <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline p-2 block">View File</a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {grievance.comments && grievance.comments.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mt-6">Comments</h2>
            <ul className="space-y-2 mt-2">
              {grievance.comments.map((comment, index) => (
                <li key={index} className="border p-3 rounded-md bg-gray-50">
                  <p className="text-sm text-gray-700 italic">{comment.text}</p>
                  <p className="text-xs text-gray-500 text-right">- {comment.user?.firstName} {comment.user?.lastName} on {formatData(comment.createdAt)}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default GrievanceDetailsPage;
