import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, UserCheck, UserX, Clock, CheckCircle, XCircle, LogOut, Calendar, Users, AlertTriangle, FileText, Zap, Eye, Search, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { formatDateToIST, formatTimeToIST } from '@/lib/utils';
import AdminSmartScheduler from '@/components/admin/AdminSmartScheduler';

interface PendingDoctor {
  id: number;
  name: string;
  specialty: string;
  contact: string;
  email: string;
  license_number: string;
  experience: number;
  education: string;
  status: string;
  username: string;
  created_at: string;
}

const AdminDashboard = () => {
  const [pendingDoctors, setPendingDoctors] = useState<PendingDoctor[]>([]);
  const [approvedDoctors, setApprovedDoctors] = useState<PendingDoctor[]>([]);
  const [rejectedDoctors, setRejectedDoctors] = useState<PendingDoctor[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [allAppointments, setAllAppointments] = useState<any[]>([]);
  const [treatmentNotes, setTreatmentNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showSmartScheduler, setShowSmartScheduler] = useState(false);
  const [selectedDate, setSelectedDate] = useState(formatDateToIST(new Date()));
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAuth();
    fetchAllData();
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

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchPendingDoctors(),
        fetchAllDoctors(),
        fetchAllPatients(),
        fetchAllAppointments(),
        fetchAllTreatmentNotes()
      ]);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const fetchPendingDoctors = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/doctors/pending');
      setPendingDoctors(response.data);
    } catch (err: any) {
      setError('Failed to fetch pending doctors: ' + (err.response?.data?.error || err.message));
      console.error(err);
    }
  };

  const handleApprove = async (doctorId: number) => {
    try {
      await axios.post(`http://127.0.0.1:5000/api/doctors/${doctorId}/approve`);
      setSuccess('Doctor approved successfully');
      fetchAllData(); // Refresh all data
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError('Failed to approve doctor: ' + (err.response?.data?.error || err.message));
      console.error(err);
    }
  };

  const handleReject = async (doctorId: number) => {
    try {
      await axios.post(`http://127.0.0.1:5000/api/doctors/${doctorId}/reject`, {
        reason: 'Application rejected by administrator'
      });
      setSuccess('Doctor rejected successfully');
      fetchAllData(); // Refresh all data
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError('Failed to reject doctor: ' + (err.response?.data?.error || err.message));
      console.error(err);
    }
  };

  const fetchAllDoctors = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/doctors?admin=true');
      const allDoctors = response.data;
      setApprovedDoctors(allDoctors.filter((doc: any) => doc.status === 'approved'));
      setRejectedDoctors(allDoctors.filter((doc: any) => doc.status === 'rejected'));
    } catch (err) {
      console.error('Error fetching doctors:', err);
    }
  };

  const fetchAllPatients = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/patients');
      setPatients(response.data);
    } catch (err) {
      console.error('Error fetching patients:', err);
    }
  };

  const fetchAllAppointments = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/appointments');
      setAllAppointments(response.data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    }
  };

  const fetchAllTreatmentNotes = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/treatment-notes');
      setTreatmentNotes(response.data);
    } catch (err) {
      console.error('Error fetching treatment notes:', err);
    }
  };

  const handleViewPatients = () => {
    navigate('/admin/patients');
  };

  const handleViewAppointments = () => {
    navigate('/admin/appointments');
  };

  const handleViewTreatmentNotes = () => {
    navigate('/admin/treatment-notes');
  };

  const handleManageDoctors = () => {
    navigate('/admin/doctors');
  };

  const handleEmergencyScheduling = () => {
    navigate('/admin/emergency-scheduling');
  };

  const handleViewReports = () => {
    navigate('/admin/reports');
  };

  // Calculate stats
  const todayAppointments = allAppointments.filter(apt => apt.date === formatDateToIST(new Date()));
  const urgentAppointments = allAppointments.filter(apt => apt.status === 'urgent');
  const completedAppointments = allAppointments.filter(apt => apt.status === 'completed');
  const pendingAppointments = allAppointments.filter(apt => apt.status === 'pending');

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
        <div className="text-lg">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded shadow-lg z-10"
      >
        <LogOut className="inline-block mr-2 w-5 h-5" /> Logout
      </button>

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">
          Welcome, Administrator!
        </h1>
        <p className="text-purple-100">You have {pendingDoctors.length} doctor applications pending approval.</p>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert>
          <AlertDescription className="text-green-700">{success}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                <p className="text-2xl font-bold text-purple-600">{pendingDoctors.length}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved Doctors</p>
                <p className="text-2xl font-bold text-green-600">{approvedDoctors.length}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-blue-600">{patients.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                <p className="text-2xl font-bold text-orange-600">{todayAppointments.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Overview Cards */}
      <div className="grid md:grid-cols-3 gap-6">
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
                <p className="text-sm font-medium text-gray-600">Completed Today</p>
                <p className="text-2xl font-bold text-green-600">{completedAppointments.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Treatment Notes</p>
                <p className="text-2xl font-bold text-indigo-600">{treatmentNotes.length}</p>
              </div>
              <FileText className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Doctor Approvals */}
      {pendingDoctors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-purple-600" />
              <span>Pending Doctor Approvals</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingDoctors.map((doctor) => (
                <div key={doctor.id} className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Shield className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{doctor.name}</h4>
                      <p className="text-sm text-gray-600">Specialty: {doctor.specialty}</p>
                      <p className="text-sm text-gray-500">Contact: {doctor.contact} | Email: {doctor.email}</p>
                      <p className="text-sm text-gray-500">License: {doctor.license_number} | Experience: {doctor.experience} years</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      Pending
                    </Badge>
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleApprove(doctor.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleReject(doctor.id)}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <Button 
              className="h-20 bg-purple-600 hover:bg-purple-700"
              onClick={handleManageDoctors}
            >
              <div className="text-center">
                <Shield className="h-6 w-6 mx-auto mb-2" />
                <span>Manage Doctors</span>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 border-blue-200 hover:bg-blue-50"
              onClick={handleViewPatients}
            >
              <div className="text-center">
                <Users className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <span>View All Patients</span>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 border-green-200 hover:bg-green-50"
              onClick={handleViewAppointments}
            >
              <div className="text-center">
                <Calendar className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <span>View Appointments</span>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 border-orange-200 hover:bg-orange-50"
              onClick={handleEmergencyScheduling}
            >
              <div className="text-center">
                <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                <span>Emergency Scheduling</span>
              </div>
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <Button 
              variant="outline" 
              className="h-20 border-indigo-200 hover:bg-indigo-50"
              onClick={handleViewTreatmentNotes}
            >
              <div className="text-center">
                <FileText className="h-6 w-6 mx-auto mb-2 text-indigo-600" />
                <span>Treatment Notes</span>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 border-red-200 hover:bg-red-50"
              onClick={handleViewReports}
            >
              <div className="text-center">
                <Eye className="h-6 w-6 mx-auto mb-2 text-red-600" />
                <span>View Reports</span>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 border-teal-200 hover:bg-teal-50"
              onClick={() => setShowSmartScheduler(!showSmartScheduler)}
            >
              <div className="text-center">
                <Zap className="h-6 w-6 mx-auto mb-2 text-teal-600" />
                <span>Smart Scheduling</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
      {showSmartScheduler && (
        <div className="mt-6">
          <AdminSmartScheduler />
        </div>
      )}

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent System Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Total Patients Registered</p>
                  <p className="text-sm text-gray-600">{patients.length} patients in the system</p>
                </div>
              </div>
              <Badge variant="secondary">{patients.length}</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Approved Doctors</p>
                  <p className="text-sm text-gray-600">{approvedDoctors.length} doctors approved</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">{approvedDoctors.length}</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-full">
                  <Calendar className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Today's Appointments</p>
                  <p className="text-sm text-gray-600">{todayAppointments.length} appointments scheduled</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">{todayAppointments.length}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard; 