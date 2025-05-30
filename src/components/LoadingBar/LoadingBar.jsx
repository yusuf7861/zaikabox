import React from 'react';
import { useLoading } from '../../context/LoadingContext';
import './LoadingBar.css';

const LoadingBar = () => {
  const { isAnyLoading } = useLoading();
  
  // If nothing is loading, don't render the component
  if (!isAnyLoading()) {
    return null;
  }
  
  return (
    <div className="loading-bar-container">
      <div className="loading-bar"></div>
    </div>
  );
};

export default LoadingBar;