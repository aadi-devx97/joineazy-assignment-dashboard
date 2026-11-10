
export const mockUsers = [
  {
    id: "professor-1",
    name: "Alex Morgan",
    email: "alex@joineazy.com",
    role: "professor",
  },
  {
    id: "professor-2",
    name: "Sarah Chen",
    email: "sarah@joineazy.com",
    role: "professor",
  },
  {
    id: "student-1",
    name: "Aarav Sharma",
    email: "aarav@student.com",
    role: "student",
  },
  {
    id: "student-2",
    name: "Ishita Verma",
    email: "ishita@student.com",
    role: "student",
  },
  {
    id: "student-3",
    name: "Rohan Mehta",
    email: "rohan@student.com",
    role: "student",
  },
  {
    id: "student-4",
    name: "Ananya Gupta",
    email: "ananya@student.com",
    role: "student",
  },
  {
    id: "student-5",
    name: "Kabir Singh",
    email: "kabir@student.com",
    role: "student",
  },
];

export const mockCourses = [
  {
    id: "course-1",
    title: "Full Stack Web Development",
    code: "FSWD-101",
    description:
      "Learn modern frontend and backend development through practical assignments.",
    professorId: "professor-1",
    studentIds: [
      "student-1",
      "student-2",
      "student-3",
    ],
    createdAt: "2026-11-01T09:00:00.000Z",
  },
  {
    id: "course-2",
    title: "Artificial Intelligence Fundamentals",
    code: "AIF-201",
    description:
      "Explore artificial intelligence concepts, applications and practical implementations.",
    professorId: "professor-2",
    studentIds: [
      "student-2",
      "student-3",
      "student-4",
      "student-5",
    ],
    createdAt: "2026-11-02T09:00:00.000Z",
  },
];

export const initialAssignments = [];

export const initialGroups = [];

export const initialRegistrations = [];
