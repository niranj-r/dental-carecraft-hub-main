import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, User, Phone, Calendar, FileText, Eye } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PatientRecords = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Get doctor ID from localStorage
  const doctorId = localStorage.getItem('doctorId') || '1';

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://127.0.0.1:5000/api/doctors/${doctorId}/patients`);
        setPatients(response.data);
        setFilteredPatients(response.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [doctorId]);

  useEffect(() => {
    const filtered = patients.filter(patient =>
      patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.contact?.includes(searchTerm)
    );
    setFilteredPatients(filtered);
  }, [searchTerm, patients]);

  const handleViewPatient = (patientId) => {
    navigate(`/doctor/patients/${patientId}`);
  };

  const handleAddTreatmentNotes = (patientId) => {
    navigate(`/doctor/notes/add?patient_id=${patientId}`);
  };

  const handleViewHistory = (patientId) => {
    navigate(`/doctor/patients/${patientId}/history`);
  };

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
          <p className="text-gray-600">Manage and view your patient information</p>
        </div>
        <Button onClick={() => navigate('/doctor')}>
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
                  : 'Patients will appear here once they have appointments with you'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredPatients.map((patient) => (
            <Card key={patient.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <User className="h-6 w-6 text-blue-600" />
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
                          <span>{patient.appointment_count} appointments</span>
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
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddTreatmentNotes(patient.id)}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Add Notes
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewHistory(patient.id)}
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      History
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {filteredPatients.length} of {patients.length} patients
            </div>
            <Badge variant="secondary">
              Total Patients: {patients.length}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientRecords;
