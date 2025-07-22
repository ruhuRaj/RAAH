import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const useGrievances = (token, initialLimit = null) => {
    const [grievances, setGrievances] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({resolved: 0, pending: 0, rejected: 0, total: 0});

    const getGrievances = async (params = {}) => {
        setLoading(true);
        setError(null);
        try{
            // In a real hook, you'd call the service:
            // const data = await fetchGrievances(token, params);
            // For now, simulate data or rely on App.js's fetching
            const simulatedData = {
                grievances: [
                    // Dummy data for demonstration if backend is not running
                    { _id: 'g1', title: 'Pothole on Main Road', description: 'Large pothole causing issues.', category: 'Infrastructure', department: { name: 'Public Works' }, user: { firstName: 'Demo', lastName: 'Citizen' }, status: 'Submitted', location: { addressText: 'Main Street' }, attachments: [] },
                    { _id: 'g2', title: 'Streetlight out', description: 'Light not working near park.', category: 'Civic Amenities', department: { name: 'Electricity' }, user: { firstName: 'Demo', lastName: 'Citizen' }, status: 'In Progress', location: { addressText: 'City Park' }, attachments: [] },
                    { _id: 'g3', title: 'Garbage not collected', description: 'Bins overflowing for days.', category: 'Sanitation', department: { name: 'Sanitation' }, user: { firstName: 'Demo', lastName: 'Citizen' }, status: 'Resolved', location: { addressText: 'Market Area' }, attachments: [] },
                    { _id: 'g4', title: 'Noise Complaint', description: 'Loud music late at night.', category: 'Public Order', department: { name: 'Police' }, user: { firstName: 'Demo', lastName: 'Citizen' }, status: 'Rejected', location: { addressText: 'Residential Area' }, attachments: [] },
                    { _id: 'g5', title: 'Water Leakage', description: 'Pipe burst near school.', category: 'Civic Amenities', department: { name: 'Water Supply' }, user: { firstName: 'Demo', lastName: 'Citizen' }, status: 'Submitted', location: { addressText: 'Near School' }, attachments: [] },
                ],
                total: 5,
            };

            const data = simulatedData; // Replace with actual API call: await fetchGrievances(token, params);

            setGrievances(data.grievances);

            const resolved = data.grievances.filter(g => g.status === 'Resolved').length;
            const rejected = data.grievances.filter(g => g.status === 'Rejected').length;
            const pending = data.grievances.filter(g => !['Resolved', 'Rejected', 'Closed'].includes(g.status)).length;
            setStats({
                resolved,
                rejected,
                pending,
                total: data.total || data.grievances.length
            });
            toast.success("Grievances loaded successfully!"); 
        }
        catch(err){
            setError(err.message);
            toast.error("Failed to load grievances.");
        }
        finally{
            setLoading(false);
        }
    };

    useEffect(() => {
        // initial fetch based on token and initialLimit
        // this hook is currently not actively used by App.js for fetching
        // but the structure is here for future refactoring
        if(token){
            getGrievances({limit: initialLimit});
        }
        else{
            getGrievances({limit: initialLimit}); // fetch public data even without token
        }
    }, [token, initialLimit]); // re-fetch if token or limit changes

    return {grievances, loading, error, stats, getGrievances};
};

export default useGrievances;