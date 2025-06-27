
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Users, FileText, Home, Clock, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

const DoctorSidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/doctor' },
    { icon: Calendar, label: 'Today\'s Schedule', path: '/doctor/schedule' },
    { icon: Users, label: 'Patients', path: '/doctor/patients' },
    { icon: FileText, label: 'Treatment Notes', path: '/doctor/notes' },
    { icon: Clock, label: 'Appointment History', path: '/doctor/history' },
    { icon: BarChart3, label: 'Reports', path: '/doctor/reports' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                isActive 
                  ? "bg-blue-50 text-blue-600 border border-blue-200" 
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default DoctorSidebar;
