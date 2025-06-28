import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertTriangle, Shield, Calendar, Clock, User, Plus, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { formatDateToIST, formatTimeToIST } from '@/lib/utils';

const AdminEmergencyScheduling = () => {
  const [emergencyAppointments, setEmergencyAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newEmergency, setNewEmergency] = useState({
    patient_id: '',
    doctor_id: '',
    date: '',
    time: '',
    urgency_level: 'high',
    symptoms: '',
    notes: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAuth();
    fetchData();
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

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch emergency appointments
      const emergencyResponse = await axios.get('http://127.0.0.1:5000/api/appointments?status=urgent');
      setEmergencyAppointments(emergencyResponse.data);
      
      // Fetch approved doctors
      const doctorsResponse = await axios.get('http://127.0.0.1:5000/api/doctors?admin=true');
      setDoctors(doctorsResponse.data.filter(doc => doc.status === 'approved'));
      
      // Fetch patients
      const patientsResponse = await axios.get('http://127.0.0.1:5000/api/patients');
      setPatients(patientsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmergency = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/appointments', {
        ...newEmergency,
        status: 'urgent',
        service_type: 'Emergency'
      });
      
      // Refresh emergency appointments
      const emergencyResponse = await axios.get('http://127.0.0.1:5000/api/appointments?status=urgent');
      setEmergencyAppointments(emergencyResponse.data);
      
      // Reset form
      setNewEmergency({
        patient_id: '',
        doctor_id: '',
        date: '',
        time: '',
        urgency_level: 'high',
        symptoms: '',
        notes: ''
      });
      setShowAddDialog(false);
    } catch (error) {
      console.error('Error adding emergency appointment:', error);
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await axios.put(`http://127.0.0.1:5000/api/appointments/${appointmentId}/status`, {
        status: newStatus
      });
      
      // Refresh emergency appointments
      const emergencyResponse = await axios.get('http://127.0.0.1:5000/api/appointments?status=urgent');
      setEmergencyAppointments(emergencyResponse.data);
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  const getUrgencyColor = (level) => {
    switch (level) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyIcon = (level) => {
    switch (level) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4" />;
      case 'medium':
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const todayEmergencies = emergencyAppointments.filter(apt => apt.date === formatDateToIST(new Date()));
  const upcomingEmergencies = emergencyAppointments.filter(apt => apt.date > formatDateToIST(new Date()));

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
        <div className="text-lg">Loading emergency scheduling...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Emergency Scheduling</h1>
          <p className="text-gray-600">Manage urgent and emergency appointments</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => navigate('/admin')} className="bg-purple-600 hover:bg-purple-700">
            <Shield className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Emergency
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Schedule Emergency Appointment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="patient">Patient</Label>
                  <select
                    id="patient"
                    value={newEmergency.patient_id}
                    onChange={(e) => setNewEmergency(prev => ({ ...prev, patient_id: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select a patient</option>
                    {patients.map(patient => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name} (Age: {patient.age}, Gender: {patient.gender})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="doctor">Doctor</Label>
                  <select
                    id="doctor"
                    value={newEmergency.doctor_id}
                    onChange={(e) => setNewEmergency(prev => ({ ...prev, doctor_id: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select a doctor</option>
                    {doctors.map(doctor => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name} ({doctor.specialty})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newEmergency.date}
                      onChange={(e) => setNewEmergency(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newEmergency.time}
                      onChange={(e) => setNewEmergency(prev => ({ ...prev, time: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="urgency">Urgency Level</Label>
                  <select
                    id="urgency"
                    value={newEmergency.urgency_level}
                    onChange={(e) => setNewEmergency(prev => ({ ...prev, urgency_level: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="symptoms">Symptoms</Label>
                  <Textarea
                    id="symptoms"
                    value={newEmergency.symptoms}
                    onChange={(e) => setNewEmergency(prev => ({ ...prev, symptoms: e.target.value }))}
                    placeholder="Describe the symptoms..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={newEmergency.notes}
                    onChange={(e) => setNewEmergency(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any additional notes..."
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddEmergency} 
                    disabled={!newEmergency.patient_id || !newEmergency.doctor_id || !newEmergency.date || !newEmergency.time}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Schedule Emergency
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Emergencies</p>
                <p className="text-2xl font-bold text-red-600">{emergencyAppointments.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Emergencies</p>
                <p className="text-2xl font-bold text-orange-600">{todayEmergencies.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Emergencies</p>
                <p className="text-2xl font-bold text-yellow-600">{upcomingEmergencies.length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Emergencies */}
      {todayEmergencies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span>Today's Emergency Appointments</span>
              <Badge variant="destructive">{todayEmergencies.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayEmergencies.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="font-semibold text-red-600">{formatTimeToIST(appointment.time)}</p>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{appointment.patient_name}</h4>
                      <p className="text-sm text-gray-600">Doctor: {appointment.doctor_name || 'Dr. ' + appointment.doctor_id}</p>
                      <p className="text-sm text-gray-500">Contact: {appointment.patient_contact}</p>
                      {appointment.symptoms && (
                        <p className="text-sm text-red-600 mt-1">Symptoms: {appointment.symptoms}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getUrgencyColor(appointment.urgency_level || 'high')}>
                      <div className="flex items-center space-x-1">
                        {getUrgencyIcon(appointment.urgency_level || 'high')}
                        <span>{appointment.urgency_level || 'high'}</span>
                      </div>
                    </Badge>
                    <div className="flex space-x-2">
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
                        variant="outline"
                        onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Emergency Appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <span>All Emergency Appointments</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {emergencyAppointments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No emergency appointments scheduled.
              </div>
            ) : (
              emergencyAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="font-semibold text-orange-600">{formatTimeToIST(appointment.time)}</p>
                      <p className="text-xs text-gray-500">{appointment.date}</p>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{appointment.patient_name}</h4>
                      <p className="text-sm text-gray-600">Doctor: {appointment.doctor_name || 'Dr. ' + appointment.doctor_id}</p>
                      <p className="text-sm text-gray-500">Contact: {appointment.patient_contact}</p>
                      {appointment.symptoms && (
                        <p className="text-sm text-orange-600 mt-1">Symptoms: {appointment.symptoms}</p>
                      )}
                      {appointment.notes && (
                        <p className="text-sm text-gray-500 mt-1">Notes: {appointment.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getUrgencyColor(appointment.urgency_level || 'high')}>
                      <div className="flex items-center space-x-1">
                        {getUrgencyIcon(appointment.urgency_level || 'high')}
                        <span>{appointment.urgency_level || 'high'}</span>
                      </div>
                    </Badge>
                    <Badge variant="secondary">
                      {appointment.status}
                    </Badge>
                    {appointment.status === 'urgent' && (
                      <div className="flex space-x-2">
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
                          variant="outline"
                          onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminEmergencyScheduling; 