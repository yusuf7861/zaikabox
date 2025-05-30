import React, { createContext, useState, useContext } from 'react';

export const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState({});

  // Set loading state for a specific operation
  const setLoading = (operation, isLoading) => {
    setLoadingStates(prev => ({
      ...prev,
      [operation]: isLoading
    }));
  };

  // Check if any operation is loading
  const isAnyLoading = () => {
    return Object.values(loadingStates).some(state => state === true);
  };

  // Get loading state for a specific operation
  const getLoadingState = (operation) => {
    return loadingStates[operation] || false;
  };

  const contextValue = {
    loadingStates,
    setLoading,
    isAnyLoading,
    getLoadingState
  };

  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
    </LoadingContext.Provider>
  );
};

// Custom hook to use the loading context
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};