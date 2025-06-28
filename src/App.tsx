import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PatientDashboard from "./pages/patient/PatientDashboard";
import BookAppointment from "./pages/patient/BookAppointment";
import AppointmentHistory from "./pages/patient/AppointmentHistory";
import PaymentsPage from "./pages/patient/PaymentsPage";
import PatientLayout from "./components/patient/PatientLayout";
import DoctorLayout from "./components/doctor/DoctorLayout";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorSchedule from "./pages/doctor/DoctorSchedule";
import PatientRecords from "./pages/doctor/PatientRecords";
import TreatmentNotes from "./pages/doctor/TreatmentNotes";
import Login from './pages/Login';
import Register from './pages/Register';
import DoctorLogin from './pages/DoctorLogin';
import DoctorRegister from './pages/DoctorRegister';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import Messages from "./pages/patient/Messages";
import PatientOnboarding from './pages/PatientOnboarding';
import Tooth3DViewer from './pages/patient/Tooth3DViewer';

// Admin pages
import AdminPatients from './pages/admin/AdminPatients';
import AdminAppointments from './pages/admin/AdminAppointments';
import AdminTreatmentNotes from './pages/admin/AdminTreatmentNotes';
import AdminDoctors from './pages/admin/AdminDoctors';
import AdminEmergencyScheduling from './pages/admin/AdminEmergencyScheduling';
import AdminReports from './pages/admin/AdminReports';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/patient" element={<PatientLayout />}>
            <Route index element={<PatientDashboard />} />
            <Route path="book" element={<BookAppointment />} />
            <Route path="history" element={<AppointmentHistory />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="messages" element={<Messages />} />
            <Route path="tooth-3d" element={<Tooth3DViewer />} />
          </Route>
          <Route path="/doctor" element={<DoctorLayout />}>
            <Route index element={<DoctorDashboard />} />
            <Route path="schedule" element={<DoctorSchedule />} />
            <Route path="patients" element={<PatientRecords />} />
            <Route path="notes" element={<TreatmentNotes />} />
            <Route path="history" element={<AppointmentHistory />} />
            <Route path="reports" element={<DoctorDashboard />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/doctor-login" element={<DoctorLogin />} />
          <Route path="/doctor-register" element={<DoctorRegister />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          
          {/* Admin Routes */}
          <Route path="/admin/patients" element={<AdminPatients />} />
          <Route path="/admin/appointments" element={<AdminAppointments />} />
          <Route path="/admin/treatment-notes" element={<AdminTreatmentNotes />} />
          <Route path="/admin/doctors" element={<AdminDoctors />} />
          <Route path="/admin/emergency-scheduling" element={<AdminEmergencyScheduling />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          
          <Route path="/patient-onboarding" element={<PatientOnboarding />} />
          
          {/* ADD ALL CUSTOM ROUTES BELOW THE CATCH-ALL "*" ROUTE */}
          
          {/* Catch-all route for 404 Not Found */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
