import { createBrowserRouter, Navigate } from 'react-router-dom'
import DashboardLayout from '@/app/layouts/DashboardLayout'
import AuthLayout from '@/app/layouts/AuthLayout'
import ProtectedRoute from './ProtectedRoute'
import RoleRoute from './RoleRoute'
import { ROUTES } from './routePaths'

import LoginPage from '@/features/auth/pages/LoginPage'
import RegisterPage from '@/features/auth/pages/RegisterPage'
import ForgotPasswordPage from '@/features/auth/pages/ForgotPasswordPage'
import ResetPasswordPage from '@/features/auth/pages/ResetPasswordPage'
import VerifyEmailPage from '@/features/auth/pages/VerifyEmailPage'

import DashboardPage from '@/features/dashboard/pages/DashboardPage'

import StudentsListPage from '@/features/students/pages/StudentsListPage'
import StudentDetailPage from '@/features/students/pages/StudentDetailPage'
import FacultyListPage from '@/features/faculty/pages/FacultyListPage'
import FacultyDetailPage from '@/features/faculty/pages/FacultyDetailPage'
import DepartmentsListPage from '@/features/departments/pages/DepartmentsListPage'
import DepartmentDetailPage from '@/features/departments/pages/DepartmentDetailPage'
import CoursesListPage from '@/features/courses/pages/CoursesListPage'
import CourseDetailPage from '@/features/courses/pages/CourseDetailPage'

import ProgramsListPage from '@/features/programs/pages/ProgramsListPage'
import BatchesListPage from '@/features/batches/pages/BatchesListPage'
import SemestersListPage from '@/features/semesters/pages/SemestersListPage'
import SectionsListPage from '@/features/sections/pages/SectionsListPage'
import CourseOfferingsListPage from '@/features/courseOfferings/pages/CourseOfferingsListPage'
import EnrollmentsListPage from '@/features/enrollments/pages/EnrollmentsListPage'
import AttendanceListPage from '@/features/attendance/pages/AttendanceListPage'
import ExamsListPage from '@/features/exams/pages/ExamsListPage'
import MarksListPage from '@/features/marks/pages/MarksListPage'
import ResultsListPage from '@/features/results/pages/ResultsListPage'
import NotificationsListPage from '@/features/notifications/pages/NotificationsListPage'
import UploadsPage from '@/features/uploads/pages/UploadsPage'
import AuditLogsPage from '@/features/audit/pages/AuditLogsPage'
import ProfilePage from '@/features/profile/pages/ProfilePage'

import NotFoundPage from '@/components/common/NotFoundPage'

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: ROUTES.login, element: <LoginPage /> },
      { path: ROUTES.register, element: <RegisterPage /> },
      { path: ROUTES.forgotPassword, element: <ForgotPasswordPage /> },
      { path: ROUTES.resetPassword, element: <ResetPasswordPage /> },
      { path: ROUTES.verifyEmail, element: <VerifyEmailPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Navigate to={ROUTES.dashboard} replace /> },
          { path: ROUTES.dashboard, element: <DashboardPage /> },

          { path: ROUTES.students, element: <StudentsListPage /> },
          { path: ROUTES.studentDetail, element: <StudentDetailPage /> },
          { path: ROUTES.faculty, element: <FacultyListPage /> },
          { path: ROUTES.facultyDetail, element: <FacultyDetailPage /> },
          { path: ROUTES.departments, element: <DepartmentsListPage /> },
          { path: ROUTES.departmentDetail, element: <DepartmentDetailPage /> },
          { path: ROUTES.courses, element: <CoursesListPage /> },
          { path: ROUTES.courseDetail, element: <CourseDetailPage /> },

          { path: ROUTES.programs, element: <ProgramsListPage /> },
          { path: ROUTES.batches, element: <BatchesListPage /> },
          { path: ROUTES.semesters, element: <SemestersListPage /> },
          { path: ROUTES.sections, element: <SectionsListPage /> },
          { path: ROUTES.courseOfferings, element: <CourseOfferingsListPage /> },
          { path: ROUTES.enrollments, element: <EnrollmentsListPage /> },
          { path: ROUTES.attendance, element: <AttendanceListPage /> },
          { path: ROUTES.exams, element: <ExamsListPage /> },
          { path: ROUTES.marks, element: <MarksListPage /> },
          { path: ROUTES.results, element: <ResultsListPage /> },
          { path: ROUTES.notifications, element: <NotificationsListPage /> },
          { path: ROUTES.uploads, element: <UploadsPage /> },

          {
            element: <RoleRoute allow={['admin']} />,
            children: [{ path: ROUTES.auditLogs, element: <AuditLogsPage /> }],
          },

          { path: ROUTES.profile, element: <ProfilePage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
