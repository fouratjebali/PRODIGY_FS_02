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
  const [employeeId, setEmployeeId] = useState("");
  const [employee, setEmployee] = useState(null);
  const [searchCriteria, setSearchCriteria] = useState({
    employeeId: "",
    firstName: "",
    lastName: "",
  });
  const [searchResults, setSearchResults] = useState([]);
  const [viewEmployee, setViewEmp] = useState([]);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    birth_date: "",
    gender: "M",
    hire_date: "",
  });
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [managers, setViewManagers] = useState([]);
  const [isMessagesPopupVisible, setIsMessagesPopupVisible] = useState(false);
  const [isNotificationsPopupVisible, setIsNotificationsPopupVisible] = useState(false);
  const [isProfilePopupVisible, setIsProfilePopupVisible] = useState(false);

  const toggleMessagesPopup = () => {
    setIsMessagesPopupVisible((prev) => {
      if (!prev) {
        setIsNotificationsPopupVisible(false);
        setIsProfilePopupVisible(false);
      }
      return !prev;
    });
  };
  
  const toggleNotificationsPopup = () => {
    setIsNotificationsPopupVisible((prev) => {
      if (!prev) {
        setIsMessagesPopupVisible(false);
        setIsProfilePopupVisible(false);
      }
      return !prev;
    });
  };
  
  const toggleProfilePopup = () => {
    setIsProfilePopupVisible((prev) => {
      if (!prev) {
        setIsMessagesPopupVisible(false);
        setIsNotificationsPopupVisible(false);
      }
      return !prev;
    });
  };
  useEffect(() => {
    if (activeSection === "search") {
      setSearchCriteria({ employeeId: "", firstName: "", lastName: "" });
      setSearchResults([]);
    } else if (activeSection === "add") {
      setFormData({
        first_name: "",
        last_name: "",
        birth_date: "",
        gender: "M",
        hire_date: "",
      });
    } else if (activeSection === "update") {
      setEmployeeId("");
      setEmployee(null);
    } else if (activeSection === "delete") {
      setEmployeeId("");
      setEmployee(null);
    }
  }, [activeSection]);

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
    const fetchAllEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/employees", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        setViewEmp(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    }


    fetchAdminDetails();
    fetchStats();
    fetchAllEmployees();
  }, []);

  useEffect(() => {
    if (activeSection === "viewDept") {
      fetchDepartments();
    }
  }, [activeSection]);

  useEffect(() => {
    if (activeSection === "viewSalary") {
      fetchSalaries();
    }
  }, [activeSection]);

  useEffect(() => {
    if (activeSection === "viewManagers") {
      fetchManagers();
    }
  }, [activeSection]);

  const fetchManagers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/managers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setViewManagers(response.data.rows);

    } catch (error) {
      console.error("Error fetching managers:", error);
    }
  }

  const fetchSalaries = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/salary", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setSalaries(response.data.rows);
    } catch (error) {
      console.error("Error fetching salaries:", error);
    }
  }


  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/dept", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setDepartments(response.data.rows);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleSearchEmployeeById = async (e) => {
    setIsSearchClicked(true);
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:5000/api/employees/${employeeId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setEmployee(response.data);
    } catch (error) {
      console.error("Error fetching employee:", error);
    }
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/employees/${employeeId}`, employee, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      alert("Employee updated successfully!");
      setEmployee(null);
      setEmployeeId("");
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };
  const handleSearchEmployee = async (e) => {
    e.preventDefault();
    setIsSearchClicked(true);
    try {
      const response = await axios.post("http://localhost:5000/api/employees/search", searchCriteria, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error searching for employees:", error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/employees/create", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      alert("Employee added successfully!");
      setFormData({
        first_name: "",
        last_name: "",
        birth_date: "",
        gender: "f",
        hire_date: "",
      });
    } catch (error) {
      console.error("Error adding employee:", error);
      alert("Failed to add employee. Please try again.");
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this employee?");
      if (!confirmDelete) return;

      await axios.delete(`http://localhost:5000/api/employees/${employeeId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      alert("Employee deleted successfully!");
      setViewEmp((prevEmployees) => prevEmployees.filter((emp) => emp.emp_no !== employeeId));
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Failed to delete employee. Please try again.");
    }
  };

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
            <div className="relative">
              <i
                className="fas fa-envelope cursor-pointer"
                onClick={toggleMessagesPopup}
              ></i>
              {isMessagesPopupVisible && (
                <div className="absolute bg-white shadow-md rounded-md p-4 mt-2 right-0 w-64 h-48">
                  <p className="text-gray-500 text-sm">There are no messages yet.</p>
                </div>
              )}
            </div>
            <div className="relative">
              <i
                className="fas fa-bell cursor-pointer"
                onClick={toggleNotificationsPopup}
              ></i>
              {isNotificationsPopupVisible && (
                <div className="absolute bg-white shadow-md rounded-md p-4 mt-2 right-0 w-64 h-48">
                  <p className="text-gray-500 text-sm">No new notifications.</p>
                </div>
              )}
            </div>
            <div className="relative" >
              <div className="admin-profile cursor-pointer" onClick={toggleProfilePopup} >
                <img
                  src={adminDetails.profilePicture || "https://via.placeholder.com/40"} // Replace with the admin's profile picture URL
                  alt="Admin"
                />
                <span>{adminDetails.username || "Admin Name"}</span>
              </div>
              {isProfilePopupVisible && (
                <div className="absolute bg-white shadow-md rounded-md p-4 mt-2 right-0 w-64">
                  <p className="text-gray-500 text-sm mb-3 cursor-pointer hover:text-black">Profile</p>
                  <p className="text-gray-500 text-sm mb-3 cursor-pointer hover:text-black">Settings</p>
                  <p className="text-gray-500 text-sm mb-3 cursor-pointer hover:text-black" onClick={handleLogout}>Logout</p>
                </div>
              )}
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
                  <a
                    href="#"
                    className={`text-[#6D28D9] text-sm mt-4 block ${activeSection === "viewEmp" ? "active" : ""}`}
                    onClick={() => setActiveSection("viewEmp")}
                  >
                    View all
                  </a>
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
                  <a
                    className={`text-[#6D28D9] text-sm mt-4 block ${activeSection === "viewDept" ? "active" : ""}`}
                    onClick={() => setActiveSection("viewDept")}
                  >
                    View all
                  </a>
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
                  <a
                    href="#"
                    className={`text-[#6D28D9] text-sm mt-4 block ${activeSection === "viewSalary" ? "active" : ""}`}
                    onClick={() => setActiveSection("viewSalary")}
                  >
                    View all
                  </a>
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
                  <a
                    href="#"
                    className={`text-[#6D28D9] text-sm mt-4 block ${activeSection === "viewManagers" ? "active" : ""}`}
                    onClick={() => setActiveSection("viewManagers")}
                  >
                    View all
                  </a>
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
                  <a href="#" className="text-[#6D28D9] text-sm mt-4 block">View all</a>
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
                  <a href="#" className="text-[#6D28D9] text-sm mt-4 block">View all</a>
                </div>
              </div>
            </div>
          )}
          {activeSection === "viewEmp" && (
            <div className="view-employee-content mt-7 max-w-7xl mx-auto p-6 bg-white shadow-md rounded-lg">
              <h2 className="text-2xl font-bold mb-6 text-center">All Employees</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">First Name</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Last Name</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Birth Date</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Gender</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Hire Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewEmployee.map((employee) => (
                      <tr key={employee.emp_no} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">{employee.emp_no}</td>
                        <td className="border border-gray-300 px-4 py-2">{employee.first_name}</td>
                        <td className="border border-gray-300 px-4 py-2">{employee.last_name}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          {employee.birth_date ? employee.birth_date.split("T")[0] : ""}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">{employee.gender}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          {employee.hire_date ? employee.hire_date.split("T")[0] : ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeSection === "search" && (
            <div className="search-employee-content mt-7 max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
              <h2 className="text-2xl font-bold mb-6 text-center">Search Employee</h2>
              <form
                onSubmit={handleSearchEmployee}
                className="space-y-4"
              >
                {/* Employee ID */}
                <div>
                  <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">
                    Employee ID
                  </label>
                  <input
                    type="number"
                    id="employeeId"
                    name="employeeId"
                    value={searchCriteria.employeeId}
                    onChange={(e) => setSearchCriteria({ ...searchCriteria, employeeId: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter employee ID"
                  />
                </div>

                {/* First Name */}
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={searchCriteria.firstName}
                    onChange={(e) => setSearchCriteria({ ...searchCriteria, firstName: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter first name"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={searchCriteria.lastName}
                    onChange={(e) => setSearchCriteria({ ...searchCriteria, lastName: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter last name"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full bg-[#6D28D9] text-white py-2 px-4 rounded-md hover:bg-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Search Employee
                  </button>
                </div>
              </form>

              {searchResults && searchResults.length > 0 ? (
                <div className="mt-6">
                  <h3 className="text-lg font-bold mb-4">Search Results:</h3>
                  <ul className="space-y-2">
                    {searchResults.map((employee) => (
                      <li key={employee.emp_no} className="p-4 bg-gray-100 rounded-md shadow-sm">
                        <p><strong>ID:</strong> {employee.emp_no}</p>
                        <p><strong>Name:</strong> {employee.first_name} {employee.last_name}</p>
                        <p><strong>Birth Date:</strong> {employee.birth_date ? employee.birth_date.split("T")[0] : ""}</p>
                        <p><strong>Gender:</strong> {employee.gender}</p>
                        <p><strong>Hire Date:</strong> {employee.hire_date ? employee.hire_date.split("T")[0] : ""}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                isSearchClicked && (
                  <div className="mt-6 text-center text-red-600">
                    <p>No employee found with the given criteria.</p>
                  </div>
                )
              )}
            </div>
          )}
          {activeSection === "add" && (
            <div className="add-employee-content mt-7 max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-7">
              <h2 className="text-2xl font-bold mb-6 text-center">Add Employee
              </h2>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* First Name */}
                <div className="mt-10">
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="first_name"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} // Update formData
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10"
                    placeholder="Enter first name"
                  />
                </div>

                {/* Last Name */}
                <div className="mt-4">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="last_name"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} // Update formData
                    className="h-10 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter last name"
                  />
                </div>

                {/* Birth Date */}
                <div className="mt-4">
                  <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                    Birth Date
                  </label>
                  <input
                    type="date"
                    id="birthDate"
                    name="birth_date"
                    value={formData.birth_date}
                    onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })} // Update formData
                    className="mt-1 h-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                {/* Gender */}
                <div className="mt-4">
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })} // Update formData
                    className="mt-1 h-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </div>

                {/* Hire Date */}
                <div className="mt-4">
                  <label htmlFor="hireDate" className="block text-sm font-medium text-gray-700">
                    Hire Date
                  </label>
                  <input
                    type="date"
                    id="hireDate"
                    name="hire_date"
                    value={formData.hire_date}
                    onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })} // Update formData
                    className="mt-1 h-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-center mt-7">
                  <button
                    type="submit"
                    className="w-50 bg-[#6D28D9] text-white py-2 px-4 rounded-md hover:bg-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add Employee
                  </button>
                </div>
              </form>
            </div>
          )}
          {activeSection === "update" && (
            <div className="update-employee-content mt-10 max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
              <h2 className="text-2xl font-bold mb-6 text-center">Update Employee</h2>

              {/* Search Employee */}
              <form
                onSubmit={handleSearchEmployeeById}
                className="space-y-4 mb-6"
              >
                <div>
                  <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">
                    Employee ID
                  </label>
                  <input
                    type="number"
                    id="employeeId"
                    name="employeeId"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter employee ID"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full bg-[#6D28D9] text-white py-2 px-4 rounded-md hover:bg-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Search Employee
                  </button>
                </div>
              </form>
              {!employee && isSearchClicked && (
                <div className="mt-6 text-center text-red-600">
                  <p>No employee found with the given criteria.</p>
                </div>
              )}

              {/* Update Employee Form */}
              {employee && (
                <form
                  onSubmit={handleUpdateEmployee}
                  className="space-y-4"
                >
                  <div >
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={employee.first_name || ""}
                      onChange={(e) => setEmployee({ ...employee, first_name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={employee.last_name}
                      onChange={(e) => setEmployee({ ...employee, last_name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                      Birth Date
                    </label>
                    <input
                      type="date"
                      id="birthDate"
                      name="birthDate"
                      value={employee.birth_date ? employee.birth_date.split("T")[0] : ""} // Extract only the date part
                      onChange={(e) => setEmployee({ ...employee, birth_date: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={employee.gender}
                      onChange={(e) => setEmployee({ ...employee, gender: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="hireDate" className="block text-sm font-medium text-gray-700">
                      Hire Date
                    </label>
                    <input
                      type="date"
                      id="hireDate"
                      name="hireDate"
                      value={employee.hire_date ? employee.hire_date.split("T")[0] : ""} // Extract only the date part
                      onChange={(e) => setEmployee({ ...employee, hire_date: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full bg-[#6D28D9] text-white py-2 px-4 rounded-md hover:bg-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Update Employee
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {activeSection === "delete" && (
            <div className="delete-employee-content mt-10 max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
              <h2 className="text-2xl font-bold mb-6 text-center">Delete Employee</h2>
              <form
                onSubmit={handleSearchEmployeeById}
                className="space-y-4 mb-6"
              >
                <div>
                  <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">
                    Employee ID
                  </label>
                  <input
                    type="number"
                    id="employeeId"
                    name="employeeId"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter employee ID"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full bg-[#6D28D9] text-white py-2 px-4 rounded-md hover:bg-[#4C1D95] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Search Employee
                  </button>
                </div>
              </form>

              {employee && (
                <div className="bg-gray-100 p-4 rounded-md mt-4 shadow-md">
                  <h3 className="text-lg font-bold mb-4">Employee Details</h3>
                  <p><strong>ID:</strong> {employee.emp_no}</p>
                  <p><strong>First Name:</strong> {employee.first_name}</p>
                  <p><strong>Last Name:</strong> {employee.last_name}</p>
                  <p><strong>Birth Date:</strong> {employee.birth_date ? employee.birth_date.split("T")[0] : "N/A"}</p>
                  <p><strong>Gender:</strong> {employee.gender}</p>
                  <p><strong>Hire Date:</strong> {employee.hire_date ? employee.hire_date.split("T")[0] : "N/A"}</p>
                  <div className="mt-4">
                    <p className="text-red-800">Are you sure you want to delete this employee?</p>
                    <button
                      onClick={() => handleDeleteEmployee(employee.emp_no)}
                      className="mt-2 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                    >
                      Delete Employee
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          {activeSection === "viewDept" && (
            <div className="view-department-content mt-7 max-w-7xl mx-auto p-6 bg-white shadow-md rounded-lg">
              <h2 className="text-2xl font-bold mb-6 text-center">All Departments</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left">Department Number</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Department Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments.map((dept) => (
                      <tr key={dept.dept_no} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">{dept.dept_no}</td>
                        <td className="border border-gray-300 px-4 py-2">{dept.dept_name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeSection === "viewSalary" && (
            <div className="view-salary-content mt-7 max-w-7xl mx-auto p-6 bg-white shadow-md rounded-lg">
              <h2 className="text-2xl font-bold mb-6 text-center">All Salaries</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left">Employee ID</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Salary</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">From Date</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">To Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salaries.map((salary) => (
                      <tr key={salary.emp_no} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">{salary.emp_no}</td>
                        <td className="border border-gray-300 px-4 py-2">${salary.amount}</td>
                        <td className="border border-gray-300 px-4 py-2">{salary.from_date.split("T")[0]}</td>
                        <td className="border border-gray-300 px-4 py-2">{salary.to_date.split("T")[0]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeSection === "viewManagers" && (
            <div className="view-managers-content mt-7 max-w-7xl mx-auto p-6 bg-white shadow-md rounded-lg">
              <h2 className="text-2xl font-bold mb-6 text-center">All Managers</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left">Manager ID</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Department Number</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">From Date</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">To Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {managers.map((manager) => (
                      <tr key={manager.emp_no} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">{manager.emp_no}</td>
                        <td className="border border-gray-300 px-4 py-2">{manager.dept_no}</td>
                        <td className="border border-gray-300 px-4 py-2">{manager.from_date.split("T")[0]}</td>
                        <td className="border border-gray-300 px-4 py-2">{manager.to_date.split("T")[0]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;