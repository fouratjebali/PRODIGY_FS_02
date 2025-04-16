import React, { useState, useEffect } from "react";
import "./dashboard.css";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    totalSalaries: 0,
    totalManagers: 0,
  });
  const [adminDetails, setAdminDetails] = useState({ username: "", profilePicture: "" });
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const id = localStorage.getItem("id");
        if (!id) {
          console.error("Admin ID not found");
          return;
        }
        const response = await fetch(`http://localhost:5000/api/admin/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setAdminDetails(data);
        } else {
          console.error("Failed to fetch admin details");
        }
      } catch (error) {
        console.error("Error fetching admin details:", error);
      }
    };
    const fetchStats = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/stats", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchAdminDetails();
    fetchStats();
  }, []);

  return (
    <div className="dashboard font-">
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li
            className={activeSection === "dashboard" ? "active" : ""}
            onClick={() => setActiveSection("dashboard")}
          >
            <i className="fas fa-th-large"></i> Dashboard
          </li>
          <li
            className={activeSection === "search" ? "active" : ""}
            onClick={() => setActiveSection("search")}
          >
            <i className="fas fa-user"></i> Search Employee
          </li>
          <li
            className={activeSection === "add" ? "active" : ""}
            onClick={() => setActiveSection("add")}
          >
            <i className="fas fa-plus"></i> Add Employee
          </li>
          <li
            className={activeSection === "update" ? "active" : ""}
            onClick={() => setActiveSection("update")}
          >
            <i className="fas fa-edit"></i> Update Employee
          </li>
          <li
            className={activeSection === "delete" ? "active" : ""}
            onClick={() => setActiveSection("delete")}
          >
            <i className="fas fa-user"></i> Delete Employee
          </li>
          <li
            className={activeSection === "notifications" ? "active" : ""}
            onClick={() => setActiveSection("notifications")}
          >
            <i className="fas fa-bell"></i> Notifications
          </li>
        </ul>
        <footer className="sidebar-footer">
          <button onClick={handleLogout}>Logout</button>
        </footer>
      </aside>
      <main className="main-content">
        <div className="top-bar">
          <div className="search-bar">
            <input type="text" placeholder="Search for..." />
            <button>
              <i className="fas fa-search"></i>
            </button>
          </div>
          <div className="top-bar-icons">
            <i className="fas fa-envelope"></i>
            <i className="fas fa-bell"></i>
            <div className="admin-profile">
              <img
                src={adminDetails.profilePicture || "https://via.placeholder.com/40"} // Replace with the admin's profile picture URL
                alt="Admin"
              />
              <span>{adminDetails.username || "Admin Name"}</span>
            </div>
          </div>
        </div>
        <section className="content">
          {activeSection === "dashboard" && (
            <div className="dashboard-content max-w-7xl mx-auto p-6">
              {/* First Row of Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Card 1 */}
                <div className="bg-white shadow-md rounded-lg p-6 w-full">
                  <div className="flex items-center">
                    <div className="bg-blue-100 text-blue-500 p-3 rounded-full">
                      <i className="fas fa-users"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold">Total Employees</h3>
                      <p className="text-2xl font-bold">{stats.totalEmployees}</p>
                    </div>
                  </div>
                  <a href="#" className="text-blue-500 text-sm mt-4 block">View all</a>
                </div>

                {/* Card 2 */}
                <div className="bg-white shadow-md rounded-lg p-6 w-full">
                  <div className="flex items-center">
                    <div className="bg-green-100 text-green-500 p-3 rounded-full">
                      <i className="fas fa-tasks"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold">Total Departments</h3>
                      <p className="text-2xl font-bold">{stats.totalDepartments}</p>
                    </div>
                  </div>
                  <a href="#" className="text-blue-500 text-sm mt-4 block">View all</a>
                </div>

                {/* Card 3 */}
                <div className="bg-white shadow-md rounded-lg p-6 w-full">
                  <div className="flex items-center">
                    <div className="bg-purple-100 text-purple-500 p-3 rounded-full">
                      <i className="fas fa-dollar-sign"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold">Total Salaries</h3>
                      <p className="text-2xl font-bold">${stats.totalSalaries}</p>
                    </div>
                  </div>
                  <a href="#" className="text-blue-500 text-sm mt-4 block">View all</a>
                </div>
              </div>

              {/* Second Row of Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                
                <div className="bg-white shadow-md rounded-lg p-6 w-full">
                  <div className="flex items-center">
                    <div className="bg-yellow-100 text-yellow-500 p-3 rounded-full">
                      <i className="fas fa-chart-line"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold">Total Managers</h3>
                      <p className="text-2xl font-bold">{stats.totalManagers}</p>
                    </div>
                  </div>
                  <a href="#" className="text-blue-500 text-sm mt-4 block">View all</a>
                </div>

                <div className="bg-white shadow-md rounded-lg p-6 w-full">
                  <div className="flex items-center">
                    <div className="bg-red-100 text-red-500 p-3 rounded-full">
                      <i className="fas fa-exclamation-circle"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold">Pending Tasks</h3>
                      <p className="text-2xl font-bold">12</p>
                    </div>
                  </div>
                  <a href="#" className="text-blue-500 text-sm mt-4 block">View all</a>
                </div>

                <div className="bg-white shadow-md rounded-lg p-6 w-full">
                  <div className="flex items-center">
                    <div className="bg-teal-100 text-teal-500 p-3 rounded-full">
                      <i className="fas fa-user-check"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold">New Hires</h3>
                      <p className="text-2xl font-bold">5</p>
                    </div>
                  </div>
                  <a href="#" className="text-blue-500 text-sm mt-4 block">View all</a>
                </div>
              </div>
            </div>
          )}
          {activeSection === "search" && (
            <div className="search-employee-content">
              <h2>Search Employee</h2>
              <p>Search for an employee.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;