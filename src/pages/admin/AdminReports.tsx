import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Users, Calendar, FileText, TrendingUp, TrendingDown, Eye, Download } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { formatDateToIST } from '@/lib/utils';

const AdminReports = () => {
  const [reports, setReports] = useState({
    appointments: [],
    patients: [],
    doctors: [],
    treatmentNotes: []
  });
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAuth();
    fetchReportData();
  }, [selectedPeriod]);

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

  const fetchReportData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data for reports
      const [appointmentsRes, patientsRes, doctorsRes, treatmentNotesRes] = await Promise.all([
        axios.get('http://127.0.0.1:5000/api/appointments'),
        axios.get('http://127.0.0.1:5000/api/patients'),
        axios.get('http://127.0.0.1:5000/api/doctors'),
        axios.get('http://127.0.0.1:5000/api/treatment-notes')
      ]);

      setReports({
        appointments: appointmentsRes.data,
        patients: patientsRes.data,
        doctors: doctorsRes.data,
        treatmentNotes: treatmentNotesRes.data
      });
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredData = (data, period) => {
    const now = new Date();
    const filterDate = new Date();
    
    switch (period) {
      case 'week':
        filterDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        filterDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return data;
    }
    
    return data.filter(item => {
      const itemDate = new Date(item.created_at || item.date);
      return itemDate >= filterDate;
    });
  };

  const calculateStats = () => {
    const filteredAppointments = getFilteredData(reports.appointments, selectedPeriod);
    const filteredPatients = getFilteredData(reports.patients, selectedPeriod);
    const filteredDoctors = getFilteredData(reports.doctors, selectedPeriod);
    const filteredTreatmentNotes = getFilteredData(reports.treatmentNotes, selectedPeriod);

    const totalAppointments = filteredAppointments.length;
    const completedAppointments = filteredAppointments.filter(apt => apt.status === 'completed').length;
    const pendingAppointments = filteredAppointments.filter(apt => apt.status === 'pending').length;
    const urgentAppointments = filteredAppointments.filter(apt => apt.status === 'urgent').length;
    const cancelledAppointments = filteredAppointments.filter(apt => apt.status === 'cancelled').length;

    const approvedDoctors = filteredDoctors.filter(doc => doc.status === 'approved').length;
    const pendingDoctors = filteredDoctors.filter(doc => doc.status === 'pending').length;
    const rejectedDoctors = filteredDoctors.filter(doc => doc.status === 'rejected').length;

    const completionRate = totalAppointments > 0 ? (completedAppointments / totalAppointments * 100).toFixed(1) : 0;
    const cancellationRate = totalAppointments > 0 ? (cancelledAppointments / totalAppointments * 100).toFixed(1) : 0;

    return {
      totalAppointments,
      completedAppointments,
      pendingAppointments,
      urgentAppointments,
      cancelledAppointments,
      totalPatients: filteredPatients.length,
      approvedDoctors,
      pendingDoctors,
      rejectedDoctors,
      totalTreatmentNotes: filteredTreatmentNotes.length,
      completionRate,
      cancellationRate
    };
  };

  const handleExportReport = (reportType) => {
    // This would typically generate and download a CSV/PDF report
    console.log(`Exporting ${reportType} report for ${selectedPeriod}`);
    // For now, just show an alert
    alert(`${reportType} report for ${selectedPeriod} would be exported here.`);
  };

  const stats = calculateStats();

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
        <div className="text-lg">Loading reports...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Reports</h1>
          <p className="text-gray-600">Comprehensive analytics and system insights</p>
        </div>
        <Button onClick={() => navigate('/admin')} className="bg-purple-600 hover:bg-purple-700">
          <Shield className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Time Period:</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="ml-2 w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="quarter">Last Quarter</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Report Type:</label>
              <Select value={selectedReport} onValueChange={setSelectedReport}>
                <SelectTrigger className="ml-2 w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Overview</SelectItem>
                  <SelectItem value="appointments">Appointments</SelectItem>
                  <SelectItem value="patients">Patients</SelectItem>
                  <SelectItem value="doctors">Doctors</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={() => handleExportReport(selectedReport)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Overview Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalAppointments}</p>
                <p className="text-xs text-gray-500">{selectedPeriod} period</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-green-600">{stats.completionRate}%</p>
                <p className="text-xs text-gray-500">{stats.completedAppointments} completed</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalPatients}</p>
                <p className="text-xs text-gray-500">{selectedPeriod} period</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved Doctors</p>
                <p className="text-2xl font-bold text-indigo-600">{stats.approvedDoctors}</p>
                <p className="text-xs text-gray-500">{selectedPeriod} period</p>
              </div>
              <Shield className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <span>Appointment Statistics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completed</span>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-100 text-green-800">{stats.completedAppointments}</Badge>
                  <span className="text-sm text-gray-500">{stats.completionRate}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending</span>
                <Badge className="bg-yellow-100 text-yellow-800">{stats.pendingAppointments}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Urgent</span>
                <Badge className="bg-red-100 text-red-800">{stats.urgentAppointments}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cancelled</span>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-gray-100 text-gray-800">{stats.cancelledAppointments}</Badge>
                  <span className="text-sm text-gray-500">{stats.cancellationRate}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-indigo-600" />
              <span>Doctor Statistics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Approved</span>
                <Badge className="bg-green-100 text-green-800">{stats.approvedDoctors}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending</span>
                <Badge className="bg-yellow-100 text-yellow-800">{stats.pendingDoctors}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Rejected</span>
                <Badge className="bg-red-100 text-red-800">{stats.rejectedDoctors}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Treatment Notes</span>
                <Badge className="bg-blue-100 text-blue-800">{stats.totalTreatmentNotes}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5 text-gray-600" />
            <span>Recent System Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Calendar className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Appointments Created</p>
                  <p className="text-sm text-gray-600">{stats.totalAppointments} appointments in {selectedPeriod}</p>
                </div>
              </div>
              <Badge variant="secondary">{stats.totalAppointments}</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <Users className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">New Patients</p>
                  <p className="text-sm text-gray-600">{stats.totalPatients} patients registered in {selectedPeriod}</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">{stats.totalPatients}</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Treatment Notes</p>
                  <p className="text-sm text-gray-600">{stats.totalTreatmentNotes} notes created in {selectedPeriod}</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">{stats.totalTreatmentNotes}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span>Performance Metrics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats.completionRate}%</div>
              <div className="text-sm text-gray-600">Appointment Completion Rate</div>
              <div className="text-xs text-gray-500 mt-1">Target: 85%</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{stats.cancellationRate}%</div>
              <div className="text-sm text-gray-600">Cancellation Rate</div>
              <div className="text-xs text-gray-500 mt-1">Target: &lt;10%</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.urgentAppointments}</div>
              <div className="text-sm text-gray-600">Emergency Cases</div>
              <div className="text-xs text-gray-500 mt-1">This period</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReports; 