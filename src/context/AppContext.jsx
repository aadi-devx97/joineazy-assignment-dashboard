import { createContext, useEffect, useState } from "react";
import { mockUsers, initialAssignments } from "../data/mockData";

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("joineazy-user");

    if (!savedUser) return null;

    try {
      const parsedUser = JSON.parse(savedUser);

      return mockUsers.find((user) => user.id === parsedUser.id) || null;
    } catch {
      return null;
    }
  });

  const [assignments, setAssignments] = useState(() => {
    const savedAssignments = localStorage.getItem("joineazy-assignments");

    if (!savedAssignments) return initialAssignments;

    try {
      return JSON.parse(savedAssignments);
    } catch {
      return initialAssignments;
    }
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("joineazy-user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("joineazy-user");
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(
      "joineazy-assignments",
      JSON.stringify(assignments)
    );
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