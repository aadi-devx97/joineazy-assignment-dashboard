# Joineazy — Assignment & Review Dashboard

A role-based assignment management dashboard built as part of the Joineazy Frontend Developer Intern technical assessment.

The application provides separate experiences for administrators and students, allowing admins to manage assignments and monitor submissions while students can track and confirm their assignment submissions.

## Features

### Admin
- Create, edit and delete assignments.
- Assign work to all students or selected students.
- Track individual student submission statuses.
- Monitor class completion rates.
- Search, filter and sort assignments.
- View student-level progress.

### Student
- View assigned assignments.
- Track overall submission progress.
- Access Google Drive resources.
- Confirm assignment submissions through a two-step confirmation flow.
- Filter and sort assignments.

### General
- Role-based mock login with seeded users.
- Persistent application data using localStorage.
- Light and dark themes.
- Responsive desktop and mobile layouts.
- Form validation and empty states.

## Tech Stack

- React
- Vite
- JavaScript
- Tailwind CSS
- React Router
- Lucide React
- Browser localStorage

## Getting Started

### Prerequisites
- Node.js
- npm

### Installation

Clone the repository:

```bash
git clone https://github.com/aadi-devx97/joineazy-assignment-dashboard.git
```

Navigate into the project:

```bash
cd joineazy-assignment-dashboard
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run lint` | Run ESLint |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build |

## Demo Accounts

The application uses seeded mock accounts. No real authentication is implemented.

### Admin
- Alex Morgan — `alex@joineazy.com`
- Sarah Chen — `sarah@joineazy.com`

### Students
- Aarav Sharma — `aarav@student.com`
- Ishita Verma — `ishita@student.com`
- Rohan Mehta — `rohan@student.com`
- Ananya Gupta — `ananya@student.com`
- Kabir Singh — `kabir@student.com`

Use the login screen to select a demo account.

## Project Structure

```text
src/
├── assets/
├── components/
│   ├── common/
│   ├── dashboard/
│   └── layout/
├── context/
├── data/
├── hooks/
├── pages/
├── utils/
├── App.jsx
├── main.jsx
└── index.css
```

## Architecture & Design Decisions

- Context API is used for shared application and theme state.
- localStorage persists the selected demo user, assignments and theme preference.
- Reusable components keep dashboard layouts and assignment workflows consistent.
- Admin and student experiences are separated by role-based routing.
- The interface uses an olive and terracotta visual palette with a light-first design and dark theme support.

## Important Note

This is a frontend assessment project using mock users and browser-based storage. It does not implement a production backend or real authentication.

## Author

**Aadi Jain**

- GitHub: https://github.com/aadi-devx97
- LinkedIn: https://www.linkedin.com/in/aadi-jain-a043782b8/
- Portfolio: https://aadi-jain-portfolio.netlify.app/
