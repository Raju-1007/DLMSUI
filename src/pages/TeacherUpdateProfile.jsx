import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import SearchableDropdown from "../components/SearchableDropdown";
import { useMessage } from "../context/MessageContext";

export default function TeacherUpdateProfile() {
  const nav = useNavigate();
  const loginDetails = useSelector((state) => state.auth.user);
  const{showError, showSuccess}=useMessage();

  const [formData, setFormData] = useState({
    district: null,
    mandal: null,
    village: null,

    schoolAddress: "",
    relationName: "",
    relationType: "",
    relationMobile: "",
    relationEmail: "",
    techer_service_id: "",

  });

  /* ================= FETCHERS ================= */

  const fetchDistricts = async () => {
    const res = await axios.get("http://localhost:8080/login/login/getDistricts");
    return res.data.map(d => ({
      label: d.districtName,
      value: d.districId
    }));
  };

  const fetchMandals = async () => {
    if (!formData.district) return [];
    const res = await axios.get(
      "http://localhost:8080/login/login/getMandals",
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
      "http://localhost:8080/login/login/getVillages",
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
      "http://localhost:8080/login/login/getSchools",
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
      teacherId: loginDetails.userDetails.loginid,
      teacherName: loginDetails.userDetails.fullName,
      teacherEmail: loginDetails.userDetails.email,
      teacherPhone: loginDetails.userDetails.mobile,
      role: loginDetails.userDetails.role,
      districtId: formData.district?.value,
      mandalId: formData.mandal?.value,
      villageId: formData.village?.value,
      relationName: formData.relationName,
      relationType: formData.relationType,
      relationMobile: formData.relationMobile,
      relation_email: formData.relationEmail,
        techerServiceId:
    loginDetails?.userDetails?.role === "TEACHER"
      ? formData. techer_service_id
      : 'Admin123'

    };
     loginDetails?.userDetails?.role === "TEACHER" &&
payload.techerServiceId
    ? await verfiyTeacherServiceId(payload.techerServiceId)
    : null;
    
    await axios.post(
      "http://localhost:8080/login/teacher-update-profile",
      payload,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json"
        }
      }
    );

    showError("Profile updated successfully");
    if(loginDetails?.userDetails?.role === "TEACHER"){
    nav("/teacher/dashboard");
    }
    else{
      nav("/admin/dashboard");
    }
  };

  const verfiyTeacherServiceId = async (serviceId) => {
    console.log("Verifying Teacher Service ID:", serviceId);
    try {
     const res = await axios.get(
             `${import.meta.env.VITE_API_BASE_URL}/content/teacherByServiceId/${serviceId}`
           );
     
      if (!res.data) {
        showError("Invalid Teacher Service ID");
        throw new Error("Invalid Teacher Service ID");
      }     
    } catch (error) {
      showError("Error verifying Teacher Service ID");
      throw error;
    }
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
                  <label>Name</label>
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
                  <label>Deapartment ID</label>
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
                  {loginDetails?.userDetails?.role === "TEACHER" && (
                    <>
                      <label>Teacher Service ID *</label>
                      <input
                        type="text"
                        value={formData.techer_service_id}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            techer_service_id: e.target.value,
                          }))
                        }
                      />
                    </>
                  )}
                </div>






              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Teacher Name</label>
                  <input value={loginDetails.userDetails.role} disabled />
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
