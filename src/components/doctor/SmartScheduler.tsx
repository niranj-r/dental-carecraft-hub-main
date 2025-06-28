import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, AlertTriangle, TrendingUp, Users, Zap } from 'lucide-react';
import axios from 'axios';

const SmartScheduler = () => {
  const [appointments, setAppointments] = useState([]);
  const [optimizationMode, setOptimizationMode] = useState(false);
  const [emergencySlots, setEmergencySlots] = useState([]);

  useEffect(() => {
    fetchScheduleData();
  }, []);

  const fetchScheduleData = async () => {
    try {
      const appointmentsRes = await axios.get('http://127.0.0.1:5000/api/appointments');
      setAppointments(appointmentsRes.data);
    } catch (error) {
      console.error('Error fetching schedule data:', error);
    }
  };

  const optimizeSchedule = () => {
    setOptimizationMode(true);
    // Simulate optimization
    setTimeout(() => {
      setOptimizationMode(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Smart Scheduling Optimization</h1>
          <p className="text-gray-600 mt-1">Real-time schedule optimization and resource management</p>
        </div>
        <Button 
          onClick={optimizeSchedule}
          className="bg-blue-600 hover:bg-blue-700"
          disabled={optimizationMode}
        >
          <Zap className="h-4 w-4 mr-2" />
          {optimizationMode ? 'Optimizing...' : 'Optimize Schedule'}
        </Button>
      </div>

      {/* Optimization Metrics */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Chair Utilization</p>
                <p className="text-2xl font-bold text-blue-600">85%</p>
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
                <p className="text-sm text-gray-600">Provider Productivity</p>
                <p className="text-2xl font-bold text-green-600">92%</p>
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
                <p className="text-sm text-gray-600">Idle Time Reduced</p>
                <p className="text-2xl font-bold text-orange-600">23%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Emergency Slots</p>
                <p className="text-2xl font-bold text-red-600">{emergencySlots.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chair Utilization Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle>Chair Utilization & Optimization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3].map(chairId => (
              <div key={chairId} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Chair {chairId}</h3>
                  <Badge className="bg-green-100 text-green-800">Available</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Utilization:</span>
                    <span className="font-medium">{75 + chairId * 5}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${75 + chairId * 5}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Provider Productivity */}
      <Card>
        <CardHeader>
          <CardTitle>Provider Productivity Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Dr. Sarah Smith', specialty: 'General Dentistry', score: 95, load: 8 },
              { name: 'Dr. Mike Johnson', specialty: 'Orthodontics', score: 88, load: 6 },
              { name: 'Dr. Lisa Brown', specialty: 'Oral Surgery', score: 92, load: 4 }
            ].map(doctor => (
              <div key={doctor.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{doctor.name}</h3>
                  <p className="text-sm text-gray-600">{doctor.specialty}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Productivity Score</p>
                  <p className="text-lg font-bold text-green-600">{doctor.score}%</p>
                  <p className="text-xs text-gray-500">Current Load: {doctor.load} patients</p>
                </div>
              </div>
            ))}
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
              <p className="text-center text-gray-500 py-4">No emergency slots currently active</p>
            ) : (
              emergencySlots.map(slot => (
                <div key={slot.id} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-red-900">Emergency Appointment</h3>
                    <p className="text-sm text-red-700">{slot.date} at {slot.time}</p>
                  </div>
                  <Badge className="bg-red-100 text-red-800">Emergency</Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartScheduler; 