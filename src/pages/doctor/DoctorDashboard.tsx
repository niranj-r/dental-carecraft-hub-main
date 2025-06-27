import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Clock, AlertTriangle, CheckCircle, FileText } from 'lucide-react';
import axios from 'axios';

const DoctorDashboard = () => {
  const [todayStats, setTodayStats] = useState({ totalAppointments: 0, completed: 0, pending: 0, urgent: 0 });
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/appointments')
      .then(res => {
        setUpcomingAppointments(res.data);
        // Calculate stats
        const completed = res.data.filter(a => a.status === 'completed').length;
        const pending = res.data.filter(a => a.status === 'pending').length;
        const urgent = res.data.filter(a => a.status === 'urgent').length;
        setTodayStats({
          totalAppointments: res.data.length,
          completed,
          pending,
          urgent
        });
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Good morning, Dr. Johnson!</h1>
        <p className="text-blue-100">You have {todayStats.pending} appointments scheduled for today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{todayStats.totalAppointments}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{todayStats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-orange-600">{todayStats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Urgent Cases</p>
                <p className="text-2xl font-bold text-red-600">{todayStats.urgent}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Next Appointments</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="font-semibold text-blue-600">{appointment.time}</p>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{appointment.patient}</h4>
                    <p className="text-sm text-gray-600">{appointment.type}</p>
                    <p className="text-sm text-gray-500">{appointment.symptoms}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant={appointment.urgency === 'urgent' ? 'destructive' : 'secondary'}>
                    {appointment.urgency === 'urgent' ? 'Urgent' : 'Normal'}
                  </Badge>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Button className="h-20 bg-blue-600 hover:bg-blue-700">
              <div className="text-center">
                <Users className="h-6 w-6 mx-auto mb-2" />
                <span>View All Patients</span>
              </div>
            </Button>
            <Button variant="outline" className="h-20">
              <div className="text-center">
                <FileText className="h-6 w-6 mx-auto mb-2" />
                <span>Add Treatment Notes</span>
              </div>
            </Button>
            <Button variant="outline" className="h-20">
              <div className="text-center">
                <Calendar className="h-6 w-6 mx-auto mb-2" />
                <span>Manage Schedule</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorDashboard;
