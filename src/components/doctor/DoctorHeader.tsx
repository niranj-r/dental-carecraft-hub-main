import React, { useState, useEffect } from 'react';
import { Bell, User, Stethoscope, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DoctorHeader = () => {
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Get doctor ID from localStorage (set during login)
  const doctorId = localStorage.getItem('doctorId') || '1'; // Default to 1 for demo

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/api/doctors/profile?doctor_id=${doctorId}`);
        setDoctorProfile(response.data);
      } catch (error) {
        console.error('Error fetching doctor profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, [doctorId]);

  const handleLogout = () => {
    localStorage.removeItem('doctorId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('doctorSession');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Stethoscope className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">CareCraft</h1>
            <p className="text-sm text-gray-500">Doctor Portal</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">
              {loading ? 'Loading...' : (doctorProfile?.name || 'Doctor')}
            </span>
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

export default DoctorHeader;
