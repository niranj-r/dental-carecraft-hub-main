
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Calendar, 
  Users, 
  Shield, 
  Heart, 
  Stethoscope, 
  Clock, 
  Star,
  ArrowRight,
  CheckCircle,
  MessageCircle,
  CreditCard,
  BarChart3
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Welcome to <span className="text-blue-600">CareCraft</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Where Smiles Meet Smart Scheduling! 🦷
            </p>
            <p className="text-lg text-gray-700 mb-12 max-w-4xl mx-auto">
              Managing dental health should be as comfortable as the smile it protects. 
              Our Smart Dental Management System is designed not just for convenience, but for care.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-blue-200 hover:bg-blue-50">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Portal Access Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-8">
            Access Your Portal
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            Choose your role to access the appropriate dashboard
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Patient Portal */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-l-4 border-l-green-500">
              <CardContent className="p-8 text-center">
                <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Heart className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Patient Portal</h3>
                <p className="text-gray-600 mb-6">
                  Book appointments, view history, and manage your dental care
                </p>
                <Link to="/patient">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Enter Patient Portal <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Doctor Portal */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500">
              <CardContent className="p-8 text-center">
                <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Stethoscope className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Doctor Portal</h3>
                <p className="text-gray-600 mb-6">
                  Manage appointments, view patient records, and provide care
                </p>
                <Link to="/doctor">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Enter Doctor Portal <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Admin Portal */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-l-4 border-l-purple-500">
              <CardContent className="p-8 text-center">
                <div className="p-4 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Admin Portal</h3>
                <p className="text-gray-600 mb-6">
                  Manage clinic operations, staff, and system settings
                </p>
                <Link to="/admin">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Enter Admin Portal <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Designed for Everyone in Dental Care
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Patient Card */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-l-4 border-l-green-500">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-green-100 rounded-full mr-4">
                    <Heart className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">For Patients</h3>
                </div>
                
                <p className="text-gray-600 mb-6 text-lg">
                  🌟 No more endless phone calls or guesswork.
                </p>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Book appointments with real-time availability</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Interactive dental diagram for precise symptom reporting</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">AI-powered chatbot for symptom assessment</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Secure payments and treatment history</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Doctor Card */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-blue-100 rounded-full mr-4">
                    <Stethoscope className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">For Doctors</h3>
                </div>
                
                <p className="text-gray-600 mb-6 text-lg">
                  🩺 Your digital assistant is here.
                </p>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Daily appointments and patient details at a glance</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Pre-appointment symptom reports and AI triage</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Quick treatment notes and follow-up recommendations</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Streamlined workflow management</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Admin Card */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-l-4 border-l-purple-500">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-purple-100 rounded-full mr-4">
                    <Shield className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">For Admins</h3>
                </div>
                
                <p className="text-gray-600 mb-6 text-lg">
                  🧾 Keep the clinic running like clockwork.
                </p>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-purple-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Central dashboard for doctors and schedules</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-purple-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Payment tracking and insightful reports</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-purple-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Dynamic scheduling with emergency handling</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-purple-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Optimize staffing and clinic operations</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Smart Features Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              🧠 Smarter, Not Just Faster
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              CareCraft combines cutting-edge technology with healthcare expertise
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">AI Chatbot</h3>
              <p className="text-gray-600 text-sm">Guided symptom reporting with intelligent assistance</p>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <Clock className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Smart Triaging</h3>
              <p className="text-gray-600 text-sm">Helps doctors prioritize urgent cases efficiently</p>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Secure Access</h3>
              <p className="text-gray-600 text-sm">Role-based login with JWT authentication</p>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CreditCard className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Digital Payments</h3>
              <p className="text-gray-600 text-sm">Seamless Razorpay & Stripe integration</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            What Our Users Say
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "CareCraft transformed how we manage our dental practice. The AI chatbot helps patients 
                describe their symptoms clearly, and the scheduling system eliminated double bookings completely."
              </p>
              <div className="font-semibold text-gray-900">Dr. Sarah Johnson</div>
              <div className="text-gray-600 text-sm">Dental Clinic Director</div>
            </Card>
            
            <Card className="p-6">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "As a patient, I love how easy it is to book appointments and explain exactly which tooth 
                is bothering me. The interactive diagram is genius!"
              </p>
              <div className="font-semibold text-gray-900">Michael Chen</div>
              <div className="text-gray-600 text-sm">Happy Patient</div>
            </Card>
            
            <Card className="p-6">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "The admin dashboard gives us incredible insights into our practice. Payment tracking 
                and reporting features have streamlined our operations significantly."
              </p>
              <div className="font-semibold text-gray-900">Lisa Rodriguez</div>
              <div className="text-gray-600 text-sm">Practice Manager</div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Dental Practice?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            CareCraft isn't just software — it's the bridge between healthcare and happiness. 
            Let's make dental care modern, mindful, and magical.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg">
              Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg">
              Schedule Demo
            </Button>
          </div>
          <p className="text-lg mt-8 opacity-75">
            Let's CareCraft. 🪥
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
