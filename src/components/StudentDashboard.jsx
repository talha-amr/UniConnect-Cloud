import React, { useState } from 'react';
import { FolderPlus, FilePlus, FileText, Folder } from 'lucide-react';
import ComplaintModal from './ComplaintModal';
import api from '../api/axios';

const DashboardHome = ({ user, complaints = [], ...props }) => {
    // 2. State to manage modal visibility
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false); // Success modal state

    // Calculate stats
    const totalComplaints = complaints.length;
    // Normalizing status checks
    const solvedCount = complaints.filter(c => c.Status === 'Resolved' || c.Status === 'Solved').length;
    const pendingCount = complaints.filter(c => c.Status === 'Pending').length;

    // 3. Handle data coming back from the modal
    const handleComplaintSubmit = async (formData) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            await api.post('/complaints', formData);

            // Trigger parent refresh if available
            if (props.onRefresh) {
                await props.onRefresh();
            }

            setIsModalOpen(false);

            setTimeout(() => {
                setShowSuccessModal(true);
            }, 300);

        } catch (error) {
            console.error("Failed to submit complaint", error);
            alert("Failed to submit complaint. please try again.");
        }
    };

    return (
        <div className="bg-[#FFFDF7] min-h-screen p-8 font-sans text-gray-800">

            {/* Welcome Header */}
            <div className="mb-12 mt-4 text-center">
                <h1 className="text-3xl md:text-4xl font-normal text-gray-900 tracking-wide uppercase">
                    Welcome {user ? user.Name : 'Student'}
                </h1>
            </div>

            <div className="max-w-5xl mx-auto space-y-8">

                {/* "Lodge a Complaint" Action Card */}
                <button
                    onClick={() => setIsModalOpen(true)} // 4. Open modal on click
                    className="w-full bg-white border-2 border-orange-300 rounded-lg h-48 flex flex-col items-center justify-center hover:shadow-lg transition-shadow cursor-pointer group"
                >
                    <span className="text-orange-400 text-lg font-medium mb-3 group-hover:text-orange-500 transition-colors">
                        Lodge a Complaint
                    </span>
                    <FolderPlus
                        size={32}
                        className="text-orange-400 group-hover:scale-110 transition-transform duration-200"
                        strokeWidth={1.5}
                    />
                </button>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Stat Item 1: Complaints Solved */}
                    <StatItem
                        label="Complaints Solved"
                        count={solvedCount}
                        description="Total Number of Complaints Solved this Semester."
                        icon={<Folder size={28} className="text-orange-400 fill-orange-50" />}
                    />

                    {/* Stat Item 2: Total Complaints */}
                    <StatItem
                        label="Total Complaints"
                        count={totalComplaints}
                        description="Total number of complaints Lodged this semester."
                        icon={<FilePlus size={28} className="text-orange-400" />}
                    />

                    {/* Stat Item 3: Pending Complaints */}
                    <StatItem
                        label="Pending Complaints"
                        count={pendingCount}
                        description="Total number of complaints Lodged this semester."
                        icon={<FileText size={28} className="text-orange-400" />}
                    />

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
                </div>
            </div>

            {/* 5. Render the Modal */}
            <ComplaintModal
                key={isModalOpen ? 'home-modal-open' : 'home-modal-closed'}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleComplaintSubmit}
            />
        </div>
    );
};

/* --- Reusable Stat Component --- */
const StatItem = ({ label, count, description, icon }) => {
    return (
        <div className="w-full bg-white rounded-lg p-8 border border-gray-100 shadow-sm flex flex-col items-start space-y-4">
            <h3 className="text-gray-400 text-lg font-normal">{label}</h3>

            <div className="text-6xl font-bold text-gray-900 leading-none tracking-tight">
                {count}
            </div>

            <p className="text-xs text-gray-400 max-w-xs">
                {description}
            </p>

            <div className="pt-2">
                {icon}
            </div>
        </div>
    );
};

export default DashboardHome;