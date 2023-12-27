"use client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./dashboard/page";
import Login from "./login/page";
import { useState, useEffect } from "react";
import { ProgressSpinner } from 'primereact/progressspinner';

export default function Home() {

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time with a timeout
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Adjust the timeout duration as needed

    // Cleanup the timeout to avoid memory leaks
    return () => clearTimeout(loadingTimeout);
  }, []);

  if (isLoading) {
    // Loading spinner or placeholder while the page is loading
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <ProgressSpinner style={{ width: '100px', height: '100px' }} strokeWidth="8" animationDuration=".5s" />
    <h1>Loading ...</h1>
  </div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/dashboard" element={<Dashboard/>}/>
      </Routes>
    </Router>
  );
}
