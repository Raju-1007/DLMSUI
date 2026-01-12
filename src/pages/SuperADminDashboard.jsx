import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import axios from "axios";

import { useMessage } from "../context/MessageContext"; 
import LoginActivity from "../components/LoginActivity";

export default function SuperAdminDashboard() {

  const { showSuccess, showError } = useMessage();
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    loadSummary();
 

  }, []);
  LoginActivity();

  // ==========================================
  //  HARD CODED FALLBACK DATA
  // ==========================================
  const fallback = {
    states: 1,
    districts: 13,
    talukas: 125,
    villages: 423,
    schools: 1257,
    teachers: 8760,
    students: 34527,

    growth: {
      students: 70,
      teachers: 45,
      schools: 56,
    },

    progress: {
      activeStudents: 88,
      passedOut: 42,
    },

    notifications: [
      {
        title: "Server Maintenance",
        message: "Scheduled downtime on 20th Sep 2 AM – 4 AM.",
      },
      {
        title: "New School Added",
        message: "A new school registered in XYZ district.",
      },
    ],

    teachersTable: [
      {
        name: "Ruturaj",
        id: 4287098,
        department: "Skill Development",
        completed: 67,
        rating: 5,
        status: "Completed",
      },
      {
        name: "Dhawan",
        id: 5934670,
        department: "Data Entry",
        completed: 35,
        rating: 4,
        status: "Upcoming",
      },
    ],
  };

  // ==========================================
  //  API CALL + FALLBACK HANDLING
  // ==========================================
  const loadSummary = async () => {
    try {
      const res = await axios.get("/super-admin/dashboard-summary");

      console.log("API Response:", res?.data);

      if (!res || !res.data) {
        console.warn("API empty → using fallback");
        setSummary(fallback);
        return;
      }

      const data = res.data;

      const finalData = {
        states: data.states ?? fallback.states,
        districts: data.districts ?? fallback.districts,
        talukas: data.talukas ?? fallback.talukas,
        villages: data.villages ?? fallback.villages,
        schools: data.schools ?? fallback.schools,
        teachers: data.teachers ?? fallback.teachers,
        students: data.students ?? fallback.students,

        growth: {
          students: data?.growth?.students ?? fallback.growth.students,
          teachers: data?.growth?.teachers ?? fallback.growth.teachers,
          schools: data?.growth?.schools ?? fallback.growth.schools,
        },

        progress: {
          activeStudents:
            data?.progress?.activeStudents ??
            fallback.progress.activeStudents,
          passedOut:
            data?.progress?.passedOut ?? fallback.progress.passedOut,
        },

        notifications:
          data.notifications?.length > 0
            ? data.notifications
            : fallback.notifications,

        teachersTable:
          data.teachersTable?.length > 0
            ? data.teachersTable
            : fallback.teachersTable,
      };

      setSummary(finalData);
    } catch(err) {
       showError("API failed → using fallback:", err);
      setSummary(fallback);
    }
  };

  if (!summary) return <div>Loading dashboard…</div>;

  // ==========================================
  //  RETURN UI
  // ==========================================
  return (
    <div>
      <Navbar />

      <div style={{ display: "grid", gridTemplateColumns: "250px 1fr" }}>
        <Sidebar />

        <div className="td-wrapper">
          <h2 className="td-title">Super Admin Dashboard</h2>

          {/* KPI CARDS */}
          <div className="td-grid">

            <DashboardCard
              icon="📍"
              label="Total States"
              value={summary.states}
              percent={summary.growth.students}
            />

            <DashboardCard
              icon="📌"
              label="Total Districts"
              value={summary.districts}
              percent={summary.growth.teachers}
            />

            <DashboardCard
              icon="🧭"
              label="Total Talukas / Mandals"
              value={summary.talukas}
              percent={summary.growth.schools}
            />

            <DashboardCard
              icon="🏡"
              label="Total Villages"
              value={summary.villages}
              percent={70}
            />

            <DashboardCard
              icon="🏫"
              label="Total Schools"
              value={summary.schools}
              percent={56}
            />

            <DashboardCard
              icon="👨‍🏫"
              label="Total Teachers"
              value={summary.teachers}
              percent={summary.growth.teachers}
            />

            <DashboardCard
              icon="👨‍🎓"
              label="Total Students"
              value={summary.students}
              percent={summary.growth.students}
            />

          </div>

          {/* GROWTH BARS */}
          <div className="td-stats-box">
            <h3>Overall Growth Statistics</h3>

            <StatBar label="Student Growth" percent={summary.growth.students} />
            <StatBar label="Teacher Growth" percent={summary.growth.teachers} />
            <StatBar label="School Growth" percent={summary.growth.schools} />
          </div>

          {/* NOTIFICATIONS */}
          <div className="td-notify-box">
            <h3>Important Notifications</h3>

            {summary.notifications.map((n, i) => (
              <div key={i} className="td-note-item">
                <p><b>{n.title}</b></p>
                <p>{n.message}</p>
                <hr />
              </div>
            ))}
          </div>

          {/* TEACHER TABLE */}
          <div className="td-table-box">
            <h3>Teacher Profiles</h3>

            <table className="td-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>ID</th>
                  <th>Department</th>
                  <th>Completed (%)</th>
                  <th>Rating</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {summary.teachersTable.map((t, i) => (
                  <tr key={i}>
                    <td>{t.name}</td>
                    <td>{t.id}</td>
                    <td>{t.department}</td>
                    <td>{t.completed}%</td>
                    <td>{"⭐".repeat(t.rating)}</td>
                    <td>{t.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

// ==========================================
// REUSABLE COMPONENTS
// ==========================================

function DashboardCard({ icon, label, value, percent }) {
  return (
    <div className="td-card">
      <div className="td-icon">{icon}</div>

      <p className="td-value">{value}</p>
      <p className="td-label">{label}</p>

      <div className="td-progress">
        <div className="td-progress-fill" style={{ width: `${percent}%` }}></div>
      </div>

      <p className="td-sub">{percent}% growth</p>
    </div>
  );
}

function StatBar({ label, percent }) {
  return (
    <div className="td-stat-item">
      <span>{label}</span>

      <div className="td-stat-bar">
        <div className="td-stat-fill" style={{ width: `${percent}%` }}></div>
      </div>

      <span>{percent}%</span>
    </div>
  );
}
