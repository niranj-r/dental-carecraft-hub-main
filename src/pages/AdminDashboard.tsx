import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, UserCheck, UserX, Clock, CheckCircle, XCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAuth();
    fetchAllDoctors();
    fetchAllPatients();
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
      fetchPendingDoctors();
    } catch (err) {
      navigate('/admin-login');
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
      setLoading(true);
      const response = await axios.get('http://127.0.0.1:5000/api/doctors/pending');
      setPendingDoctors(response.data);
    } catch (err: any) {
      setError('Failed to fetch pending doctors: ' + (err.response?.data?.error || err.message));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (doctorId: number) => {
    try {
      await axios.post(`http://127.0.0.1:5000/api/doctors/${doctorId}/approve`);
      setSuccess('Doctor approved successfully');
      fetchPendingDoctors(); // Refresh the list
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
      fetchPendingDoctors(); // Refresh the list
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError('Failed to reject doctor: ' + (err.response?.data?.error || err.message));
      console.error(err);
    }
  };

  const fetchAllDoctors = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/doctors');
      const allDoctors = response.data;
      setApprovedDoctors(allDoctors.filter((doc: any) => doc.status === 'approved'));
      setRejectedDoctors(allDoctors.filter((doc: any) => doc.status === 'rejected'));
    } catch (err) {
      // Optionally handle error
    }
  };

  const fetchAllPatients = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/patients');
      setPatients(response.data);
    } catch (err) {
      // Optionally handle error
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-purple-100 rounded-full mr-4">
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="ml-4 border-red-200 text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          </div>
          <p className="text-xl text-gray-600">Manage doctor applications and system settings</p>
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-6">
            <AlertDescription className="text-green-700">{success}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending Approvals</p>
                  <p className="text-2xl font-bold text-blue-600">{pendingDoctors.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Approved Doctors</p>
                  <p className="text-2xl font-bold text-green-600">{approvedDoctors.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <UserX className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rejected Applications</p>
                  <p className="text-2xl font-bold text-red-600">{rejectedDoctors.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-purple-600">{patients.length + approvedDoctors.length + pendingDoctors.length + rejectedDoctors.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Doctor Applications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <span>Pending Doctor Applications</span>
              <Badge className="bg-orange-100 text-orange-800">{pendingDoctors.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading applications...</p>
              </div>
            ) : pendingDoctors.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-gray-600">No pending applications</p>
              </div>
            ) : (
              <div className="space-y-6">
                {pendingDoctors.map((doctor) => (
                  <div key={doctor.id} className="border rounded-lg p-6 bg-white">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
                        <p className="text-gray-600">{doctor.specialty}</p>
                        <p className="text-sm text-gray-500">Username: {doctor.username}</p>
                      </div>
                      <Badge className="bg-orange-100 text-orange-800">Pending Review</Badge>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Contact Information</p>
                        <p className="text-gray-600">{doctor.contact}</p>
                        <p className="text-gray-600">{doctor.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Professional Details</p>
                        <p className="text-gray-600">License: {doctor.license_number}</p>
                        <p className="text-gray-600">Experience: {doctor.experience} years</p>
                      </div>
                    </div>

                    {doctor.education && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700">Education & Certifications</p>
                        <p className="text-gray-600 text-sm">{doctor.education}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t">
                      <p className="text-xs text-gray-500">
                        Applied on: {new Date(doctor.created_at).toLocaleDateString()}
                      </p>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleReject(doctor.id)}
                          variant="outline"
                          size="sm"
                          className="border-red-200 text-red-700 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button
                          onClick={() => handleApprove(doctor.id)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 text-center">
            🔒 This is a secure administrative portal. All actions are logged for audit purposes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 