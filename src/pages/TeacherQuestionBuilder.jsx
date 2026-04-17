import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMessage } from "../context/MessageContext";

export default function TeacherQuestionBuilder() {
  const { showSuccess, showError } = useMessage();
  const loginDetails = useSelector((state) => state.auth.user);
  const { getstudentId } = useParams();
  const { state } = useLocation();

 
  const assignmentId = state?.assignmentId;   // from previous page
  const classId = state?.classId;
  const subjectId = state?.subjectId;
  let  startDateTime=state?.startDate;
  let endDateTime=state?.endDate;
   const navigator = useNavigate();
  const [questions, setQuestions] = useState([]);

  const [form, setForm] = useState({
    prompt: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctOption: "A",
  });

  useEffect(() => {
    if (assignmentId) {
      loadQuestions();
    }
  }, [assignmentId]);

  const loadQuestions = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/notify/assessment/${assignmentId}/questions`
      );

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      setQuestions(data);
    } catch (err) {
      showError("Failed to load questions");
      setQuestions([]);
    }
  };

  const addQuestion = async () => {
    try {
      if (!assignmentId || !classId || !subjectId) {
        showError("Assignment details missing");
        return;
      }

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/notify/addQuestionDetails`,
        {
          teacherId: loginDetails?.userDetails?.loginid,
          subjectId: subjectId,
          startDateTime:startDateTime,
          endDateTime:endDateTime,


          classes: {
            class_id: classId
          },

          assignmentDetails: {
            assignment_id: assignmentId
          },

          prompt: form.prompt,
          optionA: form.optionA,
          optionB: form.optionB,
          optionC: form.optionC,
          optionD: form.optionD,
          correctOption: form.correctOption
        }
      );

      showSuccess("Question added successfully");
      navigator("/teacher/assignments")
 
      setForm({
        prompt: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctOption: "A",
      });

      loadQuestions();

    } catch (err) {
      console.log(err,"falied to add question ");
      showError("Failed to add question");
    }
  };

 

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="app-main">
        <Navbar />

        <div className="app-content">
          <h2 className="page-title">Prepare Questions</h2>

          {/* ADD QUESTION CARD */}
          <div className="card">
            <h3 className="card-title">Add MCQ Question</h3>

            <textarea
              className="input textarea"
              placeholder="Enter question"
              value={form.prompt}
              onChange={(e) =>
                setForm({ ...form, prompt: e.target.value })
              }
            />

            <div className="options-grid">
              <input
                className="input"
                placeholder="Option A"
                value={form.optionA}
                onChange={(e) =>
                  setForm({ ...form, optionA: e.target.value })
                }
              />

              <input
                className="input"
                placeholder="Option B"
                value={form.optionB}
                onChange={(e) =>
                  setForm({ ...form, optionB: e.target.value })
                }
              />

              <input
                className="input"
                placeholder="Option C"
                value={form.optionC}
                onChange={(e) =>
                  setForm({ ...form, optionC: e.target.value })
                }
              />

              <input
                className="input"
                placeholder="Option D"
                value={form.optionD}
                onChange={(e) =>
                  setForm({ ...form, optionD: e.target.value })
                }
              />
            </div>

            <select
              className="input"
              value={form.correctOption}
              onChange={(e) =>
                setForm({ ...form, correctOption: e.target.value })
              }
            >
              <option value="A">Correct Option: A</option>
              <option value="B">Correct Option: B</option>
              <option value="C">Correct Option: C</option>
              <option value="D">Correct Option: D</option>
            </select>

            <button className="btn-primary" onClick={addQuestion}>
              ➕ Add Question
            </button>
          </div>

          {/* QUESTIONS LIST */}
          <div className="card">
            <h3 className="card-title">Prepared Questions</h3>

            {questions.length === 0 ? (
              <p className="empty">No questions added yet</p>
            ) : (
              questions.map((q, i) => (
                <div key={q.questionid || i} className="question-item">
                  <strong>Q{i + 1}.</strong> {q.prompt}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
