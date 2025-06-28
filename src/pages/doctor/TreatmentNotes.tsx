import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, FileText, Plus, User, Calendar, Eye } from 'lucide-react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

const TreatmentNotes = () => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients, setPatients] = useState([]);
  const [newNote, setNewNote] = useState({
    patient_id: '',
    diagnosis: '',
    treatment_plan: '',
    notes: ''
  });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');

  // Get doctor ID from localStorage
  const doctorId = localStorage.getItem('doctorId') || '1';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch treatment notes
        const notesResponse = await axios.get(`http://127.0.0.1:5000/api/treatment-notes?doctor_id=${doctorId}`);
        setNotes(notesResponse.data);
        setFilteredNotes(notesResponse.data);
        
        // Fetch patients for the doctor
        const patientsResponse = await axios.get(`http://127.0.0.1:5000/api/doctors/${doctorId}/patients`);
        setPatients(patientsResponse.data);
        
        // Check if patient_id is in URL params (for direct navigation from patient list)
        const patientId = searchParams.get('patient_id');
        if (patientId) {
          setNewNote(prev => ({ ...prev, patient_id: patientId }));
          setShowAddDialog(true);
        }
      } catch (error) {
        setError('Could not load treatment notes. Please try again later.');
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [doctorId, searchParams]);

  useEffect(() => {
    const filtered = notes.filter(note =>
      note.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.treatment_plan?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNotes(filtered);
  }, [searchTerm, notes]);

  const handleAddNote = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/treatment-notes', {
        ...newNote,
        doctor_id: doctorId
      });
      
      // Refresh notes list
      const notesResponse = await axios.get(`http://127.0.0.1:5000/api/treatment-notes?doctor_id=${doctorId}`);
      setNotes(notesResponse.data);
      setFilteredNotes(notesResponse.data);
      
      // Reset form
      setNewNote({
        patient_id: '',
        diagnosis: '',
        treatment_plan: '',
        notes: ''
      });
      setShowAddDialog(false);
    } catch (error) {
      console.error('Error adding treatment note:', error);
    }
  };

  const handleViewPatient = (patientId) => {
    navigate(`/doctor/patients/${patientId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading treatment notes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Treatment Notes</h1>
          <p className="text-gray-600">View and manage patient treatment records</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => navigate('/doctor')}>
            Back to Dashboard
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Treatment Note
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Treatment Note</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="patient">Patient</Label>
                  <select
                    id="patient"
                    value={newNote.patient_id}
                    onChange={(e) => setNewNote(prev => ({ ...prev, patient_id: e.target.value }))}
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
                  <Label htmlFor="diagnosis">Diagnosis</Label>
                  <Textarea
                    id="diagnosis"
                    value={newNote.diagnosis}
                    onChange={(e) => setNewNote(prev => ({ ...prev, diagnosis: e.target.value }))}
                    placeholder="Enter diagnosis..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="treatment_plan">Treatment Plan</Label>
                  <Textarea
                    id="treatment_plan"
                    value={newNote.treatment_plan}
                    onChange={(e) => setNewNote(prev => ({ ...prev, treatment_plan: e.target.value }))}
                    placeholder="Enter treatment plan..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={newNote.notes}
                    onChange={(e) => setNewNote(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Enter additional notes..."
                    rows={4}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddNote} disabled={!newNote.patient_id || !newNote.diagnosis}>
                    Save Note
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search notes by patient name, diagnosis, or treatment plan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Notes List */}
      <div className="grid gap-4">
        {filteredNotes.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No notes found' : 'No treatment notes yet'}
              </h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? 'Try adjusting your search terms' 
                  : 'Start by adding treatment notes for your patients'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotes.map((note) => (
            <Card key={note.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{note.patient_name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>{note.created_at}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Diagnosis</h4>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{note.diagnosis}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Treatment Plan</h4>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{note.treatment_plan}</p>
                      </div>
                      
                      {note.notes && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">Additional Notes</h4>
                          <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{note.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewPatient(note.patient_id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Patient
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
              Showing {filteredNotes.length} of {notes.length} treatment notes
            </div>
            <Badge variant="secondary">
              Total Notes: {notes.length}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TreatmentNotes;
