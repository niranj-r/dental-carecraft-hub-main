import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Download, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import axios from 'axios';

const AppointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/appointments')
      .then(res => setAppointments(res.data))
      .catch(err => console.error(err));
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'pending': return '⏳';
      case 'cancelled': return '❌';
      default: return '📅';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointment History</h1>
          <p className="text-gray-600 mt-1">Your dental care journey timeline</p>
        </div>
        
        <Button variant="outline" className="flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Download Report</span>
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-sm text-gray-600">Total Visits</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">10</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">2</div>
              <div className="text-sm text-gray-600">Upcoming</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">₹12,500</div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {appointments.map((appointment) => (
          <Card key={appointment.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <span>{getStatusIcon(appointment.status)}</span>
                  <span>{appointment.type}</span>
                </CardTitle>
                <Badge className={getStatusColor(appointment.status)}>
                  {appointment.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{appointment.date}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{appointment.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>{appointment.doctor}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="text-sm">
                    <span className="font-medium text-gray-900">Treated Area: </span>
                    <span className="text-gray-600">{appointment.tooth}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-gray-900">Cost: </span>
                    <span className="text-gray-600">₹{appointment.cost}</span>
                  </div>
                </div>
              </div>
              
              {appointment.notes && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium text-gray-900 text-sm mb-1">Doctor's Notes:</h4>
                  <p className="text-sm text-gray-700">{appointment.notes}</p>
                </div>
              )}
              
              {appointment.prescription && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-medium text-blue-900 text-sm mb-1">Prescription:</h4>
                  <p className="text-sm text-blue-700">{appointment.prescription}</p>
                </div>
              )}
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Receipt
                </Button>
                {appointment.status === 'pending' && (
                  <Button variant="outline" size="sm">
                    Reschedule
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AppointmentHistory;
