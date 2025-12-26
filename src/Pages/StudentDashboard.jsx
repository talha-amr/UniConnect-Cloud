import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import { useLoading } from '../context/LoadingContext';
import Loader from '../components/Loader';
import SlideNavbar from '../components/SlideNavbar';
import StudentDashboard from '../components/StudentDashboard';

const StudentDashboardPage = () => {
    const { startLoading, stopLoading } = useLoading();
    const [complaints, setComplaints] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            startLoading();
            try {
                const [complaintsRes, userRes] = await Promise.all([
                    api.get('/complaints/my'),
                    api.get('/auth/me')
                ]);
                setComplaints(complaintsRes.data);
                setUser(userRes.data);
            } catch (error) {
                console.error('Failed to fetch data', error);
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        fetchData();
    }, []);

    return (
        <SlideNavbar>
            {loading ? <Loader /> : <StudentDashboard complaints={complaints} user={user} />}
        </SlideNavbar>
    );
};

export default StudentDashboardPage;
