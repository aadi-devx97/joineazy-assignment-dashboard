import { useEffect, useState } from "react";
import { mockUsers, initialAssignments } from "../data/mockData";

import { AppContext } from "./AppContextDefinition";

function readStorage(key, fallback) {
  try {
    const savedData = localStorage.getItem(key);

    if (!savedData) return fallback;

    return JSON.parse(savedData);
  } catch (error) {
    console.error(`Failed to read ${key} from localStorage:`, error);

    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Failed to save ${key} to localStorage:`, error);

    return false;
  }
}

function isValidAssignmentList(data) {
  return (
    Array.isArray(data) &&
    data.every(
      (assignment) =>
        assignment &&
        typeof assignment.id === "string" &&
        typeof assignment.createdBy === "string" &&
        Array.isArray(assignment.assignedTo) &&
        assignment.submissions &&
        typeof assignment.submissions === "object" &&
        !Array.isArray(assignment.submissions)
    )
  );
}

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = readStorage("joineazy-user", null);

    if (!savedUser || typeof savedUser.id !== "string") {
      return null;
    }

    return mockUsers.find((user) => user.id === savedUser.id) || null;
  });

  const [assignments, setAssignments] = useState(() => {
    const savedAssignments = readStorage(
      "joineazy-assignments",
      initialAssignments
    );

    return isValidAssignmentList(savedAssignments)
      ? savedAssignments
      : initialAssignments;
  });

  useEffect(() => {
    if (currentUser) {
      writeStorage("joineazy-user", currentUser);
    } else {
      try {
        localStorage.removeItem("joineazy-user");
      } catch (error) {
        console.error("Failed to remove saved user:", error);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    writeStorage("joineazy-assignments", assignments);
  }, [assignments]);

  const login = (userId) => {
    const user = mockUsers.find((user) => user.id === userId);

    if (user) {
      setCurrentUser(user);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        assignments,
        setAssignments,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}