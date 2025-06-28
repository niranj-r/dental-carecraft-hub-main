import React, { useEffect, useState } from 'react';
import { Bell, User, Heart, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NotificationDropdown from './NotificationDropdown';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PatientHeader = () => {
  const [patientName, setPatientName] = useState('Patient');
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.patient_id) {
      axios.get('http://127.0.0.1:5000/api/patients/' + user.patient_id)
        .then(res => setPatientName(res.data.name))
        .catch(() => setPatientName('Patient'));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('patientId');
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">CareCraft</h1>
            <p className="text-sm text-gray-500">Patient Portal</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <NotificationDropdown />
          <Button variant="ghost" size="sm" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">{patientName}</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className="flex items-center space-x-2 text-red-600 hover:text-red-700"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default PatientHeader;
