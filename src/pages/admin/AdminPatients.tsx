import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, User, Phone, Calendar, FileText, Eye, Shield } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminPatients = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAuth();
    fetchPatients();
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

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://127.0.0.1:5000/api/patients');
      setPatients(response.data);
      setFilteredPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = patients.filter(patient =>
      patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.contact?.includes(searchTerm)
    );
    setFilteredPatients(filtered);
  }, [searchTerm, patients]);

  const handleViewPatient = (patientId) => {
    navigate(`/admin/patients/${patientId}`);
  };

  const handleViewAppointments = (patientId) => {
    navigate(`/admin/patients/${patientId}/appointments`);
  };

  const handleViewTreatmentNotes = (patientId) => {
    navigate(`/admin/patients/${patientId}/treatment-notes`);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading patients...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patient Records</h1>
          <p className="text-gray-600">View and manage all patient information</p>
        </div>
        <Button onClick={() => navigate('/admin')} className="bg-purple-600 hover:bg-purple-700">
          <Shield className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search patients by name or contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Patient List */}
      <div className="grid gap-4">
        {filteredPatients.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No patients found' : 'No patients yet'}
              </h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? 'Try adjusting your search terms' 
                  : 'Patients will appear here once they register'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredPatients.map((patient) => (
            <Card key={patient.id} className="hover:shadow-md transition-shadow border-purple-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <User className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <span>Age: {patient.age}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>Gender: {patient.gender}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Phone className="h-3 w-3" />
                          <span>{patient.contact}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>{patient.appointment_count || 0} appointments</span>
                        </div>
                        {patient.last_appointment && (
                          <div className="text-sm text-gray-500">
                            Last visit: {patient.last_appointment}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewPatient(patient.id)}
                      className="border-purple-200 text-purple-700 hover:bg-purple-50"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewAppointments(patient.id)}
                      className="border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      Appointments
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewTreatmentNotes(patient.id)}
                      className="border-green-200 text-green-700 hover:bg-green-50"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Treatment Notes
                    </Button>
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
              Showing {filteredPatients.length} of {patients.length} patients
            </div>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              Total Patients: {patients.length}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPatients; 