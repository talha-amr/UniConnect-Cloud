import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import SlideNavbar from '../components/SlideNavbar';
import StaffDashboardComp from '../components/StaffDashboardComp';
import { useLoading } from '../context/LoadingContext';
import Loader from '../components/Loader';

const StaffDashboard = () => {
    const { startLoading, stopLoading } = useLoading();
    const [assignedComplaints, setAssignedComplaints] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            startLoading();
            try {
                const [complaintsRes, userRes] = await Promise.all([
                    api.get('/complaints/assigned'),
                    api.get('/auth/me')
                ]);
                setAssignedComplaints(complaintsRes.data);
                setUser(userRes.data);
            } catch (error) {
                console.error('Failed to fetch staff data', error);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        fetchData();
    }, []);

    return (
        <SlideNavbar>
            {loading ? <Loader /> : <StaffDashboardComp user={user} complaints={assignedComplaints} />}
        </SlideNavbar>
    );
};

export default StaffDashboard;
