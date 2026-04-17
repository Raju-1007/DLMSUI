// src/pages/AdminTeachers.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import SearchableDropdown from "../components/SearchableDropdown";
import { useNavigate } from "react-router-dom";


export default function AdminTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const nav = useNavigate();
  const [page, setPage] = useState(0);
      const [size] = useState(5);
      const[totalPages,setTotalPages]=useState("");
  const [form, setForm] = useState({
    teacherId: "",
    name: "",
    department: "",
    subject: "",
    aadhaar: "",
    rating: 5,
    district: null,
    mandal: null,
    village: null,
    school: null,
    address:"",
    schoolType:"",
    classNames:""
  });

  /* ================= LOAD TEACHERS ================= */
 useEffect(() => {
  axios
    .get(`${import.meta.env.VITE_API_BASE_URL}/content/teacherProfiles`, {
      params: {
        page: page,
        size: size,
      },
    })
    .then((res) => {
      setTeachers(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    })
    .catch(() => {
      setTeachers([]);
      setTotalPages(0);
    });
}, [page, size]);   // 🔥 IMPORTANT

  /* ================= OPEN POPUP ================= */
  const openPopup = (t) => {
    setForm({
      teacherId: t.tecaher_id,
      name: t.tecaher_name,
      department: t.teacher_department,
      subject: t.teacher_knows_Subjects,
      aadhaar: t.teacher_adhaar_number,
      address:t.tecaher_address,
      schoolType:t.schoolType,
      classNames:t.classNames,
      rating: t.rating || 5,
      district: null,
      mandal: null,
      village: null,
      school: null,
      
    });
    setShowPopup(true);
  };

  const handleChange = (key, value) => {
    setForm((p) => ({ ...p, [key]: value }));

    console.log("setForm,", setForm);
  };

  /* ================= DROPDOWNS ================= */
  const fetchDistricts = async () => {
    const res = await axios.get("http://localhost:8080/login/login/getDistricts");
    return res.data.map(d => ({
      label: d.districtName,
      value: d.districId
    }));
  };

  const fetchMandals = async () => {
    if (!form.district) return [];
    const res = await axios.get(
      "http://localhost:8080/login/login/getMandals",
      { params: { districId: form.district.value } }
    );
    return res.data.map(m => ({
      label: m.name,
      value: m.id
    }));
  };

  const fetchVillages = async () => {
    if (!form.mandal) return [];
    const res = await axios.get(
      "http://localhost:8080/login/login/getVillages",
      { params: { mandalId: form.mandal.value } }
    );
    return res.data.map(v => ({
      label: v.villageName,
      value: v.villageId
    }));
  };

  const fetchSchools = async () => {
    if (!form.district || !form.mandal || !form.village) return [];
    const res = await axios.get(
      "http://localhost:8080/login/login/getSchools",
      {
        params: {
          districtId: form.district.value,
          mandalId: form.mandal.value,
          villageId: form.village.value
        }
      }
    );
    return res.data.map(s => ({
      label: s.schoolName,
      value: s.schoolId,
      schoolType: s.schoolType
    }));
  };

  /* ================= FILTER ================= */
  const filtered = teachers.filter(t =>
    `${t.tecaher_id} ${t.tecaher_name} ${t.teacher_department}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleSave = async () => {

  // ✅ basic validation
  if (!form.district || !form.mandal || !form.village || !form.school) {
    showError("Please select District, Mandal, Village and School");
    return;
  }

  // ✅ CREATE PAYLOAD FROM SELECTED VALUES
  const payload = {
    teacherId: form.teacherId,

    districtId: form.district.value,
    mandalId: form.mandal.value,
    villageId: form.village.value,

    schoolId: form.school.value,
    schoolType: form.schoolType,
    classNames:form.classNames,
    address:form.address
  };


  try {
    await axios.post(
      "http://localhost:8080/content/assignTeacher",
      payload,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json"
        }
      }
    );

    showError("Teacher assigned successfully");
    setShowPopup(false);

  } catch (err) {
    console.error("Save failed", err);
    showError("Failed to save assignment");
  }
};

const handileClick=(t)=>{
    
    nav("/calnderview",{
      state:{data:t}
    })
}

  return (
    <div>
      <Navbar />

      <div className="admin-layout">
        <Sidebar />

        <div className="admin-main">
          <h2 className="page-title">Manage Teachers</h2>

          <input
            className="search-box"
            placeholder="Search by ID / Name / Department"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th><th>Name</th>
                <th>AdhaarNumber</th>
                <th>Address</th>
                <th>Dept</th><th>Subject</th>
                <th>SchoolType</th>
                <th>classNames</th>
                <th>Rating</th>
                {/* <th>Sechudule Timings</th> */}
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.teacher_id} onClick={() => openPopup(t)}>
                  <td>{t.tecaher_id}</td>
                  <td>{t.tecaher_name}</td>
                  <td>{t.aadharNumber}</td>
                  <td>{t.tecaher_address}</td>
                  <td>{t.teacher_department}</td>
                  <td>{t.teacher_knows_Subjects}</td>
                  <td>{t.schoolType}</td>
                  <td>{t.classNames}</td>
                  <td>{"★".repeat(t.rating || 5)}</td>
                  {/* <td><button onClick={()=>handileClick(t)}>sechudle class</button></td> */}

                </tr>
              ))}
            </tbody>
          </table>

          <div className="admin-pagination">
              <button
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>

              <span>
                Page {page + 1} of {totalPages}
              </span>

              <button
                disabled={page + 1 >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
        </div>
        
      </div>

      {/* ================= POPUP ================= */}
      {showPopup && (
        <div className="modal-overlay">
          <div className="modal-card">

            <div className="modal-header">
              <h3>Teacher AlloCation</h3>
              <button onClick={() => setShowPopup(false)}>×</button>
            </div>

            <div className="grid-2">
              <input value={form.teacherId} disabled />
              <input value={form.name} disabled />
              <input value={form.department} disabled />
              <input value={form.subject} disabled />
              <input value={form.address} disabled />
               <input value={form.schoolType} disabled />
                <input value={form.classNames} disabled />
            </div>

            <h4>Assign Location</h4>

            <div className="grid-3">
              <SearchableDropdown
                fetchOptions={fetchDistricts}
                onChange={v => {
                  handleChange("district", v);
                  handleChange("mandal", null);
                  handleChange("village", null);
                }}
              />
              <SearchableDropdown
                fetchOptions={fetchMandals}
                onChange={v => {
                  handleChange("mandal", v);
                  handleChange("village", null);
                }}
              />
              <SearchableDropdown
                fetchOptions={fetchVillages}
                onChange={v => handleChange("village", v)}
              />
              <SearchableDropdown
                fetchOptions={fetchSchools}
                onChange={v =>
                  setForm(p => ({
                    ...p,
                    school: v,
                    schoolType: v.schoolType
                  }))
                }
              />
            </div>

            <div className="modal-actions">
              <button onClick={handleSave}  className="btn-primary">  Assign</button>
              <button className="btn-secondary" onClick={() => setShowPopup(false)}>
                Cancel
              </button>
            </div>
            
          </div>
           
        </div>
      )}

      <Footer />
    </div>
  );
}
