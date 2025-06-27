import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Save, Calendar, User } from 'lucide-react';
import axios from 'axios';

const TreatmentNotes = () => {
  const [selectedPatient, setSelectedPatient] = useState('');
  const [treatmentNote, setTreatmentNote] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [recentNotes, setRecentNotes] = useState([]);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/appointments')
      .then(res => setRecentNotes(res.data))
      .catch(err => console.error(err));
    axios.get('http://localhost:5000/api/patients')
      .then(res => setPatients(res.data.map(p => p.name)))
      .catch(err => console.error(err));
  }, []);

  const handleSaveNote = () => {
    console.log('Saving note:', {
      patient: selectedPatient,
      note: treatmentNote,
      followUp: followUpDate
    });
    // Reset form
    setSelectedPatient('');
    setTreatmentNote('');
    setFollowUpDate('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Treatment Notes</h1>
          <p className="text-gray-600">Add and manage patient treatment records</p>
        </div>
      </div>

      {/* Add New Note */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Add Treatment Note</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Patient
              </label>
              <select
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a patient...</option>
                {patients.map((patient) => (
                  <option key={patient} value={patient}>
                    {patient}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Follow-up Date
              </label>
              <Input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Treatment Notes
            </label>
            <Textarea
              placeholder="Enter detailed treatment notes, procedures performed, patient response, recommendations..."
              value={treatmentNote}
              onChange={(e) => setTreatmentNote(e.target.value)}
              rows={4}
            />
          </div>
          
          <Button onClick={handleSaveNote} disabled={!selectedPatient || !treatmentNote}>
            <Save className="h-4 w-4 mr-2" />
            Save Treatment Note
          </Button>
        </CardContent>
      </Card>

      {/* Recent Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Recent Treatment Notes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentNotes.map((note) => (
              <div key={note.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{note.patient}</h3>
                      <p className="text-sm text-gray-600">{note.treatment}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{note.date}</span>
                    </div>
                    <Badge variant={note.status === 'completed' ? 'secondary' : 'default'}>
                      {note.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm text-gray-700">{note.notes}</p>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Follow-up: {note.followUp}</span>
                  </div>
                  <div className="space-x-2">
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      Print
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TreatmentNotes;
