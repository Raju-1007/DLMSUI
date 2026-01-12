import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import axios from "axios";

import { useMessage } from "../context/MessageContext"; 


export default function AttendanceTracker() {

    const { showSuccess, showError } = useMessage();
    const [summary, setSummary] = useState({});
    const [logs, setLogs] = useState([]);
    const [fromDate, setFromDate] = useState("2025-10-01");
    const [toDate, setToDate] = useState("2025-11-30");

    // Convert YYYY-MM-DD → DD/MM/YYYY
    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-GB");
    };
    const openFromDate = () => {
        document.getElementById("fromDate").showPicker();
    };


    // Hardcoded fallback data (same as image)
    const fallbackSummary = {
        overall: "92%",
        totalWorking: 120,
        present: 110,
        absent: 10,
        late: 3,
    };

    const fallbackLogs = [
        { date: "02 Sep 2025", status: "Present", in: "09:00", out: "03:30", notes: "On time" },
        { date: "03 Sep 2025", status: "Absent", in: "—", out: "—", notes: "Medical leave" },
        { date: "04 Sep 2025", status: "Late", in: "09:25", out: "03:30", notes: "Reached 25 mins late" },
        { date: "05 Sep 2025", status: "Present", in: "08:55", out: "03:30", notes: "Early arrival" },
    ];

    useEffect(() => {
        loadAttendance();
    }, []);

    const loadAttendance = async () => {
        try {
            const res = await axios.get(import.meta.env.VITE_API_BASE_URL+"/api/attendance/1");

            if (res.data && res.data.summary) {
                setSummary(res.data.summary);
                setLogs(res.data.logs);
            } else {
                setSummary(fallbackSummary);
                setLogs(fallbackLogs);
            }
        } catch {
            setSummary(fallbackSummary);
            setLogs(fallbackLogs);
        }
    };

    return (
        <div>
            <Navbar />

            <div style={{ display: "grid", gridTemplateColumns: "250px 1fr" }}>
                <Sidebar />

                <div className="att-wrapper">

                    <h2 className="att-title">Attendance Tracker</h2>

                    <div className="att-card">

                        <div className="att-header">
                            <h4>Attendance Summary</h4>

                            <div className="date-label-box" onClick={openFromDate}>
                                <img src="/images/calnder.png" alt="cal" className="att-cal-icon" />

                                <span className="date-label">
                                    {formatDate(fromDate)} - {formatDate(toDate)}
                                </span>

                                {/* Hidden From Date */}
                                <input
                                    id="fromDate"
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) => {
                                        setFromDate(e.target.value);

                                        // OPEN TO-DATE AUTOMATICALLY
                                        setTimeout(() => {
                                            document.getElementById("toDate").showPicker();
                                        }, 150);
                                    }}
                                    className="hidden-date"
                                />

                                {/* Hidden To Date */}
                                <input
                                    id="toDate"
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    className="hidden-date"
                                />
                            </div>


                        </div>

                        {/* SUMMARY BOXES */}
                        <div className="att-summary-grid">

                            <div className="att-summary-card">
                                <h5>Overall</h5>
                                <p className="blue-num">{summary.overall}</p>
                                <span>Attendance</span>
                            </div>

                            <div className="att-summary-card">
                                <h5>Total Working</h5>
                                <p className="blue-num">{summary.totalWorking}</p>
                                <span>Days</span>
                            </div>

                            <div className="att-summary-card">
                                <h5>Days</h5>
                                <p className="blue-num">{summary.present}</p>
                                <span>Present</span>
                            </div>

                            <div className="att-summary-card">
                                <h5>Days</h5>
                                <p className="blue-num">{summary.absent}</p>
                                <span>Absent</span>
                            </div>

                            <div className="att-summary-card">
                                <h5>Late</h5>
                                <p className="blue-num">{summary.late}</p>
                                <span>Entries</span>
                            </div>

                        </div>
                    </div>

                    {/* TABLE CARD */}
                    <div className="att-table-card">
                        <h4 className="table-title">Daily Log / Table View</h4>

                        <table className="att-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>In Time</th>
                                    <th>Out Time</th>
                                    <th>Notes</th>
                                </tr>
                            </thead>

                            <tbody>
                                {logs.map((row, i) => (
                                    <tr key={i}>
                                        <td>{row.date}</td>
                                        <td>{row.status}</td>
                                        <td>{row.in}</td>
                                        <td>{row.out}</td>
                                        <td>{row.notes}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>

                </div>
            </div>
        </div>
    );
}
