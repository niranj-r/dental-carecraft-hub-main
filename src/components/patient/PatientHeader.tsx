
import React from 'react';
import { Bell, User, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NotificationDropdown from './NotificationDropdown';

const PatientHeader = () => {
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
            <span className="hidden sm:inline">Riya Sharma</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default PatientHeader;
