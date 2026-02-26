import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useSelector } from "react-redux";
import { useMessage } from "../context/MessageContext"; 



export default function QuizPage() {
  const { showSuccess, showError } = useMessage();

  const loginDetails = useSelector((state) => state.auth.user);
  const {state}=useLocation();

  console.log(state,":::::::::::::assignmentName::::::::::::::::::::::::::::::");

  // ✅ IDs
  const studentId = Number(loginDetails.loginId);
  const assessmentId = Number(loginDetails.loginId); // as per your current logic
  const studentName = loginDetails?.loginId || "Srikanth";

  const navigate = useNavigate();

  // ✅ State
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const[LoginStuDetails,setLoginStuDetails]=useState("");

  // --------------------------------------------------
  // LOAD QUESTIONS ONLY (NO STATUS UPDATE HERE ❌)
  // --------------------------------------------------
  useEffect(() => {
      let loginstuDetails=JSON.parse(localStorage.getItem('studentsInformation'));
     setLoginStuDetails(loginstuDetails);
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        import.meta.env.VITE_API_BASE_URL+`/notify/getQuestionDetails`
      );

      if (Array.isArray(res.data)) {
        setQuestions(res.data);
      } else {
        setQuestions([]);
        setError("No questions available");
      }
    } catch(err) {
       showError(err);
      setError("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // START ASSESSMENT → ONLY ON FIRST CLICK
  // --------------------------------------------------
  const startAssessment = async () => {
    await axios.put(
      import.meta.env.VITE_API_BASE_URL+"/api/student/start-assessment",
      {
        assessmentId:1,
          studentId:loginDetails?.userDetails?.loginid,
      }
    );
  };

  // --------------------------------------------------
  // SELECT ANSWER (IN_PROGRESS)
  // --------------------------------------------------
  const selectAnswer = async (questionId, option) => {

    setAnswers((prev) => ({
      ...prev,
      [questionId]: option
    }));

    console.log(answers,"::::::::::::::answers:::::::::::::::::")

    // 🔥 Trigger IN_PROGRESS only once
    if (!assessmentStarted) {
      await startAssessment();
      setAssessmentStarted(true);
    }
  };

  // --------------------------------------------------
  // SUBMIT QUIZ (COMPLETED)
  // --------------------------------------------------
  const submitQuiz = async () => {
    try {
      const res = await axios.post(
        import.meta.env.VITE_API_BASE_URL+"/notify/submitquiz",
        {
          assessmentId:1,
          studentId:loginDetails?.userDetails?.loginid,
          answers
        }
      );

      const score = res.data;

      navigate(`/chapter/${assessmentId}/result`, {
        state: { score,state }
      });

    } catch(err) {
       showError(err);
      showSuccess("Failed to submit quiz");
    }
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------
  if (loading) {
    return <div className="loader">Loading quiz...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <>
      <Navbar />

      <div className="main-layout">
        <Sidebar />

        <div className="content-area">
          <div className="quiz-container">

            {/* HEADER */}
            <div className="quiz-header">
              <h2>Assessment Quiz</h2>
              <span>Student Id: {loginDetails?.userDetails?.loginid}</span>
  <span>Name:-{loginDetails?.userDetails?.fullName}</span>

            </div>

            {/* QUESTIONS */}
            {questions.map((q, index) => (
              <div className="quiz-card" key={q.id}>
                <h3>Q{index + 1}. {q.prompt}</h3>

                {["A", "B", "C", "D"].map((opt) => (
                  <label
                    key={opt}
                    className={`quiz-option ${
                      answers[q.questionId] === opt ? "active" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      checked={answers[q.questionId] === opt}
                      onChange={() => selectAnswer(q.questionId, opt)}
                    />
                    {q[`option${opt}`]}
                  </label>
                ))}
              </div>
            ))}

            {/* SUBMIT */}
            <div className="quiz-footer">
              <button
                className="quiz-submit"
                disabled={
                  questions.length === 0 ||
                  Object.keys(answers).length !== questions.length
                }
                onClick={submitQuiz}
              >
                Submit Assessment
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
