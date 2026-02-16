import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./App.css";
import bgImage from "./assets/bg.jpeg";

axios.defaults.baseURL = "http://localhost:5000";

function Dashboard() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [search, setSearch] = useState("");

  const API = "/api/applications";

  /* ===========================
     FETCH APPLICATIONS
  =========================== */

  const fetchApplications = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const res = await axios.get(API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setApplications(res.data);
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
      }
    }
  }, [navigate]);

  /* ===========================
     AUTH CHECK + INITIAL LOAD
  =========================== */

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  /* ===========================
     ADD APPLICATION
  =========================== */

  const addApplication = async () => {
    if (!companyName || !role) {
      alert("Fill all fields");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      await axios.post(
        API,
        {
          companyName,
          role,
          status: "Applied",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCompanyName("");
      setRole("");
      fetchApplications();
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
      }
    }
  };

  /* ===========================
     UPDATE STATUS
  =========================== */

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `${API}/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchApplications();
    } catch (error) {
      console.log(error);
    }
  };

  /* ===========================
     DELETE APPLICATION
  =========================== */

  const deleteApplication = async (id) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`${API}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchApplications();
    } catch (error) {
      console.log(error);
    }
  };

  /* ===========================
     LOGOUT
  =========================== */

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  /* ===========================
     FILTER + STATS
  =========================== */

  const filteredApps = applications.filter((app) =>
    app.companyName?.toLowerCase().includes(search.toLowerCase())
  );

  const total = applications.length;
  const applied = applications.filter((a) => a.status === "Applied").length;
  const interview = applications.filter((a) => a.status === "Interview").length;
  const rejected = applications.filter((a) => a.status === "Rejected").length;
  const selected = applications.filter((a) => a.status === "Selected").length;

  return (
    <div>
      {/* HERO */}
      <div
        className="hero"
        style={{
          backgroundImage: `url(${bgImage})`,
          position: "relative",
        }}
      >
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>

        <div className="overlay">
          <h1>Job Application Tracker</h1>
          <p>Track your job applications smartly and stay ahead.</p>
        </div>
      </div>

      <div className="container">
        {/* STATS */}
        <div className="stats">
          <div className="stat-box">Total: {total}</div>
          <div className="stat-box">Applied: {applied}</div>
          <div className="stat-box">Interview: {interview}</div>
          <div className="stat-box">Rejected: {rejected}</div>
          <div className="stat-box">Selected: {selected}</div>
        </div>

        {/* SEARCH */}
        <input
          className="search"
          placeholder="Search company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* ADD FORM */}
        <div className="form">
          <input
            placeholder="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <input
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
          <button onClick={addApplication}>Add</button>
        </div>

        {/* LIST */}
        <div className="grid">
          {filteredApps.map((app) => (
            <div key={app._id} className="card">
              <h3>{app.companyName}</h3>
              <p>{app.role}</p>

              <select
                value={app.status}
                onChange={(e) =>
                  updateStatus(app._id, e.target.value)
                }
              >
                <option>Applied</option>
                <option>Interview</option>
                <option>Rejected</option>
                <option>Selected</option>
              </select>

              <button
                className="delete"
                onClick={() => deleteApplication(app._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;