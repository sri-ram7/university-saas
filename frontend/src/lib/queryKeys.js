/**
 * Single source of truth for React Query cache keys. Every feature hook
 * imports from here instead of hand-rolling arrays, so invalidation never
 * drifts out of sync with fetch keys.
 */
export const qk = {
  dashboard: () => ['dashboard'],

  students: {
    all: ['students'],
    list: (params) => ['students', 'list', params],
    detail: (id) => ['students', 'detail', id],
  },
  faculty: {
    all: ['faculty'],
    list: (params) => ['faculty', 'list', params],
    detail: (id) => ['faculty', 'detail', id],
  },
  departments: {
    all: ['departments'],
    list: (params) => ['departments', 'list', params],
    detail: (id) => ['departments', 'detail', id],
  },
  courses: {
    all: ['courses'],
    list: (params) => ['courses', 'list', params],
    detail: (id) => ['courses', 'detail', id],
  },
  programs: {
    all: ['programs'],
    list: (params) => ['programs', 'list', params],
  },
  batches: {
    all: ['batches'],
    list: (params) => ['batches', 'list', params],
  },
  semesters: {
    all: ['semesters'],
    list: (params) => ['semesters', 'list', params],
  },
  sections: {
    all: ['sections'],
    list: (params) => ['sections', 'list', params],
  },
  courseOfferings: {
    all: ['courseOfferings'],
    list: (params) => ['courseOfferings', 'list', params],
  },
  enrollments: {
    all: ['enrollments'],
    list: (params) => ['enrollments', 'list', params],
  },
  attendance: {
    all: ['attendance'],
    list: (params) => ['attendance', 'list', params],
  },
  exams: {
    all: ['exams'],
    list: (params) => ['exams', 'list', params],
  },
  marks: {
    all: ['marks'],
    list: (params) => ['marks', 'list', params],
  },
  results: {
    all: ['results'],
    list: (params) => ['results', 'list', params],
  },
  notifications: {
    all: ['notifications'],
    list: () => ['notifications', 'list'],
  },
  audit: {
    all: ['audit'],
    list: () => ['audit', 'list'],
  },
}
