
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Clock, CreditCard, Home, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

const PatientSidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/patient' },
    { icon: Calendar, label: 'Book Appointment', path: '/patient/book' },
    { icon: Clock, label: 'History', path: '/patient/history' },
    { icon: CreditCard, label: 'Payments', path: '/patient/payments' },
    { icon: MessageSquare, label: 'Messages', path: '/patient/messages' },
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

export default PatientSidebar;
