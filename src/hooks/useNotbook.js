import React, { createContext, useContext, useState } from "react";

const NotebookContext = createContext();

export const useNotebook = () => useContext(NotebookContext);

export const NotebookProvider = ({ children }) => {
  const [selectedNotebook, setSelectedNotebook] = useState(null);

  return (
    <NotebookContext.Provider value={{ selectedNotebook, setSelectedNotebook }}>
      {children}
    </NotebookContext.Provider>
  );
};
