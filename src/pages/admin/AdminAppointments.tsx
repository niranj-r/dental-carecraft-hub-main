import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, User, CheckCircle, XCircle, AlertTriangle, Shield } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getCurrentISTDate, formatDateToIST, formatTimeToIST } from '@/lib/utils';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(getCurrentISTDate());
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAuth();
    fetchAppointments();
  }, []);

  const checkAdminAuth = () => {
    const adminSession = localStorage.getItem('adminSession');
    if (!adminSession) {
      navigate('/admin-login');
      return;
    }
    
    try {
      const admin = JSON.parse(adminSession);
      if (admin.role !== 'admin') {
        navigate('/admin-login');
        return;
      }
      setIsAdmin(true);
    } catch (err) {
      navigate('/admin-login');
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://127.0.0.1:5000/api/appointments');
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await axios.put(`http://127.0.0.1:5000/api/appointments/${appointmentId}/status`, {
        status: newStatus
      });
      
      // Refresh appointments
      const response = await axios.get('http://127.0.0.1:5000/api/appointments');
      setAppointments(response.data);
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'urgent':
        return 'bg-orange-100 text-orange-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      case 'urgent':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const dateMatch = appointment.date === selectedDate;
    const statusMatch = statusFilter === 'all' || appointment.status === statusFilter;
    return dateMatch && statusMatch;
  });

  const todayAppointments = appointments.filter(appointment => 
    appointment.date === getCurrentISTDate()
  );

  const upcomingAppointments = appointments.filter(appointment => 
    appointment.date > getCurrentISTDate()
  ).slice(0, 5);

  const urgentAppointments = appointments.filter(appointment => 
    appointment.status === 'urgent'
  );

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading appointments...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointment Management</h1>
          <p className="text-gray-600">Manage all appointments across the system</p>
        </div>
        <Button onClick={() => navigate('/admin')} className="bg-purple-600 hover:bg-purple-700">
          <Shield className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{todayAppointments.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Today</p>
                <p className="text-2xl font-bold text-green-600">
                  {todayAppointments.filter(a => a.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Urgent Cases</p>
                <p className="text-2xl font-bold text-red-600">{urgentAppointments.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
              </div>
              <User className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Select Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="ml-2 p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Status Filter:</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="ml-2 w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            <span>Appointments for {selectedDate}</span>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              {filteredAppointments.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No appointments scheduled for this date and status.
              </div>
            ) : (
              filteredAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-purple-200">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="font-semibold text-purple-600">{formatTimeToIST(appointment.time)}</p>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{appointment.patient_name}</h4>
                      <p className="text-sm text-gray-600">Doctor: {appointment.doctor_name || 'Dr. ' + appointment.doctor_id}</p>
                      <p className="text-sm text-gray-500">Contact: {appointment.patient_contact}</p>
                      <p className="text-sm text-gray-500">Service: {appointment.service_type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(appointment.status)}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(appointment.status)}
                        <span>{appointment.status}</span>
                      </div>
                    </Badge>
                    <div className="flex space-x-2">
                      {appointment.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Complete
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        </>
                      )}
                      {appointment.status === 'pending' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-orange-200 text-orange-700 hover:bg-orange-50"
                          onClick={() => handleStatusUpdate(appointment.id, 'urgent')}
                        >
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Mark Urgent
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      {upcomingAppointments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span>Upcoming Appointments</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-center">
                      <p className="font-semibold text-blue-600">{formatTimeToIST(appointment.time)}</p>
                      <p className="text-xs text-gray-500">{appointment.date}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{appointment.patient_name}</h4>
                      <p className="text-sm text-gray-600">Doctor: {appointment.doctor_name || 'Dr. ' + appointment.doctor_id}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminAppointments; 