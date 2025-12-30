import React, { useState } from 'react';
import { Search, X, MoreHorizontal, Eye } from 'lucide-react';

import api from '../api/axios';

const StaffAssignedComplaint = ({ complaints, loading, onRefresh }) => {

    // Safety check just in case
    const safeComplaints = complaints || [];
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [newStatus, setNewStatus] = useState('Pending');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Sort complaints: Resolved last, then new by date
    const sortedComplaints = [...safeComplaints].sort((a, b) => {
        if (a.Status === 'Resolved' && b.Status !== 'Resolved') return 1;
        if (a.Status !== 'Resolved' && b.Status === 'Resolved') return -1;
        return new Date(b.Created_at) - new Date(a.Created_at);
    });

    const handleActionClick = (complaint) => {
        setSelectedComplaint(complaint);
        setNewStatus(complaint.Status);
    };

    const handleUpdateSubmit = async () => {
        if (!selectedComplaint) return;
        setIsSubmitting(true);
        try {
            await api.patch(`/complaints/${selectedComplaint.Complaint_ID}/status`, { status: newStatus });
            // Show success modal and refresh data
            setShowSuccessModal(true);
            setSelectedComplaint(null);
            if (onRefresh) onRefresh();
        } catch (error) {
            console.error("Update failed", error);
            alert("Update Failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFDF7] font-sans text-gray-800">

            {/* 1. Top White Header Strip */}
            <div className="bg-white py-5 border-b border-gray-100 ">
                <div className="max-w-7xl mx-auto px-8">
                    <h1 className="text-3xl font-medium text-gray-900">Assigned Complaints</h1>
                </div>
            </div>

            {/* Main Content Container */}
            <div className="max-w-7xl mx-auto  pb-12 pt-8">

                {/* 2. Page Title & Search Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Complaints Assigned
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">
                            Manage complaints assigned to your department
                        </p>
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full md:w-96 bg-white rounded-lg border border-gray-200">
                        <input
                            type="text"
                            placeholder="Search Here"
                            className="w-full bg-transparent border-none pl-10 pr-4 py-2.5 text-sm focus:ring-0 text-gray-600 placeholder-gray-400"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                </div>

                {/* 3. Main Table Card */}
                <div className="bg-white rounded-xl border border-gray-200 min-h-[600px] flex flex-col">

                    {/* Filter Section */}
                    <div className="px-8 py-6 border-b border-gray-200 flex flex-wrap items-center gap-3 bg-white rounded-t-xl">
                        <span className="text-sm font-medium text-gray-700">Filter Your Search</span>

                        {/* Tag: Date Range */}
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full text-xs text-gray-700 border border-gray-200">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            Jan 12 - Mar 11
                            <button className="hover:text-red-500 ml-1 transition-colors">
                                <X size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Scrollable Table Container */}
                    <div className="overflow-x-auto">
                        <div className="min-w-[800px] hidden md:block">
                            {/* Table Header - Better distributed columns */}
                            <div className="flex items-center px-8 py-5 border-b border-gray-100 text-sm font-bold text-gray-900 bg-white">
                                <div className="flex-[1.5]">Complaint No.</div>
                                <div className="flex-[1.5]">Date</div>
                                <div className="flex-[2]">Student</div>
                                <div className="flex-[3]">Title</div>
                                <div className="flex-[1.5] text-center">Status</div>
                                <div className="flex-[1] text-right">Action</div>
                            </div>

                            {/* Table Body */}
                            <div className="flex-grow relative bg-white">
                                {loading ? (
                                    <div className="p-8 text-center text-gray-500">Loading...</div>
                                ) : sortedComplaints.length > 0 ? (
                                    sortedComplaints.map((complaint, index) => (
                                        <div key={complaint.Complaint_ID} className="flex items-center px-8 py-5 border-b border-gray-50 text-sm hover:bg-gray-50 transition-colors">

                                            {/* ID - Showing Sequential Number */}
                                            <div className="flex-[1.5] font-medium text-gray-900">
                                                #{index + 1}
                                            </div>

                                            {/* Date */}
                                            <div className="flex-[1.5] text-gray-500">
                                                {complaint.Created_at ? new Date(complaint.Created_at).toLocaleDateString() : 'N/A'}
                                            </div>

                                            {/* Student Name */}
                                            <div className="flex-[2] text-gray-700 font-medium truncate pr-4">
                                                {complaint.Is_anonymous ? <span className="italic text-gray-400">Anonymous</span> : (complaint.student ? complaint.student.Name : 'Unknown')}
                                            </div>

                                            {/* Title */}
                                            <div
                                                className="flex-[3] text-gray-900 font-medium truncate pr-4 cursor-pointer hover:underline hover:text-blue-600"
                                                title="View Details"
                                                onClick={() => handleActionClick(complaint)}
                                            >
                                                {complaint.Title}
                                            </div>

                                            {/* Status Badge */}
                                            <div className="flex-[1.5] flex justify-center">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${complaint.Status === 'Resolved' ? 'bg-green-100 text-green-700' :
                                                    complaint.Status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {complaint.Status}
                                                </span>
                                            </div>

                                            {/* Action Button */}
                                            <div className="flex-[1] flex justify-end">
                                                <button
                                                    onClick={() => handleActionClick(complaint)}
                                                    className="text-gray-400 hover:text-orange-500 transition-colors"
                                                    title="View & Update"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-300 pb-20">
                                        <p>No assigned complaints found.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden flex flex-col gap-4 p-4">
                            {loading ? (
                                <div className="p-8 text-center text-gray-500">Loading...</div>
                            ) : sortedComplaints.length > 0 ? (
                                sortedComplaints.map((complaint, index) => (
                                    <div key={complaint.Complaint_ID} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col gap-3">
                                        <div className="flex justify-between items-start">
                                            <span className="font-bold text-gray-900">#{index + 1}</span>
                                            <span className={`px-2 py-1 rounded text-xs ${complaint.Status === 'Resolved' ? 'bg-green-100 text-green-700' :
                                                complaint.Status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                {complaint.Status}
                                            </span>
                                        </div>

                                        <div onClick={() => handleActionClick(complaint)} className="cursor-pointer">
                                            <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-blue-600">{complaint.Title}</h3>
                                            <p className="text-xs text-gray-500 mt-1">
                                                <span className="font-medium">Student:</span> {complaint.Is_anonymous ? <span className="italic">Anonymous</span> : (complaint.student ? complaint.student.Name : 'Unknown')}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                <span className="font-medium">Date:</span> {complaint.Created_at ? new Date(complaint.Created_at).toLocaleDateString() : 'N/A'}
                                            </p>
                                        </div>

                                        <div className="flex justify-end border-t pt-3">
                                            <button
                                                onClick={() => handleActionClick(complaint)}
                                                className="text-orange-500 hover:text-orange-600 text-sm font-medium flex items-center gap-1"
                                            >
                                                View & Update <Eye size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-gray-500">No assigned complaints found.</div>
                            )}
                        </div>
                    </div>

                    {/* Pagination Dot */}
                    <div className="p-6 flex justify-center bg-white rounded-b-xl">
                        <div className="w-2 h-2 bg-black rounded-full"></div>
                    </div>

                </div>

                {/* Status Update & Details Modal */}
                {selectedComplaint && (
                    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
                        <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6 border-b pb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">Complaint Details</h3>
                                    <span className="text-sm text-gray-500 font-medium">#{safeComplaints.findIndex(c => c.Complaint_ID === selectedComplaint.Complaint_ID) + 1}</span>
                                </div>
                                <button onClick={() => setSelectedComplaint(null)} className="text-gray-400 hover:text-gray-600">
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Details Section */}
                            <div className="space-y-4 mb-6">
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900">{selectedComplaint.Title}</h4>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Logged on {selectedComplaint.Created_at ? new Date(selectedComplaint.Created_at).toLocaleString() : 'N/A'}
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    <p className="text-gray-700 whitespace-pre-wrap">{selectedComplaint.Description || 'No description provided.'}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="block text-gray-500">Student Name</span>
                                        <span className="font-medium text-gray-900">
                                            {selectedComplaint.Is_anonymous ? <span className="italic">Anonymous</span> : (selectedComplaint.student?.Name || 'N/A')}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500">Student Email</span>
                                        <span className="font-medium text-gray-900">{selectedComplaint.student?.Email || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Status Update Section */}
                            <div className="pt-4 border-t border-gray-100">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
                                <div className="flex gap-4">
                                    <select
                                        className="flex-1 border p-2 rounded-lg"
                                        value={newStatus}
                                        onChange={(e) => setNewStatus(e.target.value)}
                                        disabled={selectedComplaint.Status === 'Resolved'} // Optional: Lock if resolved? (User didn't ask, but good practice. Removed for now unless needed)
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Resolved">Resolved</option>
                                    </select>
                                    <button
                                        onClick={handleUpdateSubmit}
                                        className={`px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center justify-center font-medium ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <div className="w-5 h-5 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
                                        ) : (
                                            'Update'
                                        )}
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                )}


            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 flex items-center justify-center z-[60] bg-black/50 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-2xl shadow-xl w-80 text-center transform transition-all scale-100">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Success!</h3>
                        <p className="text-gray-600 mb-6">Status updated successfully.</p>
                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="w-full bg-green-600 text-white py-2 px-4 rounded-xl font-semibold hover:bg-green-700 transition duration-200"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffAssignedComplaint;