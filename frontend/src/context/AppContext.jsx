
import { useEffect, useState } from "react";
import { AppContext } from "./AppContextDefinition";
import {
  mockUsers,
  mockCourses,
  initialAssignments,
  initialGroups,
} from "../data/mockData";

function readStorage(key, fallback) {
  try {
    const savedData = localStorage.getItem(key);
    return savedData ? JSON.parse(savedData) : fallback;
  } catch (error) {
    console.error(`Failed to read ${key}:`, error);
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Failed to save ${key}:`, error);
    return false;
  }
}

function createSessionToken(userId) {
  return `mock-token-${userId}-${Date.now()}`;
}

export function AppProvider({ children }) {
  // Load users and migrate older demo accounts.
  const [users, setUsers] = useState(() => {
    const savedUsers = readStorage("joineazy-v2-users", null);

    if (!savedUsers) {
      return mockUsers.map((user) => ({
        ...user,
        password: "Demo123!",
      }));
    }

    return savedUsers.map((user) => ({
      ...user,
      password: user.password || "Demo123!",
    }));
  });

  const [session, setSession] = useState(() =>
    readStorage("joineazy-v2-session", null)
  );

  const currentUser =
    users.find((user) => user.id === session?.userId) || null;

  const [courses, setCourses] = useState(() =>
    readStorage("joineazy-v2-courses", mockCourses)
  );

  const [assignments, setAssignments] = useState(() =>
    readStorage("joineazy-v2-assignments", initialAssignments)
  );

  const [groups, setGroups] = useState(() =>
    readStorage("joineazy-v2-groups", initialGroups)
  );

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

  // Create a session for an authenticated user.
  const startSession = (user) => {
    const newSession = {
      userId: user.id,
      token: createSessionToken(user.id),
      createdAt: new Date().toISOString(),
    };

    setSession(newSession);
  };

  // Authenticate using email and password.
  const login = (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return {
        success: false,
        error: "Please enter your email and password.",
      };
    }

    const user = users.find(
      (item) => item.email.toLowerCase() === normalizedEmail
    );

    if (!user || user.password !== password) {
      return {
        success: false,
        error: "Invalid email or password.",
      };
    }

    startSession(user);

    return {
      success: true,
      user,
    };
  };

  // Register a new student or professor.
  const register = ({ name, email, password, role }) => {
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedName || !normalizedEmail || !password) {
      return {
        success: false,
        error: "Please complete all required fields.",
      };
    }

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

    if (password.length < 8) {
      return {
        success: false,
        error: "Password must contain at least 8 characters.",
      };
    }

    const newUser = {
      id: `${role}-${Date.now()}`,
      name: normalizedName,
      email: normalizedEmail,
      password,
      role,
    };

    setUsers((previousUsers) => [...previousUsers, newUser]);

    // Registration also creates the user's session.
    startSession(newUser);

    return {
      success: true,
      user: newUser,
    };
  };

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
