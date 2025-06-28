import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, AlertTriangle, TrendingUp, Users, Zap, Shield } from 'lucide-react';
import axios from 'axios';

const AdminSmartScheduler = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [optimizationMode, setOptimizationMode] = useState(false);
  const [emergencySlots, setEmergencySlots] = useState([]);
  const [systemMetrics, setSystemMetrics] = useState({
    totalAppointments: 0,
    completedAppointments: 0,
    pendingAppointments: 0,
    urgentAppointments: 0,
    totalDoctors: 0,
    totalPatients: 0,
    averageWaitTime: '15 min',
    systemEfficiency: 87
  });

  useEffect(() => {
    fetchSystemData();
  }, []);

  const fetchSystemData = async () => {
    try {
      const [appointmentsRes, doctorsRes, patientsRes] = await Promise.all([
        axios.get('http://127.0.0.1:5000/api/appointments'),
        axios.get('http://127.0.0.1:5000/api/doctors?admin=true'),
        axios.get('http://127.0.0.1:5000/api/patients')
      ]);

      setAppointments(appointmentsRes.data);
      setDoctors(doctorsRes.data.filter(doc => doc.status === 'approved'));
      setPatients(patientsRes.data);

      // Calculate system metrics
      const totalAppointments = appointmentsRes.data.length;
      const completedAppointments = appointmentsRes.data.filter(apt => apt.status === 'completed').length;
      const pendingAppointments = appointmentsRes.data.filter(apt => apt.status === 'pending').length;
      const urgentAppointments = appointmentsRes.data.filter(apt => apt.status === 'urgent').length;

      setSystemMetrics({
        totalAppointments,
        completedAppointments,
        pendingAppointments,
        urgentAppointments,
        totalDoctors: doctorsRes.data.filter(doc => doc.status === 'approved').length,
        totalPatients: patientsRes.data.length,
        averageWaitTime: '15 min',
        systemEfficiency: Math.round((completedAppointments / totalAppointments) * 100) || 0
      });

      // Get emergency slots
      setEmergencySlots(appointmentsRes.data.filter(apt => apt.status === 'urgent'));
    } catch (error) {
      console.error('Error fetching system data:', error);
    }
  };

  const optimizeSystemSchedule = async () => {
    setOptimizationMode(true);
    try {
      // Call optimization endpoint
      await axios.post('http://127.0.0.1:5000/api/appointments/optimize');
      
      // Refresh data after optimization
      await fetchSystemData();
    } catch (error) {
      console.error('Error optimizing schedule:', error);
    } finally {
      setOptimizationMode(false);
    }
  };

  const createEmergencySlot = async () => {
    try {
      await axios.post('http://127.0.0.1:5000/api/appointments/emergency');
      await fetchSystemData();
    } catch (error) {
      console.error('Error creating emergency slot:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System-Wide Smart Scheduling</h1>
          <p className="text-gray-600 mt-1">Administrative oversight and optimization of the entire dental care system</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={createEmergencySlot}
            className="bg-red-600 hover:bg-red-700"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Create Emergency Slot
          </Button>
          <Button 
            onClick={optimizeSystemSchedule}
            className="bg-purple-600 hover:bg-purple-700"
            disabled={optimizationMode}
          >
            <Zap className="h-4 w-4 mr-2" />
            {optimizationMode ? 'Optimizing...' : 'Optimize System'}
          </Button>
        </div>
      </div>

      {/* System Overview Metrics */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">System Efficiency</p>
                <p className="text-2xl font-bold text-purple-600">{systemMetrics.systemEfficiency}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Appointments</p>
                <p className="text-2xl font-bold text-blue-600">{systemMetrics.totalAppointments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Doctors</p>
                <p className="text-2xl font-bold text-green-600">{systemMetrics.totalDoctors}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Wait Time</p>
                <p className="text-2xl font-bold text-orange-600">{systemMetrics.averageWaitTime}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointment Status Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{systemMetrics.completedAppointments}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {systemMetrics.totalAppointments > 0 
                    ? Math.round((systemMetrics.completedAppointments / systemMetrics.totalAppointments) * 100)
                    : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{systemMetrics.pendingAppointments}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {systemMetrics.totalAppointments > 0 
                    ? Math.round((systemMetrics.pendingAppointments / systemMetrics.totalAppointments) * 100)
                    : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Urgent</p>
                <p className="text-2xl font-bold text-red-600">{systemMetrics.urgentAppointments}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {systemMetrics.totalAppointments > 0 
                    ? Math.round((systemMetrics.urgentAppointments / systemMetrics.totalAppointments) * 100)
                    : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Doctor Workload Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Doctor Workload Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {doctors.slice(0, 5).map(doctor => {
              const doctorAppointments = appointments.filter(apt => apt.doctor_id === doctor.id);
              const completedCount = doctorAppointments.filter(apt => apt.status === 'completed').length;
              const pendingCount = doctorAppointments.filter(apt => apt.status === 'pending').length;
              const urgentCount = doctorAppointments.filter(apt => apt.status === 'urgent').length;
              
              return (
                <div key={doctor.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{doctor.name}</h3>
                    <p className="text-sm text-gray-600">{doctor.specialty}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="font-bold text-blue-600">{doctorAppointments.length}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Completed</p>
                      <p className="font-bold text-green-600">{completedCount}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Pending</p>
                      <p className="font-bold text-yellow-600">{pendingCount}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Urgent</p>
                      <p className="font-bold text-red-600">{urgentCount}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Slot Management */}
      <Card>
        <CardHeader>
          <CardTitle>Emergency Slot Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {emergencySlots.length === 0 ? (
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No emergency slots currently active</p>
                <p className="text-sm text-gray-400 mt-2">Click "Create Emergency Slot" to add one</p>
              </div>
            ) : (
              emergencySlots.map(slot => (
                <div key={slot.id} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-red-900">Emergency Appointment</h3>
                    <p className="text-sm text-red-700">
                      Patient: {slot.patient_name || `Patient ${slot.patient_id}`} | 
                      Doctor: {slot.doctor_name || `Doctor ${slot.doctor_id}`} | 
                      Date: {slot.date} at {slot.time}
                    </p>
                  </div>
                  <Badge className="bg-red-100 text-red-800">Emergency</Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* System Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>System Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {systemMetrics.pendingAppointments > 10 && (
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-900">High Pending Appointments</p>
                  <p className="text-sm text-yellow-700">
                    Consider adding more appointment slots or increasing doctor availability
                  </p>
                </div>
              </div>
            )}
            
            {systemMetrics.urgentAppointments > 3 && (
              <div className="flex items-center space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-900">Multiple Emergency Cases</p>
                  <p className="text-sm text-red-700">
                    Consider activating additional emergency slots or on-call doctors
                  </p>
                </div>
              </div>
            )}
            
            {systemMetrics.systemEfficiency < 80 && (
              <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">System Efficiency Below Target</p>
                  <p className="text-sm text-blue-700">
                    Run system optimization to improve overall efficiency
                  </p>
                </div>
              </div>
            )}
            
            {systemMetrics.systemEfficiency >= 80 && (
              <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">System Running Optimally</p>
                  <p className="text-sm text-green-700">
                    Current system efficiency is within target range
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSmartScheduler; 