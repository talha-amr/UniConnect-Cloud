import React, { useEffect, useState } from "react";
import { Scatter, Doughnut, Pie, Bar } from "react-chartjs-2";
import api from "../api/axios"; // Import our configured axios client
import { useLoading } from '../context/LoadingContext';
import Loader from './Loader';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const AdminDash = () => {
  // State for live data
  // State for live data - initialized with dummy data to preserve layout
  /* Refactored AdminDash with correct data mapping */
  const { startLoading, stopLoading } = useLoading();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    statusCounts: [0, 0, 0],
    categoryCounts: [],
    categoryLabels: []
  });

  useEffect(() => {
    const fetchData = async () => {
      startLoading();
      try {
        const res = await api.get('/complaints');
        const complaints = res.data;

        // Process Stats
        const total = complaints.length;

        // Status: Resolved, Pending (Unsolved), In Progress
        // Note: Field is 'Status' (PascalCase) from API
        const solved = complaints.filter(c => c.Status === 'Resolved' || c.status === 'Resolved').length;
        const unsolved = complaints.filter(c => c.Status === 'Pending' || c.status === 'Pending').length;
        // Assume anything else is In Progress
        const inProgress = complaints.filter(c => c.Status !== 'Resolved' && c.Status !== 'Pending').length;

        // Dynamic Category Processing
        const catMap = {};
        complaints.forEach(c => {
          // Extract category name safe navigation
          const name = c.Category?.CategoryName?.Category_name || 'Unassigned';
          catMap[name] = (catMap[name] || 0) + 1;
        });

        const catLabels = Object.keys(catMap);
        const catValues = Object.values(catMap);

        setStats({
          total,
          statusCounts: [solved, unsolved, inProgress],
          categoryCounts: catValues,
          categoryLabels: catLabels
        });

      } catch (error) {
        console.error("Error fetching admin data", error);
      } finally {
        setLoading(false);
        stopLoading();
      }
    };

    fetchData();
  }, []);

  // Scatter Chart Data (Total Complaints over months)
  const scatterData = {
    datasets: [
      {
        label: "Total Complaints",
        data: [
          { x: 1, y: 12 },
          { x: 2, y: 19 },
          { x: 3, y: 3 },
          { x: 4, y: 5 },
          { x: 5, y: 2 },
          { x: 6, y: 3 },
        ],
        backgroundColor: "#4A90E2",
        pointRadius: 6,
      },
    ],
  };

  const scatterOptions = {
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Week'
        }
      },
      y: {
        display: true,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Complaints'
        }
      }
    },
    maintainAspectRatio: false
  };

  // Doughnut Chart (Status)
  const doughnutData = {
    labels: ["Solved", "Unsolved", "In Progress"],
    datasets: [
      {
        data: stats.statusCounts,
        backgroundColor: ["#2C3E89", "#9B59B6", "#E91E63"],
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions = {
    cutout: "70%",
    plugins: {
      legend: {
        display: true,
        position: "right",
        labels: { usePointStyle: true, padding: 15 },
      },
    },
    maintainAspectRatio: false,
  };

  // Pie Chart (Department)
  const pieData = {
    labels: stats.categoryLabels.length > 0 ? stats.categoryLabels : ["No Data"],
    datasets: [
      {
        data: stats.categoryCounts.length > 0 ? stats.categoryCounts : [1], // Fallback to show empty circle
        backgroundColor: ["#00CED1", "#E91E63", "#00FF7F", "#9B59B6", "#FFD700", "#FF4500"], // Added more colors
        borderWidth: 0,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        display: true,
        position: "right",
        labels: { usePointStyle: true, padding: 10 },
      },
    },
    maintainAspectRatio: false,
  };

  // Bar Chart (Category)
  const barData = {
    labels: stats.categoryLabels,
    datasets: [
      {
        label: "Complaints",
        data: stats.categoryCounts,
        backgroundColor: "#2C3E89",
      },
    ],
  };

  const barOptions = {
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "#f0f0f0" },
        ticks: { stepSize: 1 }
      },
      x: {
        grid: { display: false },
      },
    },
    plugins: {
      legend: { display: false },
    },
    maintainAspectRatio: false,
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}


      {/* Main Content */}
      <main className="my-container mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold mb-8">Dashboard</h2>

        {/* Top Row - Two Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Total Complaints Scatter Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-500 text-sm uppercase mb-2">Total Complaints</p>
                <h3 className="text-4xl font-bold">{stats.total}</h3>
                <p className="text-gray-400 text-sm mt-1">Total Complaints Registered</p>
              </div>
              <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-white text-xs">
                i
              </div>
            </div>
            <div className="h-64">
              <Scatter data={scatterData} options={scatterOptions} />
            </div>
          </div>

          {/* Status Doughnut Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-500 text-sm uppercase mb-2">Total Complaints</p>
                <p className="text-gray-400 text-sm">Solved and Unsolved Complaints</p>
              </div>
              <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-white text-xs">
                i
              </div>
            </div>
            <div className="h-64 flex items-center justify-center">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </div>
        </div>

        {/* Bottom Row - Two Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Pie Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-500 text-sm uppercase mb-2">Complaints by Department</p>
                <p className="text-gray-400 text-sm">Showing data of week</p>
              </div>
              <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-white text-xs">
                i
              </div>
            </div>
            <div className="h-64 flex items-center justify-center">
              <Pie data={pieData} options={pieOptions} />
            </div>
          </div>

          {/* Category Bar Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-500 text-sm uppercase mb-2">Complaint by Category</p>
                <p className="text-gray-400 text-sm">Source of Complaint</p>
              </div>
              <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-white text-xs">
                i
              </div>
            </div>
            <div className="h-64">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDash;