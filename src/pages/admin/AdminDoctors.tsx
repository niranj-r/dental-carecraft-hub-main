import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Shield, UserCheck, UserX, Clock, Eye, CheckCircle, XCircle, User } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAuth();
    fetchDoctors();
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

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://127.0.0.1:5000/api/doctors?admin=true');
      setDoctors(response.data);
      setFilteredDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = doctors.filter(doctor =>
      doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.license_number?.includes(searchTerm)
    );

    if (statusFilter !== 'all') {
      filtered = filtered.filter(doctor => doctor.status === statusFilter);
    }

    setFilteredDoctors(filtered);
  }, [searchTerm, statusFilter, doctors]);

  const handleApprove = async (doctorId) => {
    try {
      await axios.post(`http://127.0.0.1:5000/api/doctors/${doctorId}/approve`);
      fetchDoctors(); // Refresh the list
    } catch (error) {
      console.error('Error approving doctor:', error);
    }
  };

  const handleReject = async (doctorId) => {
    try {
      await axios.post(`http://127.0.0.1:5000/api/doctors/${doctorId}/reject`, {
        reason: 'Application rejected by administrator'
      });
      fetchDoctors(); // Refresh the list
    } catch (error) {
      console.error('Error rejecting doctor:', error);
    }
  };

  const handleViewDoctor = (doctorId) => {
    navigate(`/admin/doctors/${doctorId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <UserCheck className="h-4 w-4" />;
      case 'rejected':
        return <UserX className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const approvedDoctors = doctors.filter(doc => doc.status === 'approved');
  const pendingDoctors = doctors.filter(doc => doc.status === 'pending');
  const rejectedDoctors = doctors.filter(doc => doc.status === 'rejected');

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
        <div className="text-lg">Loading doctors...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Doctor Management</h1>
          <p className="text-gray-600">Manage all doctors and their applications</p>
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
                <p className="text-sm font-medium text-gray-600">Total Doctors</p>
                <p className="text-2xl font-bold text-gray-900">{doctors.length}</p>
              </div>
              <User className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
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
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingDoctors.length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{rejectedDoctors.length}</p>
              </div>
              <UserX className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, specialty, email, or license number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Doctors List */}
      <div className="grid gap-4">
        {filteredDoctors.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || statusFilter !== 'all' ? 'No doctors found' : 'No doctors yet'}
              </h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search terms or status filter' 
                  : 'Doctors will appear here once they register'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="hover:shadow-md transition-shadow border-purple-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Shield className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <span>Specialty: {doctor.specialty}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>Experience: {doctor.experience} years</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>License: {doctor.license_number}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="text-sm text-gray-500">
                          Email: {doctor.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          Contact: {doctor.contact}
                        </div>
                        {doctor.created_at && (
                          <div className="text-sm text-gray-500">
                            Applied: {doctor.created_at}
                          </div>
                        )}
                      </div>
                      {doctor.education && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">Education: {doctor.education}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(doctor.status)}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(doctor.status)}
                        <span>{doctor.status}</span>
                      </div>
                    </Badge>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDoctor(doctor.id)}
                        className="border-purple-200 text-purple-700 hover:bg-purple-50"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      {doctor.status === 'pending' && (
                        <>
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
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary */}
      <Card className="border-purple-200">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {filteredDoctors.length} of {doctors.length} doctors
            </div>
            <div className="flex space-x-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Approved: {approvedDoctors.length}
              </Badge>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                Pending: {pendingDoctors.length}
              </Badge>
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                Rejected: {rejectedDoctors.length}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDoctors; 