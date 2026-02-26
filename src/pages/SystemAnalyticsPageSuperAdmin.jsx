import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import axios from "axios";
import { useMessage } from "../context/MessageContext";

import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function SystemAnalyticsPageSuperAdmin() {
  const { showError } = useMessage();
  const [analytics, setAnalytics] = useState(null);

  const fallbackCharts = {
    districtPerformance: [
      { district: "Krishna", score: 78 },
      { district: "Guntur", score: 65 },
      { district: "Nellore", score: 88 },
      { district: "Prakasam", score: 52 },
      { district: "Kadapa", score: 91 },
    ],
    monthlyActiveUsers: [1200, 1500, 1800, 2400, 2200, 3100, 4000],
    contentUsage: {
      videos: 45,
      pdfs: 30,
      quizzes: 25,
    },
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/analytics/getSuperAdminDashBoardDetails`
      );

      const data = res.data;

      const finalData = {
        summary: {
          totalStudents: data.studentCount ?? 0,
          totalTeachers: data.teachers ?? 0,
          totalSchools: data.schools ?? 0,
        },
        growth: {
          students: data.growth?.students ?? 0,
          teachers: data.growth?.teachers ?? 0,
          schools: data.growth?.schools ?? 0,
        },
        districtPerformance: fallbackCharts.districtPerformance,
        monthlyActiveUsers: fallbackCharts.monthlyActiveUsers,
        contentUsage: fallbackCharts.contentUsage,
      };

      setAnalytics(finalData);
    } catch (err) {
      showError("System analytics API failed");
      setAnalytics({
        summary: {
          totalStudents: 0,
          totalTeachers: 0,
          totalSchools: 0,
        },
        growth: { students: 0, teachers: 0, schools: 0 },
        ...fallbackCharts,
      });
    }
  };

  if (!analytics) {
    return <div style={{ padding: 20 }}>Loading System Analytics...</div>;
  }

  // BAR CHART
  const districtBarData = {
    labels: analytics.districtPerformance.map((d) => d.district),
    datasets: [
      {
        label: "Student Performance (%)",
        data: analytics.districtPerformance.map((d) => d.score),
        backgroundColor: "#4F46E5",
      },
    ],
  };

  // LINE CHART
  const monthlyLineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Active Users",
        data: analytics.monthlyActiveUsers,
        backgroundColor: "#10B981",
        borderColor: "#10B981",
        fill: false,
        tension: 0.3,
      },
    ],
  };

  // PIE CHART
  const contentPieData = {
    labels: ["Videos", "PDFs", "Quizzes"],
    datasets: [
      {
        data: [
          analytics.contentUsage.videos,
          analytics.contentUsage.pdfs,
          analytics.contentUsage.quizzes,
        ],
        backgroundColor: ["#4F46E5", "#F59E0B", "#10B981"],
      },
    ],
  };

  return (
    <div>
      <Navbar />

      <div style={{ display: "grid", gridTemplateColumns: "250px 1fr" }}>
        <Sidebar />

        <div className="td-wrapper">
          <h2 className="td-title">System Analytics</h2>

          {/* ===== SUMMARY CARDS ===== */}
          <div className="sa-summary-grid">
            <SummaryCard
              label="Total Students"
              value={analytics.summary.totalStudents}
              growth={analytics.growth.students}
            />
            <SummaryCard
              label="Total Teachers"
              value={analytics.summary.totalTeachers}
              growth={analytics.growth.teachers}
            />
            <SummaryCard
              label="Total Schools"
              value={analytics.summary.totalSchools}
              growth={analytics.growth.schools}
            />
            <SummaryCard
              label="Student Growth"
              value={`${analytics.growth.students}%`}
            />
          </div>

          {/* ===== BAR CHART ===== */}
          <div className="td-analytics-card">
            <h3>District-wise Student Performance</h3>
            <Bar data={districtBarData} />
          </div>

          {/* ===== LINE CHART ===== */}
          <div className="td-analytics-card">
            <h3>Monthly Active Users</h3>
            <Line data={monthlyLineData} />
          </div>

          {/* ===== PIE CHART ===== */}
          <div className="td-analytics-card">
            <h3>Content Usage Breakdown</h3>
            <Pie data={contentPieData} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

// ===== SUMMARY CARD COMPONENT =====

function SummaryCard({ label, value, growth }) {
  return (
    <div className="sa-summary-card">
      <p className="sa-summary-label">{label}</p>
      <p className="sa-summary-value">{value}</p>

      {growth !== undefined && (
        <p
          style={{
            marginTop: "5px",
            fontSize: "13px",
            fontWeight: "600",
            color: growth >= 0 ? "#10B981" : "#EF4444",
          }}
        >
          {growth >= 0 ? "▲" : "▼"} {growth}%
        </p>
      )}
    </div>
  );
}
