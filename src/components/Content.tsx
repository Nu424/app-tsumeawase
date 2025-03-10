import React from 'react';
import { Outlet } from 'react-router-dom';

const Content: React.FC = () => {
  return (
    <div className="ml-16 min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Content; 