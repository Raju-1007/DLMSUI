import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
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

// Register chart.js components
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

  const { showSuccess, showError } = useMessage();
  const [analytics, setAnalytics] = useState(null);

  // ✅ HARD-CODED FALLBACK DATA (used if API fails or returns empty)
  const fallback = {
    // District-wise performance: can be avg score or completion %
    districtPerformance: [
      { district: "Krishna", score: 78 },
      { district: "Guntur", score: 65 },
      { district: "Nellore", score: 88 },
      { district: "Prakasam", score: 52 },
      { district: "Kadapa", score: 91 },
    ],

    // Monthly active users across the state
    monthlyActiveUsers: [1200, 1500, 1800, 2400, 2200, 3100, 4000],

    // Content usage distribution
    contentUsage: {
      videos: 45,
      pdfs: 30,
      quizzes: 25,
    },

    // Top KPI summary
    summary: {
      totalStudents: 34527,
      totalTeachers: 8760,
      totalSchools: 1257,
      avgCompletionRate: 72,
    },
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  // ✅ Load from API, fallback to hardcoded if anything goes wrong
  const loadAnalytics = async () => {
    try {
      const res = await axios.get("/super-admin/system-analytics");

      if (!res || !res.data) {
        console.warn("System analytics API empty → using fallback");
        setAnalytics(fallback);
        return;
      }

      const data = res.data;

      const finalData = {
        districtPerformance:
          data.districtPerformance ?? fallback.districtPerformance,
        monthlyActiveUsers:
          data.monthlyActiveUsers ?? fallback.monthlyActiveUsers,
        contentUsage: data.contentUsage ?? fallback.contentUsage,
        summary: data.summary ?? fallback.summary,
      };

      setAnalytics(finalData);
    } catch(err) {
       showError("System analytics API failed → using fallback:", err);
      setAnalytics(fallback);
    }
  };

  if (!analytics) {
    return <div style={{ padding: 20 }}>Loading System Analytics...</div>;
  }

  // ==========================
  //   CHART DATA DEFINITIONS
  // ==========================

  // BAR CHART – District-wise performance
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

  // LINE CHART – Monthly active users
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

  // PIE CHART – Content usage
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

          {/* ===== TOP SUMMARY CARDS ===== */}
          <div className="sa-summary-grid">
            <SummaryCard
              label="Total Students"
              value={analytics.summary.totalStudents}
            />
            <SummaryCard
              label="Total Teachers"
              value={analytics.summary.totalTeachers}
            />
            <SummaryCard
              label="Total Schools"
              value={analytics.summary.totalSchools}
            />
            <SummaryCard
              label="Avg Completion Rate"
              value={analytics.summary.avgCompletionRate + "%"}
            />
          </div>

          {/* ===== BAR CHART CARD ===== */}
          <div className="td-analytics-card">
            <h3>District-wise Student Performance</h3>
            <Bar data={districtBarData} />
          </div>

          {/* ===== LINE CHART CARD ===== */}
          <div className="td-analytics-card">
            <h3>Monthly Active Users</h3>
            <Line data={monthlyLineData} />
          </div>

          {/* ===== PIE CHART CARD ===== */}
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

// ==========================
//   REUSABLE SUMMARY CARD
// ==========================

function SummaryCard({ label, value }) {
  return (
    <div className="sa-summary-card">
      <p className="sa-summary-label">{label}</p>
      <p className="sa-summary-value">{value}</p>
    </div>
  );
}
