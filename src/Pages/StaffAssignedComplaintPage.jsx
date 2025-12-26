import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useLoading } from '../context/LoadingContext';
import Loader from '../components/Loader';
import SlideNavbar from '../components/SlideNavbar';
import StaffAssignedComplaint from '../components/StaffAssignedComplaint';

const StaffAssignedComplaintPage = () => {
    const { startLoading, stopLoading } = useLoading();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchComplaints = async () => {
        startLoading();
        try {
            const res = await api.get('/complaints/assigned');
            setComplaints(res.data);
        } catch (error) {
            console.error("Failed to fetch assigned complaints", error);
        } finally {
            setLoading(false);
            stopLoading();
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    return (
        <SlideNavbar>
            {loading ? <Loader /> : <StaffAssignedComplaint complaints={complaints} loading={loading} onRefresh={fetchComplaints} />}
        </SlideNavbar>
    );
};

export default StaffAssignedComplaintPage;
