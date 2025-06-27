
import React from 'react';
import { Outlet } from 'react-router-dom';
import DoctorHeader from './DoctorHeader';
import DoctorSidebar from './DoctorSidebar';

const DoctorLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <DoctorHeader />
      <div className="flex">
        <DoctorSidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DoctorLayout;
