
# Joineazy — Student, Group & Assignment Management Dashboard

A responsive, role-based assignment management dashboard built for the **Joineazy Frontend Intern — Round 2** technical assessment.

Joineazy provides separate workspaces for professors and students to manage courses, assignments, groups, deadlines and submission acknowledgements.

## Live Demo

- **Application:** https://joineazy-assignment-dashboard-two.vercel.app
- **GitHub:** https://github.com/aadi-devx97/joineazy-assignment-dashboard

## Features

### Authentication & Access
- Separate Professor and Student roles.
- Login and registration with form validation.
- Role-based protected routes.
- Simulated session token and logout.
- Demo accounts for testing.

### Professor Workspace
- Professor dashboard with assignment statistics.
- View courses and enrolled students.
- Create and edit course assignments.
- Set assignment descriptions, deadlines, OneDrive resource links and submission types.
- Support individual and group assignments.
- Track acknowledgement progress with progress bars.
- View student-by-student acknowledgement status.
- See acknowledgement timestamps and group information.

### Student Workspace
- View enrolled courses and assignments.
- Track assignment deadlines and acknowledgement status.
- Open assignment resources through OneDrive links.
- Acknowledge individual assignments through a confirmation dialog.
- View group acknowledgement status and timestamps.
- Create groups and join existing groups.
- Only group leaders can acknowledge group assignments.
- Students without a group receive a direct Create or Join Group action.

### General
- Responsive layouts.
- Light and dark themes.
- Persistent demo data using browser localStorage.
- Form validation, feedback messages and empty states.
- Reusable components and shared application state.

## Tech Stack

- React
- Vite
- JavaScript
- Tailwind CSS
- React Router
- Context API
- Lucide React
- Browser localStorage

## Project Structure

```text
joineazy-assignment-dashboard/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── dashboard/
│   │   │   └── layout/
│   │   ├── context/
│   │   ├── data/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Getting Started

### Prerequisites
- Node.js
- npm
- Git

### Installation

Clone the repository:

```bash
git clone https://github.com/aadi-devx97/joineazy-assignment-dashboard.git
```

Navigate to the frontend directory:

```bash
cd joineazy-assignment-dashboard/frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Demo Login Credentials

All seeded demo accounts use the following password:

**Password:** `Demo123!`

| Role | Name | Email |
|---|---|---|
| Professor | Alex Morgan | alex@joineazy.com |
| Professor | Sarah Chen | sarah@joineazy.com |
| Student | Aarav Sharma | aarav@student.com |
| Student | Ishita Verma | ishita@student.com |
| Student | Rohan Mehta | rohan@student.com |
| Student | Ananya Gupta | ananya@student.com |
| Student | Kabir Singh | kabir@student.com |

Select the appropriate role on the login screen and use the corresponding credentials.

## Architecture & Design Decisions

- **Context API:** Shares authentication, courses, assignments, groups and user data across the application.
- **Protected routes:** Restricts professor and student pages according to the current user's role.
- **localStorage:** Persists demo accounts, sessions, courses, assignments and groups across page reloads.
- **Reusable components:** Keeps dashboard layouts and common interface elements consistent.
- **Role-based workflows:** Separates professor assignment management from student acknowledgement and group participation.
- **Responsive design:** Uses Tailwind CSS responsive utilities to support different screen sizes.

## Assignment Acknowledgement Logic

### Individual Assignments
Each student's acknowledgement is stored against their user ID, together with a timestamp.

### Group Assignments
Acknowledgements are stored against the group ID. Only the group leader can acknowledge an assignment. The acknowledgement status and timestamp are then visible to all group members.

## Important Implementation Notes

This is a frontend assessment project using mock authentication and browser-based localStorage persistence.

- No production backend or database is connected.
- Authentication uses a simulated token rather than a real JWT authentication service.
- Data is stored locally in the browser.
- OneDrive resources are opened through their supplied links; actual file upload integration is not implemented.
- The application demonstrates frontend role-based workflows, not production server-side authorization.

## Author

**Aadi Jain**

- GitHub: https://github.com/aadi-devx97
- LinkedIn: https://www.linkedin.com/in/aadi-jain-a043782b8/
- Portfolio: https://aadi-jain-portfolio.netlify.app/
