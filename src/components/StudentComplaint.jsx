import React, { useEffect, useState } from 'react';
import { Search, Plus, X, MoreHorizontal } from 'lucide-react';
import api from '../api/axios';
import Loader from './Loader';
import { useLoading } from '../context/LoadingContext';
import ComplaintModal from './ComplaintModal'; // 1. Import the modal

const StudentComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [filteredComplaints, setFilteredComplaints] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false); // Success modal state
    const { startLoading, stopLoading } = useLoading();
    const [loading, setLoading] = useState(true);


    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState(null);

    // Fetch complaints
    const fetchComplaints = async (isBackground = false) => {
        if (!isBackground) startLoading();
        try {
            const res = await api.get('/complaints/my');
            console.log("Fetched complaints count:", res.data.length);
            setComplaints(res.data);
            setFilteredComplaints(res.data);
        } catch (error) {
            console.error('Failed to fetch complaints', error);
        } finally {
            setLoading(false);
            if (!isBackground) stopLoading();
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    // Filter and Sort logic
    useEffect(() => {
        if (!complaints) return;

        const term = (searchTerm || '').toLowerCase();

        let results = complaints.filter(complaint => {
            const title = (complaint.Title || '').toLowerCase();
            const category = (complaint.category || '').toLowerCase();
            const status = (complaint.Status || '').toLowerCase();

            return title.includes(term) || category.includes(term) || status.includes(term);
        });

        // Sort: Resolved last, then new by date
        results.sort((a, b) => {
            if (a.Status === 'Resolved' && b.Status !== 'Resolved') return 1;
            if (a.Status !== 'Resolved' && b.Status === 'Resolved') return -1;
            return new Date(b.Created_at) - new Date(a.Created_at);
        });

        setFilteredComplaints(results);
    }, [searchTerm, complaints]);

    const handleLodgeComplaint = async (formData) => {
        console.log("START handling lodge complaint");
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log("Delay finished, posting data...");

            await api.post('/complaints', formData);
            console.log("Post successful, fetching complaints...");

            await fetchComplaints(true);
            console.log("Fetch complaints finished, closing modal...");

            setIsModalOpen(false);

            setTimeout(() => {
                console.log("Showing success modal NOW");
                setShowSuccessModal(true);
            }, 300);

        } catch (error) {
            console.error("Failed to submit complaint", error);
            alert("Failed to submit complaint. Server may be busy or input invalid.");
        }
    };

    const handleViewClick = (complaint) => {
        setSelectedComplaint(complaint);
        setShowViewModal(true);
    };

    const getCategoryName = (c) => {
        return c.Category?.CategoryName?.Category_name || c.category || c.Category_ID || 'Uncategorized';
    };

    const totalComplaints = complaints.length;

    // Helper to get serial number
    const getSerialNo = (id) => complaints.findIndex(c => c.Complaint_ID === id) + 1;

    return (
        <div className="min-h-screen bg-[#FFFDF7] p-8 font-sans text-gray-800">

            {/* 1. Top Header Section */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-medium text-gray-900">My Complaints</h1>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:shadow-md transition-shadow text-sm font-medium"
                >
                    <div className="border border-black rounded-full p-0.5">
                        <Plus size={14} className="text-black" />
                    </div>
                    Lodge a complaint
                </button>
            </div>

            {/* 2. Stats and Search Bar */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-4 gap-4">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">
                        Complaints ( {totalComplaints} )
                    </h2>
                    <p className="text-gray-400 text-xs mt-1">
                        View list of Complaints Below
                    </p>
                </div>

                {/* Search Input */}
                <div className="relative w-full md:w-80">
                    <input
                        type="text"
                        placeholder="Search by Title, Status etc."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-gray-200 pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:border-orange-300"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
            </div>

            {/* 3. Main Content Card */}
            <div className="bg-white rounded-xl shadow-sm min-h-[600px] flex flex-col">

                {/* Filter Section (Inside Card) - REMOVED DUMMY TAGS */}
                <div className="p-5 border-b border-gray-100 flex flex-wrap items-center gap-4 min-h-[60px]">
                    <span className="text-sm font-medium text-gray-700">All Complaints</span>
                    {/* You can add dynamic filter chips here later if needed */}
                </div>

                {/* Scrollable Table Container */}
                <div className="overflow-x-auto">
                    {/* Desktop View */}
                    <div className="min-w-[800px] hidden md:block">
                        {/* Table Header */}
                        <div className="grid grid-cols-6 gap-4 p-5 border-b border-gray-100 text-sm font-bold text-gray-900">
                            <div className="col-span-1">Complaint No.</div>
                            <div className="col-span-1">Date of Complaint</div>
                            <div className="col-span-1">Category</div>
                            <div className="col-span-1">Title</div>
                            <div className="col-span-1 text-center">Status</div>
                            <div className="col-span-1 text-right">Action</div>
                        </div>

                        {/* Table Body */}
                        <div className="flex-grow">
                            {loading ? (
                                <div className="flex justify-center items-center h-48">
                                    <Loader />
                                </div>
                            ) : filteredComplaints.length > 0 ? (
                                filteredComplaints.map((complaint) => {
                                    // Calculate global index to keep number stable during search
                                    const serialNo = getSerialNo(complaint.Complaint_ID);

                                    return (
                                        <div key={complaint.Complaint_ID} className="grid grid-cols-6 gap-4 p-5 border-b border-gray-100 text-sm items-center hover:bg-gray-50 transition-colors">
                                            <div className="col-span-1 text-gray-900 font-medium">#{serialNo}</div>
                                            <div className="col-span-1 text-gray-500">
                                                {complaint.Created_at ? new Date(complaint.Created_at).toLocaleDateString() : 'N/A'}
                                            </div>
                                            <div className="col-span-1 text-gray-500">{getCategoryName(complaint)}</div>
                                            <div
                                                className="col-span-1 text-gray-900 truncate font-medium cursor-pointer hover:text-blue-600 hover:underline"
                                                title="View Details"
                                                onClick={() => handleViewClick(complaint)}
                                            >
                                                {complaint.Title}
                                            </div>
                                            <div className="col-span-1 text-center">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${complaint.Status === 'Resolved' ? 'bg-green-100 text-green-700' :
                                                    complaint.Status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {complaint.Status}
                                                </span>
                                            </div>
                                            <div className="col-span-1 text-right">
                                                <button
                                                    onClick={() => handleViewClick(complaint)}
                                                    className="text-gray-400 hover:text-gray-600"
                                                >
                                                    <MoreHorizontal size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="p-8 text-center text-gray-500">No complaints found.</div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden flex flex-col gap-4 p-4">
                        {loading ? (
                            <div className="flex justify-center items-center h-48">
                                <Loader />
                            </div>
                        ) : filteredComplaints.length > 0 ? (
                            filteredComplaints.map((complaint) => {
                                const serialNo = getSerialNo(complaint.Complaint_ID);
                                return (
                                    <div key={complaint.Complaint_ID} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col gap-3">
                                        <div className="flex justify-between items-start">
                                            <span className="font-bold text-gray-900">#{serialNo}</span>
                                            <span className={`px-2 py-1 rounded text-xs ${complaint.Status === 'Resolved' ? 'bg-green-100 text-green-700' :
                                                complaint.Status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                {complaint.Status}
                                            </span>
                                        </div>

                                        <div onClick={() => handleViewClick(complaint)} className="cursor-pointer">
                                            <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-blue-600">{complaint.Title}</h3>
                                            <p className="text-xs text-gray-500 mt-1">
                                                <span className="font-medium">Category:</span> {getCategoryName(complaint)}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                <span className="font-medium">Date:</span> {complaint.Created_at ? new Date(complaint.Created_at).toLocaleDateString() : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="p-8 text-center text-gray-500">No complaints found.</div>
                        )}
                    </div>
                </div>

                {/* Pagination Dot */}
                <div className="p-6 flex justify-center">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                </div>

            </div>

            {/* 4. Render the Lodge Complaint Modal */}
            <ComplaintModal
                key={isModalOpen ? 'modal-open' : 'modal-closed'}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleLodgeComplaint}
            />

            {/* 5. Render View Details Modal */}
            {showViewModal && selectedComplaint && (
                <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                            <div className='flex flex-col'>
                                <h3 className="text-xl font-bold text-gray-800">Complaint Details</h3>
                                <span className='text-sm text-gray-400 font-medium'>#{getSerialNo(selectedComplaint.Complaint_ID)}</span>
                            </div>

                            <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900">{selectedComplaint.Title}</h4>
                                <p className="text-sm text-gray-500 mt-1">
                                    Logged on {selectedComplaint.Created_at ? new Date(selectedComplaint.Created_at).toLocaleString() : 'N/A'}
                                </p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                                <p className="text-gray-700 whitespace-pre-wrap">{selectedComplaint.Description || 'No description provided.'}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="block text-gray-500">Category</span>
                                    <span className="font-medium text-gray-900">{getCategoryName(selectedComplaint)}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-500">Status</span>
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${selectedComplaint.Status === 'Resolved' ? 'bg-green-100 text-green-700' :
                                        selectedComplaint.Status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                        {selectedComplaint.Status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-2 border-t border-gray-100">
                            <button
                                onClick={() => setShowViewModal(false)}
                                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Success Modal */}
            {/* Success Modal */}
            {
                showSuccessModal && (
                    <div className="fixed inset-0 flex items-center justify-center z-[100] bg-black/50 backdrop-blur-sm">
                        <div className="bg-white p-6 rounded-2xl shadow-xl w-80 text-center transform transition-all scale-100 animate-in fade-in zoom-in duration-200">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Submitted!</h3>
                            <p className="text-gray-600 mb-6">Your complaint has been lodged successfully.</p>
                            <button
                                onClick={() => setShowSuccessModal(false)}
                                className="w-full bg-green-600 text-white py-2 px-4 rounded-xl font-semibold hover:bg-green-700 transition duration-200"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                )
            }
        </div >
    );

};

export default StudentComplaints;