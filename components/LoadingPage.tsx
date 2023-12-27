// components/LoadingPage.tsx
import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

const LoadingPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <ProgressSpinner style={{width: '350px', height: '350px'}} strokeWidth="8" animationDuration=".5s"/>
    </div>
  );
};

export default LoadingPage;
