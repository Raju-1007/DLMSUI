import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";
import axios from "axios";
import { useMessage } from "../context/MessageContext"; 


export default function TeacherDetails() {
  const { showSuccess, showError } = useMessage();
  const loginDetails=useSelector((state)=>state.auth.user);

  const [form, setForm] = useState({
    loginId: loginDetails.loginId,
    name: "",
    mobile: "",
    email: "",
    department: "",
    subjects: "",
    skills: "",
    className:"",
    course: "",
    timings: "",
    yearCompleted: "",
    joiningDate: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      import.meta.env.VITE_API_BASE_URL+"/api/instructor/save",
      form
    );

    showSuccess("Instructor details saved successfully!");
    console.log(res.data);

  } catch(err) {
    console.error(err);
    showError("Error saving details");
  }
};
  return (
    <div>
      <Navbar />

      <div className="layout">
        <Sidebar />

        <div className="details-wrapper">
          <div className="details-card">

            <h2>Instructor Details</h2>

            <form onSubmit={handleSubmit} className="details-form">

              <input name="loginId" placeholder="Login ID"  value={form.loginId}/>
              <input name="name" placeholder="Instructor Name" onChange={handleChange} />
              <input name="mobile" placeholder="Mobile Number" onChange={handleChange} />
              <input name="email" placeholder="Email" onChange={handleChange} />

              <input name="department" placeholder="Department Name" onChange={handleChange} />
              <input name="subjects" placeholder="Subjects You Can Teach" onChange={handleChange} />
              <input name="skills" placeholder="Skills" onChange={handleChange} />
               <input name="className" placeholder="className" onChange={handleChange} />

              <input name="course" placeholder="Course Assigned" onChange={handleChange} />
              <input name="timings" placeholder="Class Timings (e.g 9AM - 11AM)" onChange={handleChange} />

              <input name="yearCompleted" placeholder="which section you teach" onChange={handleChange} />
              <input type="date" name="joiningDate" placeholder="Joining Date" onChange={handleChange} />

              <button type="submit">Save Details</button>

            </form>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
