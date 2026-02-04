import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import SearchableDropdown from "../components/SearchableDropdown";

export default function UpdateProfile() {
  const nav = useNavigate();
  const loginDetails = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    district: null,
    mandal: null,
    village: null,
    school: null,
    classData: null,

    studentAddress: "",
    schoolAddress: "",
    relationName: "",
    relationType: "",
    relationMobile: "",
    relationEmail: "",
    schoolType: "",
    rollNo:"",
    
  });

  /* ================= FETCHERS ================= */

  const fetchDistricts = async () => {
    const res = await axios.get("http://localhost:8080/login/getDistricts");
    return res.data.map(d => ({
      label: d.districtName,
      value: d.districId
    }));
  };

  const fetchMandals = async () => {
    if (!formData.district) return [];
    const res = await axios.get(
      "http://localhost:8080/login/getMandals",
      { params: { districId: formData.district.value } }
    );
    return res.data.map(m => ({
      label: m.name,
      value: m.id,
    }));
  };

  const fetchVillages = async () => {
    if (!formData.mandal) return [];
    const res = await axios.get(
      "http://localhost:8080/login/getVillages",
      { params: { mandalId: formData.mandal.value } }
    );
    return res.data.map(v => ({
      label: v.villageName,
      value: v.villageId
    }));
  };

  const fetchSchools = async () => {
    if (!formData.district || !formData.mandal || !formData.village) return [];
    const res = await axios.get(
      "http://localhost:8080/login/getSchools",
      {
        params: {
          districtId: formData.district.value,
          mandalId: formData.mandal.value,
          villageId: formData.village.value
        }
      }
    );
    return res.data.map(s => ({
      label: s.schoolName,
      value: s.schoolId,
      schoolType: s.schoolType
    }));
  };

  const fetchClasses = async () => {
    if (!formData.school) return [];
    const res = await axios.get(
      "http://localhost:8080/login/getClasses",
      { params: { schoolId: formData.school.value } }
    );
    return res.data.map(c => ({
      label: c.class_name,   // ✅ SHOW NAME IN UI
    value: c.class_id 
    }));
  };

  /* ================= SUBMIT ================= */

  const updateProfile = async (e) => {
    e.preventDefault();

    const payload = {
      studentId: loginDetails.userDetails.loginid,
      studentName: loginDetails.userDetails.fullName,
      studentEmail: loginDetails.userDetails.email,
      studentPhone: loginDetails.userDetails.mobile,
      rollNo:loginDetails.userDetails.loginid,

      districtId: formData.district?.value,
      mandalId: formData.mandal?.value,
      villageId: formData.village?.value,
      schoolId: formData.school?.value,
      classId: formData.classData?.value,

      studentAddress: formData.studentAddress,
      address: formData.schoolAddress,
      schoolType: formData.schoolType,

      relationName: formData.relationName,
      relationType: formData.relationType,
      relationMobile: formData.relationMobile,
      relation_email: formData.relationEmail
    };

    await axios.post(
      "http://localhost:8080/login/update-profile",
      payload,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json"
        }
      }
    );

    alert("Profile updated successfully");
    nav("/dashboard");
  };

  /* ================= UI ================= */

  return (
    <div>
      <Navbar />

      <div className="course-layout">
        <Sidebar />

        <div className="course-right">
          <h2 className="course-title">Update Your Profile</h2>

          <div className="profile-card">
            <form className="profile-form" onSubmit={updateProfile}>

              {/* STUDENT INFO */}
              <div className="form-row">
                <div className="form-group">
                  <label>Student Name</label>
                  <input value={loginDetails.userDetails.fullName} disabled />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input value={loginDetails.userDetails.email} disabled />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>
                  <input value={loginDetails.userDetails.mobile} disabled />
                </div>
                <div className="form-group">
                  <label>Roll No</label>
                  <input value={loginDetails.userDetails.loginid} disabled />
                </div>
              </div>

              {/* LOCATION */}
              <div className="form-row">
                <div className="form-group">
                  <label>District *</label>
                  <SearchableDropdown
                    fetchOptions={fetchDistricts}
                    onChange={(v) =>
                      setFormData(p => ({
                        ...p,
                        district: v,
                        mandal: null,
                        village: null,
                        school: null,
                        classData: null
                      }))
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Mandal *</label>
                  <SearchableDropdown
                    fetchOptions={fetchMandals}
                    onChange={(v) =>
                      setFormData(p => ({
                        ...p,
                        mandal: v,
                        village: null,
                        school: null,
                        classData: null
                      }))
                    }
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Village *</label>
                  <SearchableDropdown
                    fetchOptions={fetchVillages}
                    onChange={(v) =>
                      setFormData(p => ({
                        ...p,
                        village: v,
                        school: null,
                        classData: null
                      }))
                    }
                  />
                </div>

                <div className="form-group">
                  <label>School *</label>
                  <SearchableDropdown
                    fetchOptions={fetchSchools}
                    onChange={(v) =>
                      setFormData(p => ({
                        ...p,
                        school: v,
                        classData: null,
                        schoolType: v.schoolType
                      }))
                    }
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Class *</label>
                  <SearchableDropdown
                    fetchOptions={fetchClasses}
                    onChange={(v) =>
                      setFormData(p => ({ ...p, classData: v}))
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Student Address *</label>
                  <input
                    value={formData.studentAddress}
                    onChange={(e) =>
                      setFormData(p => ({
                        ...p,
                        studentAddress: e.target.value
                      }))
                    }
                  />
                </div>
              </div>

              {/* RELATION */}
              <div className="form-row">
                <div className="form-group">
                  <label>Relation Name *</label>
                  <input
                    value={formData.relationName}
                    onChange={(e) =>
                      setFormData(p => ({
                        ...p,
                        relationName: e.target.value
                      }))
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Relation Type *</label>
                  <select
                    value={formData.relationType}
                    onChange={(e) =>
                      setFormData(p => ({
                        ...p,
                        relationType: e.target.value
                      }))
                    }
                  >
                    <option value="">Select</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Guardian">Guardian</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Relation Phone *</label>
                  <input
                    value={formData.relationMobile}
                    onChange={(e) =>
                      setFormData(p => ({
                        ...p,
                        relationMobile: e.target.value
                      }))
                    }
                  />
                </div>
                
                <div className="form-group">
                  <label>Relation email *</label>
                  <input
                    value={formData.relationEmail}
                    onChange={(e) =>
                      setFormData(p => ({
                        ...p,
                        relationEmail: e.target.value
                      }))
                    }
                  />
                </div>
                </div>
                <div className="form-row">
                <div className="form-group">
                  <label>School address *</label>
                  <input
                    value={formData.schoolPhone}
                    onChange={(e) =>
                      setFormData(p => ({
                        ...p,
                        schoolAddress: e.target.value
                      }))
                    }
                  />
                </div>

                <div className="form-group">
                  <label>School Type *</label>
                  <select
                    value={formData.schoolType}
                    onChange={(e) =>
                      setFormData(p => ({
                        ...p,
                        schoolType: e.target.value
                      }))
                    }
                  >
                    <option value="">Select</option>
                    <option value="Primary">Primary</option>
                    <option value="Secondary">Secondary</option>
                  </select>
                </div>
                </div>
                

              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  Update Profile
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
