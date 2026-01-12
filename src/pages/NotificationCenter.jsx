// import React from 'react'
// import Navbar from '../components/Navbar'; import Sidebar from '../components/Sidebar'
// import { http } from '../api/axios'
// export default function NotificationCenter(){ const [items,setItems]=React.useState([]);
//      React.useEffect(()=>{ http.get('/notify/inbox/1').then(r=> setItems(r.data||[])) },[]); 
//      return (<div><Navbar/>
//      <div style={{display:'grid',gridTemplateColumns:'250px 1fr'}}><Sidebar/>
//      <div style={{padding:16}}><h2>Notifications</h2>{items.map((n,i)=>(<div key={i} className='card' style={{marginBottom:8}}><b>{n.title}</b><div>{n.body}</div></div>))}</div></div></div>) }



// src/pages/NotificationCenter.jsx

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { http } from "../api/axios";
import axios from "axios";
import { useMessage } from "../context/MessageContext"; 

export default function NotificationCenter() {
  const { showSuccess, showError } = useMessage();
  const [items, setItems] = useState([]);
  const[loginStuDeatils,setLoginStuDetails]=useState("");

  // Hard-coded fallback data
  const fallback = [
    {
      date: "20/5/2025",
      title: "Update your KYC for more advance options on your courses",
    },
    {
      date: "18/11/2025",
      title: "New assignment added for Mathematics.",
    },
    {
      date: "22/12/2025",
      title: "Your Science project is due in 2 days.",
    },
    {
      date: "12/10/2025",
      title: "Feedback is now available for your recent assignment.",
    },
  ];

  useEffect(() => {
    let loginstuDetails=JSON.parse(localStorage.getItem('studentsInformation'));
     setLoginStuDetails(loginstuDetails);
    const load = async () => {
      try {
        //const res = await http.get("/notify/inbox/1");
          const res= await axios.get(import.meta.env.VITE_API_BASE_URL+"/api/notifications/getNotifications")
        console.log(res,"res========================================");

        if (res.data && res.data.length > 0) {
          setItems(res.data);
        } else {
          setItems(fallback);
        }
      } catch(err) {
       showError("API failed → Loading fallback", err);
        setItems(fallback);
      }
    };

    load();
  }, []);

  return (
    <div>
      <Navbar />

      <div className="notify-grid">
        <Sidebar />

        <div className="notifications-wrapper">
          <h2 className="notify-title">Important Notifications</h2>

          <div className="notify-table-box">

            <div className="notify-user-header">
              {loginStuDeatils.fullName}· <span className="notify-id">{loginStuDeatils.loginid}</span>
            </div>

            <table className="notify-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Subject</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {items.map((n, i) => (
                  <tr key={i}>
                    <td>{n.body}</td>
                    <td>{n.title}</td>
                    <td>
                      <a className="notify-view">View</a>
                    </td>
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
