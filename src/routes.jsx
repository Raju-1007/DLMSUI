import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CourseList from './pages/CourseList'
import CourseView from './pages/CourseView'
import ChapterView from './pages/ChapterView'
import QuizPage from './pages/QuizPage'
import ResultPage from './pages/ResultPage'
import ProgressReport from './pages/ProgressReport'
import GradeBook from './pages/GradeBook'
import FeedbackForm from './pages/FeedbackForm'
import NotificationCenter from './pages/NotificationCenter'
import HelpDesk from './pages/HelpDesk'
import TeacherDashboard from './pages/TeacherDashboard'
import AdminDashboard from './pages/AdminDashboard'
import Assignments from './pages/Assignments'

import AssignGrade from './pages/AssignGrade'
import AssignTopic from './pages/AssignTopic'
import  Register from './pages/Register'
import Achievements from './pages/Achievements'
import LearningMaterials from './pages/LearningMaterials'
import AttendanceTracker from './pages/AttendanceTracker'
import MyTimetable from './pages/MyTimetable'
import TeacherAssignments from './pages/TeacherAssignments'
import TeacherAttendance from './pages/TeacherAttendance'
import TeacherMaterials from './pages/TeacherMaterials'
import TeacherGradebook from './pages/TeacherGradebook'
import TeacherTimetable from './pages/TeacherTimetable'
import TeacherNotifications from './pages/TeacherNotifications'
import AdminStudents from './pages/AdminStudents'
import AdminTeachers from './pages/AdminTeachers'
import AdminCourses from './pages/AdminCourses'
import AdminTeacherAttendance from './pages/AdminTeacherAttendance'
import AdminNotifications from './pages/AdminNotifications'
import AdminHelpDesk from './pages/AdminHelpDesk'
import ManagersTeachers from './pages/ManagersTeachers'
import AdminManageStudents from './pages/AdminManageStudents'
import AdminTeacherSyllabus from './pages/AdminTeacherSyllabus'
import AdminSettings from './pages/AdminSettings'
import TeacherHelpDesk from './pages/TeacherHelpDesk'
import SuperAdminDashboard from './pages/SuperADminDashboard'
import SystemAnalyticsPageSuperAdmin from './pages/SystemAnalyticsPageSuperAdmin'
import SuperAdminDistrictManagementPage from './pages/SuperAdminDistrictManagementPage'
import DepartmentLogin from './pages/DepartmentLogin'
import SuperAdminLogin from './pages/SuperAdminLogin'
import SuperAdminApproval from './pages/SuperAdminApproval'
import StudentAttendance from './pages/StudentAttendance'
import MyGrades from './pages/MyGrades'
import TeacherQuestionBuilder from './pages/TeacherQuestionBuilder'
import TeacherDetails from './pages/TeacherDetails'
import ReceiveNotifications from './pages/ReceiveNotifications'
import StudentProfile from './pages/StudentProfile'
import ScheduleParentMeeting from './pages/ScheduleParentMeeting'
import TeacherProfile from './pages/TeacherProfile'
import AdminProfile from './pages/AdminProfile'
import SuperAdminProfile from './pages/SuperAdminProfile'
import AdminLoginActivity from './pages/AdminLoginActivity'
import SuperAdminLoginActivity from './pages/SuperAdminLoginActivity'
import TeacherLoginActivity from './pages/TecaherLoginActivity'
import Calnderview from './pages/Calnderview'
import ChatWidget from './components/ChatWidget'

export const router = createBrowserRouter([
  { path:'/', element:<Login/> },
  { path:'/register', element:<Register/> },
  { path:'/dashboard', element:<Dashboard/> },
  { path:'/courses', element:<CourseList/> },
  { path:'/course/:id', element:<CourseView/> },
  // { path:'/course/:id/chapter/:chapterId', element:<ChapterView/> },
  // { path:'/chapter/:id/quiz', element:<QuizPage/> },
       { path:'/chapter', element:<QuizPage/> },
  { path:'/chapter/:id/result', element:<ResultPage/> },
  { path:'/progress', element:<ProgressReport/> },
  { path:'/grades', element:<GradeBook/> },
  { path:'/chapter/:id/feedback', element:<FeedbackForm/> },
  { path:'/notifications', element:<NotificationCenter/> },
  { path:'/help', element:<HelpDesk/> },
  { path:'/teacher/dashboard', element:<TeacherDashboard/> },
  { path:'/admin/dashboard', element:<AdminDashboard/> },
  {path:'/Assignments', element:<Assignments/>},
  // {path:'/giveassignments',element:<GiveAssignments/>},
   {path:'/mytimetable',element:<MyTimetable/>},
  {path:'/Assign Grade',element:<AssignGrade/>},
  {path:'/Assigntopic',element:<AssignTopic/>},
  // { path:'/chapterviews', element:<ChapterView/> },
  
  {path:'/chapterviews/:courseId/:title',element:<ChapterView />},


  { path:'/myachveiemnts', element:<Achievements/> },
  { path:'/leraningmaterails', element:<LearningMaterials/> },
   { path:'/myAttendance', element:<AttendanceTracker/> },
   { path:'/teacher/Helpdisk', element:<TeacherHelpDesk/> },

   { path:'/teacher/assignments', element:<TeacherAssignments/> },
   { path:'/teacher/attendance', element:<TeacherAttendance/> },
    { path:'/teacher/materials', element:<TeacherMaterials/> },
    { path:'/teacher/gradebook', element:<TeacherGradebook/> },
    { path:'/teacher/timetable', element:<TeacherTimetable/> },
    { path:'/teacher/notifications', element:<TeacherNotifications/> },


    { path:'/admin/students', element:<AdminStudents/> },
    { path:'/admin/teachers', element:<AdminTeachers/> },
    { path:'/admin/courses', element:<AdminCourses/> },
    { path:'/admin/teacherssyllabus', element:<AdminTeacherSyllabus/> },
    
    // { path:'/admin/teachers"', element:<AdminAssignments/> },
    { path:'/admin/teachersattedance', element:<AdminTeacherAttendance/> },
    { path:'/admin/adminhandileteachers', element:<ManagersTeachers/> },
    { path:'/admin/notifications', element:<AdminNotifications/> },
    { path:'/admin/settings', element:<AdminSettings/> },
    { path:'/admin/helpDisk', element:<AdminHelpDesk/> },
    { path:'/admin/AdminManageStudents', element:<AdminManageStudents/> },
    { path:'/SuperAdminDashboard', element:<SuperAdminDashboard/> },
    { path:'/SystemAnalyticsPageSuperAdmin', element:<SystemAnalyticsPageSuperAdmin/> },
   { path:'/SuperAdminDistrictManagementPage', element:<SuperAdminDistrictManagementPage/> },
    { path:'/departmentLogin', element:<DepartmentLogin/> },
    { path:'/superAdminLogin', element:<SuperAdminLogin/> },
        { path:'/superAdminApproval', element:<SuperAdminApproval/> },
        { path:'/studentAttendance', element:<StudentAttendance/> },
   

      { path:'/MyGrades', element:<MyGrades/> },
      { path:'/instructor-details', element:<TeacherDetails/> },

      { path:'/receiveNotifications', element:<ReceiveNotifications/> },

      

       { path:'/teacherQuestionBuilder/:getstudentId', element:<TeacherQuestionBuilder/> }, 
       { path:'/student-profile', element:<StudentProfile/> }, 
        { path:'/scheduleParentMeeting', element:<ScheduleParentMeeting/> }, 
         { path:'/teacherProfile', element:<TeacherProfile/> }, 
          { path:'/adminProfile', element:<AdminProfile/> }, 
           { path:'/superAdminProfile', element:<SuperAdminProfile/> }, 

            { path:'/adminLoginActivity', element:<AdminLoginActivity/> }, 

            { path:'/superAdminLoginActivity', element:<SuperAdminLoginActivity/> }, 

            { path:'/teacherLoginActivity', element:<TeacherLoginActivity/>},
            { path:'/calnderview', element:<Calnderview/>},

             { path:'/chatWidget', element:<ChatWidget/>}
    

            


      
])



 