import React, { useEffect, useState } from 'react';
import { Calendar, Clock, CreditCard, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [patient, setPatient] = useState<any>(null);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.patient_id) return;
    axios.get('http://127.0.0.1:5000/api/patients/' + user.patient_id)
      .then(res => setPatient(res.data))
      .catch(() => setPatient(null));
    axios.get('http://127.0.0.1:5000/api/appointments?patient_id=' + user.patient_id)
      .then(res => setAppointments(res.data))
      .catch(() => setAppointments([]));
    axios.get('http://127.0.0.1:5000/api/payments?patient_id=' + user.patient_id)
      .then(res => setPayments(res.data))
      .catch(() => setPayments([]));
  }, []);

  const nextAppointment = appointments.find(a => a.status === 'scheduled' || a.status === 'pending');
  const pendingPayments = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const lastVisit = appointments.filter(a => a.status === 'completed').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  const quickStats = [
    { label: 'Next Appointment', value: nextAppointment ? `${nextAppointment.date} ${nextAppointment.time}` : 'None', icon: Calendar, color: 'text-blue-600' },
    { label: 'Pending Payments', value: `₹${pendingPayments}`, icon: CreditCard, color: 'text-orange-600' },
    { label: 'Last Visit', value: lastVisit ? `${lastVisit.date}` : 'N/A', icon: Clock, color: 'text-green-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Hi {patient?.name || 'Patient'}! Ready to take care of that smile today? 😊
        </h1>
        <p className="text-gray-600">
          Your dental health journey continues here. Book appointments, view history, and stay connected with your care team.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Upcoming Appointments
              <Link to="/patient/book">
                <Button size="sm" className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Book New</span>
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {appointments.filter(a => a.status === 'scheduled' || a.status === 'pending').map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{appointment.type || 'Appointment'}</p>
                  <p className="text-sm text-gray-600">with Dr. {appointment.doctor_name || appointment.doctor_id}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{appointment.date}</p>
                  <p className="text-sm text-gray-600">{appointment.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Everything you need, just a click away
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/patient/book">
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Book Appointment
              </Button>
            </Link>
            <Link to="/patient/history">
              <Button className="w-full justify-start" variant="outline">
                <Clock className="h-4 w-4 mr-2" />
                View History
              </Button>
            </Link>
            <Link to="/patient/payments">
              <Button className="w-full justify-start" variant="outline">
                <CreditCard className="h-4 w-4 mr-2" />
                Make Payment
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientDashboard;
