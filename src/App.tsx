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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
