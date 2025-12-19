// src/utils/ProtectedRoute.jsx (UPDATED FOR TOKEN PERSISTENCE)

import { useEffect } from 'react'; // 🎯 NEW: Import useEffect
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom"; // 🎯 NEW: Import useNavigate
import { setAuthToken } from "../api/apiClient"; // 🎯 NEW: Import setAuthToken

export default function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    
    // Scenario 1: Redux state is false (due to refresh), but token is in storage.
    if (!isAuthenticated && token) {
        // Re-apply token to Axios for API calls
        setAuthToken(token);
        
        // NOTE: At this point, you should ideally have an action to re-validate 
        // the token with the backend and set isAuthenticated=true in Redux. 
        // Without that step, API calls from Dashboard will be authenticated, 
        // but if the token is *expired* it will still fail and might trigger 
        // a silent redirect within your API error interceptor.
        
        // For now, we trust the token and set the Axios header.
    } 
    // Scenario 2: No token, not authenticated.
    else if (!isAuthenticated && !token) {
        // Clear any lingering token in Axios headers
        setAuthToken(null);
        // This redirect is handled by the return statement below, but good practice.
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}