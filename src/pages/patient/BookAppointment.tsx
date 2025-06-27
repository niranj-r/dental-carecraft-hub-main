import React, { useState, useEffect } from 'react';
import { Calendar, ChevronRight, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import ToothDiagram from '@/components/patient/ToothDiagram';
import SymptomChatbot from '@/components/patient/SymptomChatbot';
import { toast } from 'sonner';
import axios from 'axios';

const BookAppointment = () => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedTooth, setSelectedTooth] = useState('');
  const [symptoms, setSymptoms] = useState([]);
  const [notes, setNotes] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/appointments')
      .then(res => {
        // Extract unique doctors and times from appointments
        const docs = Array.from(new Set(res.data.map(a => a.doctor)));
        setDoctors(docs.map(name => ({ id: name, name, specialty: '' })));
        setAvailableTimes(Array.from(new Set(res.data.map(a => a.time))));
      })
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = () => {
    toast.success("Appointment booked successfully! 🎉");
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Indicator */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {['Date & Time', 'Doctor', 'Symptoms', 'Confirm'].map((label, index) => {
              const stepNumber = index + 1;
              const isActive = step === stepNumber;
              const isCompleted = step > stepNumber;
              
              return (
                <div key={label} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    isCompleted ? 'bg-green-500 text-white' :
                    isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {stepNumber}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    isActive ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    {label}
                  </span>
                  {index < 3 && <ChevronRight className="h-4 w-4 text-gray-400 mx-4" />}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 && "Select Date & Time"}
            {step === 2 && "Choose Your Doctor"}
            {step === 3 && "Tell Us About Your Symptoms"}
            {step === 4 && "Confirm Your Appointment"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <Label className="text-base font-medium mb-4 block">Select Date</Label>
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                />
              </div>
              <div>
                <Label className="text-base font-medium mb-4 block">Available Times</Label>
                <div className="grid grid-cols-3 gap-2">
                  {availableTimes.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      className="h-12"
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              {doctors.map((doctor) => (
                <Card 
                  key={doctor.id} 
                  className={`cursor-pointer transition-colors ${
                    selectedDoctor === doctor.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedDoctor(doctor.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{doctor.name}</h3>
                        <p className="text-sm text-gray-600">{doctor.specialty}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <ToothDiagram onToothSelect={setSelectedTooth} selectedTooth={selectedTooth} />
              <SymptomChatbot onSymptomsUpdate={setSymptoms} />
              <div>
                <Label htmlFor="notes" className="text-base font-medium">Additional Notes (Optional)</Label>
                <Input
                  id="notes"
                  placeholder="e.g., hurts when I drink cold water"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <Card className="bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-lg">Appointment Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{selectedDate?.toDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Doctor:</span>
                    <span className="font-medium">{doctors.find(d => d.id === selectedDoctor)?.name}</span>
                  </div>
                  {selectedTooth && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Affected Tooth:</span>
                      <span className="font-medium">{selectedTooth}</span>
                    </div>
                  )}
                  {notes && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Notes:</span>
                      <span className="font-medium">{notes}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={prevStep} 
          disabled={step === 1}
        >
          Previous
        </Button>
        
        {step < 4 ? (
          <Button 
            onClick={nextStep}
            disabled={
              (step === 1 && (!selectedDate || !selectedTime)) ||
              (step === 2 && !selectedDoctor)
            }
          >
            Next
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
            Book Appointment 🎉
          </Button>
        )}
      </div>
    </div>
  );
};

export default BookAppointment;
