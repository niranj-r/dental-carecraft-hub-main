
import React from 'react';
import { Outlet } from 'react-router-dom';
import PatientHeader from './PatientHeader';
import PatientSidebar from './PatientSidebar';

const PatientLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PatientHeader />
      <div className="flex">
        <PatientSidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PatientLayout;
