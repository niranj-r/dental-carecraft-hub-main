import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Clock, AlertTriangle, CheckCircle, FileText, Zap } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SmartScheduler from '@/components/doctor/SmartScheduler';
import { formatDateToIST, formatTimeToIST } from '@/lib/utils';

const DoctorDashboard = () => {
  const [todayStats, setTodayStats] = useState({ totalAppointments: 0, completed: 0, pending: 0, urgent: 0 });
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [showSmartScheduler, setShowSmartScheduler] = useState(false);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Get doctor ID from localStorage (set during login)
  const doctorId = localStorage.getItem('doctorId') || '1'; // Default to 1 for demo

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch doctor profile
        const profileResponse = await axios.get(`http://127.0.0.1:5000/api/doctors/profile?doctor_id=${doctorId}`);
        setDoctorProfile(profileResponse.data);
        
        // Fetch today's appointments
        const appointmentsResponse = await axios.get(`http://127.0.0.1:5000/api/doctors/${doctorId}/appointments/today`);
        setUpcomingAppointments(appointmentsResponse.data);
        
        // Fetch doctor stats
        const statsResponse = await axios.get(`http://127.0.0.1:5000/api/doctors/${doctorId}/stats`);
        const stats = statsResponse.data;
        
        setTodayStats({
          totalAppointments: stats.today?.today_appointments || 0,
          completed: stats.today?.completed || 0,
          pending: stats.today?.pending || 0,
          urgent: stats.today?.urgent || 0
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [doctorId]);

  const handleViewPatients = () => {
    navigate('/doctor/patients');
  };

  const handleAddTreatmentNotes = () => {
    navigate('/doctor/notes');
  };

  const handleManageSchedule = () => {
    navigate('/doctor/schedule');
  };

  const handleViewAppointmentDetails = (appointmentId) => {
    navigate(`/doctor/appointments/${appointmentId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">
          Good morning, {doctorProfile?.name || 'Doctor'}!
        </h1>
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
            <span>Today's Appointments</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No appointments scheduled for today.
              </div>
            ) : (
              upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="font-semibold text-blue-600">{formatTimeToIST(appointment.time)}</p>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{appointment.patient_name}</h4>
                      <p className="text-sm text-gray-600">Age: {appointment.age} | Gender: {appointment.gender}</p>
                      <p className="text-sm text-gray-500">Contact: {appointment.patient_contact}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant={appointment.status === 'urgent' ? 'destructive' : 'secondary'}>
                      {appointment.status === 'urgent' ? 'Urgent' : appointment.status}
                    </Badge>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewAppointmentDetails(appointment.id)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <Button 
              className="h-20 bg-blue-600 hover:bg-blue-700"
              onClick={handleViewPatients}
            >
              <div className="text-center">
                <Users className="h-6 w-6 mx-auto mb-2" />
                <span>View All Patients</span>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="h-20"
              onClick={handleAddTreatmentNotes}
            >
              <div className="text-center">
                <FileText className="h-6 w-6 mx-auto mb-2" />
                <span>Add Treatment Notes</span>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="h-20"
              onClick={handleManageSchedule}
            >
              <div className="text-center">
                <Calendar className="h-6 w-6 mx-auto mb-2" />
                <span>Manage Schedule</span>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 bg-green-50 border-green-200 hover:bg-green-100"
              onClick={() => setShowSmartScheduler(!showSmartScheduler)}
            >
              <div className="text-center">
                <Zap className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <span>Smart Scheduling</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Smart Scheduling Optimization */}
      {showSmartScheduler && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-green-600" />
              <span>Smart Scheduling Optimization</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SmartScheduler />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DoctorDashboard;
