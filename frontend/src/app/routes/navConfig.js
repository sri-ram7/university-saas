import {
  FiGrid, FiUsers, FiUserCheck, FiLayers, FiBookOpen, FiCalendar,
  FiClipboard, FiCheckSquare, FiEdit3, FiFileText, FiAward, FiBell,
  FiUploadCloud, FiShield, FiHash, FiBriefcase,
} from 'react-icons/fi'
import { ROUTES } from './routePaths'

const ALL = ['admin', 'faculty', 'student']

/**
 * Sidebar nav tree. `roles` gates visibility. Sections with a single item
 * render flat; sections with multiple items render as a group with heading.
 */
export const NAV_SECTIONS = [
  {
    items: [{ label: 'Dashboard', to: ROUTES.dashboard, icon: FiGrid, roles: ALL }],
  },
  {
    heading: 'Academics',
    items: [
      { label: 'Departments', to: ROUTES.departments, icon: FiBriefcase, roles: ALL },
      { label: 'Programs', to: ROUTES.programs, icon: FiLayers, roles: ALL },
      { label: 'Batches', to: ROUTES.batches, icon: FiHash, roles: ALL },
      { label: 'Semesters', to: ROUTES.semesters, icon: FiCalendar, roles: ALL },
      { label: 'Sections', to: ROUTES.sections, icon: FiClipboard, roles: ALL },
    ],
  },
  {
    heading: 'People',
    items: [
      { label: 'Students', to: ROUTES.students, icon: FiUsers, roles: ['admin', 'faculty'] },
      { label: 'Faculty', to: ROUTES.faculty, icon: FiUserCheck, roles: ALL },
    ],
  },
  {
    heading: 'Courses',
    items: [
      { label: 'Courses', to: ROUTES.courses, icon: FiBookOpen, roles: ALL },
      { label: 'Course Offerings', to: ROUTES.courseOfferings, icon: FiEdit3, roles: ALL },
    ],
  },
  {
    heading: 'Academic Records',
    items: [
      { label: 'Enrollments', to: ROUTES.enrollments, icon: FiClipboard, roles: ALL },
      { label: 'Attendance', to: ROUTES.attendance, icon: FiCheckSquare, roles: ALL },
      { label: 'Exams', to: ROUTES.exams, icon: FiFileText, roles: ALL },
      { label: 'Marks', to: ROUTES.marks, icon: FiEdit3, roles: ALL },
      { label: 'Results', to: ROUTES.results, icon: FiAward, roles: ALL },
    ],
  },
  {
    items: [
      { label: 'Notifications', to: ROUTES.notifications, icon: FiBell, roles: ALL },
      { label: 'Uploads', to: ROUTES.uploads, icon: FiUploadCloud, roles: ALL },
      { label: 'Audit Logs', to: ROUTES.auditLogs, icon: FiShield, roles: ['admin'] },
    ],
  },
]
