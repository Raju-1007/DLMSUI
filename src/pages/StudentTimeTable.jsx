import { useEffect, useState } from "react";
import { useMessage } from "../context/MessageContext";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";

export default function StudentTimeTable() {
  const navigate = useNavigate();
  const { showError } = useMessage();
  const login = useSelector((state) => state.auth.user);
  const localizer = dayjsLocalizer(dayjs);

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    if (!login?.userDetails?.loginid) return;

    axios
      .get(
        `${import.meta.env.VITE_API_BASE_URL}/notify/api/getStudentMeeingDetails/${login?.userDetails?.loginid}`
      )
      .then((res) => {
        const mapped = res.data.map((item) => ({
          id: item.id,
          title: `${item.description}`,
          start: dayjs(`${item.date} ${item.startTime}`).toDate(),
          end: dayjs(`${item.date} ${item.endTime}`).toDate(),
          description: item.description,
          teacherId: item.teacherId,
          meetingRoomId: item.teacherId ? String(item.teacherId) : String(item.id),
          meetingLink: item.meetingLink,
        }));
        setEvents(mapped);
      })
      .catch(console.error);
  }, [login]);

  const joinMeeting = (event) => {
    const roomId = event?.meetingRoomId || event?.teacherId;
    if (!roomId) {
      showError("Meeting room is not available for this event.");
      return;
    }
    navigate(`/meeting/${roomId}`);
  };

  return (
    <div>
      <>
        <Navbar />
        <div className="page-grid">
          <Sidebar />

          <div className="tt-wrapper">
            <div className="tt-top-row">
              <h2 className="tt-page-title">Student Timetable</h2>
            </div>

            <div className="tt-card" style={{ height: "650px" }}>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                defaultView="week"
                views={["month", "week", "day", "agenda"]}
                onSelectEvent={setSelectedEvent}
              />
            </div>
          </div>
        </div>

        {selectedEvent && (
          <div className="tt-popup-overlay">
            <div className="tt-popup-box tt-view-box">
              <div className="tt-popup-header tt-popup-header-blue">
                <h3>{selectedEvent.title}</h3>
                <span className="tt-popup-close" onClick={() => setSelectedEvent(null)}>
                  ✕
                </span>
              </div>

              <div className="tt-popup-body">
                <div className="tt-time-row">
                  <div>
                    <label className="tt-label">START</label>
                    <p>{dayjs(selectedEvent.start).format("DD MMM YYYY hh:mm A")}</p>
                  </div>
                  <div>
                    <label className="tt-label">END</label>
                    <p>{dayjs(selectedEvent.end).format("DD MMM YYYY hh:mm A")}</p>
                  </div>
                </div>
                <div className="tt-time-row">
                  <div>
                    <label className="tt-label">DESCRIPTION</label>
                    <p>{selectedEvent.description || "--"}</p>
                  </div>
                  <div>
                    <label className="tt-label">Online Meeting</label>
                    <button
                      type="button"
                      className="tt-schedule-btn"
                      onClick={() => joinMeeting(selectedEvent)}
                    >
                      Join Meeting (see teacher video)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    </div>
  );
}
