
import { useEffect, useState } from "react";
import { AppContext } from "./AppContextDefinition";
import {
  mockUsers,
  mockCourses,
  initialAssignments,
  initialGroups,
} from "../data/mockData";

// Safely read data from localStorage.
function readStorage(key, fallback) {
  try {
    const savedData = localStorage.getItem(key);

    if (!savedData) return fallback;

    return JSON.parse(savedData);
  } catch (error) {
    console.error(`Failed to read ${key}:`, error);
    return fallback;
  }
}

// Safely persist data to localStorage.
function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Failed to save ${key}:`, error);
    return false;
  }
}

// Create a simulated session token for this mock application.
function createSessionToken(userId) {
  return `mock-token-${userId}-${Date.now()}`;
}

export function AppProvider({ children }) {
  // Users include the seeded demo accounts and newly registered users.
  const [users, setUsers] = useState(() =>
    readStorage("joineazy-v2-users", mockUsers)
  );

  // Restore the previously authenticated session.
  const [session, setSession] = useState(() =>
    readStorage("joineazy-v2-session", null)
  );

  const currentUser =
    users.find((user) => user.id === session?.userId) || null;

  // Course data.
  const [courses, setCourses] = useState(() =>
    readStorage("joineazy-v2-courses", mockCourses)
  );

  // Assignment data.
  const [assignments, setAssignments] = useState(() =>
    readStorage("joineazy-v2-assignments", initialAssignments)
  );

  // Student groups.
  const [groups, setGroups] = useState(() =>
    readStorage("joineazy-v2-groups", initialGroups)
  );

  // Persist application data whenever it changes.
  useEffect(() => {
    writeStorage("joineazy-v2-users", users);
  }, [users]);

  useEffect(() => {
    writeStorage("joineazy-v2-session", session);
  }, [session]);

  useEffect(() => {
    writeStorage("joineazy-v2-courses", courses);
  }, [courses]);

  useEffect(() => {
    writeStorage("joineazy-v2-assignments", assignments);
  }, [assignments]);

  useEffect(() => {
    writeStorage("joineazy-v2-groups", groups);
  }, [groups]);

  // Log in using a selected account.
  const login = (userId) => {
    const user = users.find((item) => item.id === userId);

    if (!user) {
      return {
        success: false,
        error: "Account not found.",
      };
    }

    const newSession = {
      userId: user.id,
      token: createSessionToken(user.id),
      createdAt: new Date().toISOString(),
    };

    setSession(newSession);

    return {
      success: true,
      user,
    };
  };

  // Register a new student or professor.
  const register = ({ name, email, password, role }) => {
    const normalizedEmail = email.trim().toLowerCase();

    if (
      users.some(
        (user) => user.email.toLowerCase() === normalizedEmail
      )
    ) {
      return {
        success: false,
        error: "An account with this email already exists.",
      };
    }

    if (!["student", "professor"].includes(role)) {
      return {
        success: false,
        error: "Please select a valid account role.",
      };
    }

    const newUser = {
      id: `${role}-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      password,
      role,
    };

    setUsers((previousUsers) => [...previousUsers, newUser]);

    return {
      success: true,
      user: newUser,
    };
  };

  // Clear the simulated authentication session.
  const logout = () => {
    setSession(null);
  };

  return (
    <AppContext.Provider
      value={{
        users,
        currentUser,
        session,
        courses,
        setCourses,
        assignments,
        setAssignments,
        groups,
        setGroups,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
