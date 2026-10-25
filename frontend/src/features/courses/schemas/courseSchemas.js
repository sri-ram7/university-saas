import { z } from 'zod'

// NOTE: the backend's courseValidator requires `semester` and `faculty` on
// create/update even though the Course model doesn't persist either field
// (only name/code/credits/department are stored). Both are still required
// here because the request is rejected by the validator otherwise.
export const courseSchema = z.object({
  name: z.string().min(1, 'Course name is required'),
  code: z.string().min(1, 'Course code is required'),
  credits: z.coerce.number().int().min(1).max(10, 'Credits must be between 1 and 10'),
  semester: z.coerce.number().int().min(1).max(8, 'Semester must be between 1 and 8'),
  department: z.string().min(1, 'Department is required'),
  faculty: z.string().min(1, 'Faculty is required'),
})
