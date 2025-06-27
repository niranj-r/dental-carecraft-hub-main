
import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const NotificationDropdown = () => {
  const notifications = [
    {
      id: 1,
      message: "You have an appointment tomorrow at 10:30 AM",
      time: "2 hours ago",
      unread: true
    },
    {
      id: 2,
      message: "Don't forget to complete your payment",
      time: "1 day ago",
      unread: true
    },
    {
      id: 3,
      message: "Your prescription is ready to download",
      time: "2 days ago",
      unread: false
    }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {notifications.some(n => n.unread) && (
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-2">
        <div className="font-semibold text-sm text-gray-900 px-2 py-2 border-b">
          Notifications
        </div>
        {notifications.map((notification) => (
          <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3 space-y-1">
            <p className="text-sm text-gray-900">{notification.message}</p>
            <p className="text-xs text-gray-500">{notification.time}</p>
            {notification.unread && (
              <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
