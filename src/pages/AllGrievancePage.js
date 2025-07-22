import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Loader2, Filter, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import GrievanceCard from '../components/GrievanceCard';
import { fetchGrievances } from '../services/grievanceService';

const AllGrievancesPage = () => {
    const { token } = useSelector((state) => state.auth);
    const [grievances, setGrievances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalGrievances, setTotalGrievances] = useState(0);
    const [filters, setFilters] = useState({ status: '', search: '' });
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

    const ITEMS_PER_PAGE = 10;

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Update filters when search term changes
    useEffect(() => {
        setFilters(prev => ({ ...prev, search: debouncedSearchTerm }));
        setCurrentPage(1); // Reset to first page when searching
    }, [debouncedSearchTerm]);

    const loadGrievances = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = {
                page: currentPage,
                limit: ITEMS_PER_PAGE,
                ...filters,
            };
            
            const response = await fetchGrievances(token, params); 
            
            if (response && response.grievances) {
                setGrievances(response.grievances);
                setTotalPages(response.pages || 1);
                setTotalGrievances(response.total || 0);
            } else {
                setGrievances([]);
                setTotalPages(1);
                setTotalGrievances(0);
                toast.error("No grievances found or unexpected response format.");
            }
        } catch (err) {
            console.error("Failed to fetch grievances:", err);
            setError(err.message || "Failed to load grievances.");
            toast.error(err.message || "Failed to load grievances.");
        } finally {
            setLoading(false);
        }
    }, [currentPage, filters, token]);

    useEffect(() => {
        loadGrievances();
    }, [loadGrievances]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
        setCurrentPage(1);
    };

    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">All Grievances</h1>

            <section className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Search Input */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Search grievances by title or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <select
                            id="statusFilter"
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                        >
                            <option value="">All Statuses</option>
                            <option value="Submitted">Submitted</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Assigned">Assigned</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Reopened">Reopened</option>
                        </select>
                    </div>
                </div>

                {/* Clear Filters Button */}
                {(searchTerm || filters.status) && (
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setFilters({ status: '', search: '' });
                            }}
                            className="text-sm text-gray-600 hover:text-gray-800 underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </section>

            <section>
                {loading && (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="animate-spin text-indigo-500" size={48} />
                        <p className="ml-3 text-lg text-gray-600">Loading grievances...</p>
                    </div>
                )}
                {error && (
                    <p className="text-center text-red-600 text-lg py-8 bg-white rounded-lg shadow-sm border border-gray-200">
                        Error: {error}
                    </p>
                )}
                {!loading && !error && grievances.length === 0 && (
                    <p className="text-center text-gray-600 text-lg py-8 bg-white rounded-lg shadow-sm border border-gray-200">
                        No grievances found matching your criteria.
                    </p>
                )}
                {!loading && !error && grievances.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch"> {/* Added items-stretch */}
                        {grievances.map((grievance) => (
                            <GrievanceCard key={grievance._id} grievance={grievance} />
                        ))}
                    </div>
                )}
            </section>

            {/* Pagination Controls */}
            {!loading && !error && totalPages > 1 && (
                <section className="flex justify-center items-center space-x-4 mt-10">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <span className="text-gray-700 font-medium">
                        Page {currentPage} of {totalPages} ({totalGrievances} total grievances)
                    </span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </section>
            )}
        </main>
    );
};

export default AllGrievancesPage;
