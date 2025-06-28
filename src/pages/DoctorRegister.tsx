import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, User, Lock, Eye, EyeOff, GraduationCap, Phone, Mail } from 'lucide-react';

const DoctorRegister = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    specialty: '',
    contact: '',
    email: '',
    licenseNumber: '',
    experience: '',
    education: '',
    adminCode: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    if (!formData.adminCode || formData.adminCode !== 'DENTAL2024') {
      setError('Invalid admin authorization code');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const payload = {
        username: formData.username,
        password: formData.password,
        role: 'doctor',
        name: formData.name,
        specialty: formData.specialty,
        contact: formData.contact,
        email: formData.email,
        licenseNumber: formData.licenseNumber,
        experience: formData.experience,
        education: formData.education,
        status: 'pending_approval' // Requires admin approval
      };

      await axios.post('http://127.0.0.1:5000/api/register', payload);
      
      setSuccess('Registration submitted successfully! Your account is pending admin approval. You will be notified once approved.');
      
      // Log registration attempt for security
      console.log(`Doctor registration submitted: ${formData.username} at ${new Date().toISOString()}`);
      
      setTimeout(() => navigate('/doctor-login'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const specialties = [
    'General Dentistry',
    'Orthodontics',
    'Oral Surgery',
    'Periodontics',
    'Endodontics',
    'Pediatric Dentistry',
    'Prosthodontics',
    'Oral Medicine',
    'Dental Public Health'
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Doctor Registration</CardTitle>
          <p className="text-gray-600">Apply for medical staff access</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert>
                <AlertDescription className="text-green-700">{success}</AlertDescription>
              </Alert>
            )}

            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Full Name *</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={e => handleInputChange('name', e.target.value)}
                    placeholder="Dr. John Smith"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialty" className="flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4" />
                    <span>Specialty *</span>
                  </Label>
                  <Select value={formData.specialty} onValueChange={(value) => handleInputChange('specialty', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map(specialty => (
                        <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact" className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>Contact Number *</span>
                  </Label>
                  <Input
                    id="contact"
                    type="tel"
                    value={formData.contact}
                    onChange={e => handleInputChange('contact', e.target.value)}
                    placeholder="+1 234-567-8900"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>Email Address *</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={e => handleInputChange('email', e.target.value)}
                    placeholder="doctor@example.com"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">Medical License Number *</Label>
                  <Input
                    id="licenseNumber"
                    type="text"
                    value={formData.licenseNumber}
                    onChange={e => handleInputChange('licenseNumber', e.target.value)}
                    placeholder="MD123456"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience *</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={formData.experience}
                    onChange={e => handleInputChange('experience', e.target.value)}
                    placeholder="5"
                    min="0"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="education">Education & Certifications</Label>
                <Textarea
                  id="education"
                  value={formData.education}
                  onChange={e => handleInputChange('education', e.target.value)}
                  placeholder="List your degrees, certifications, and relevant training..."
                  rows={3}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Account Credentials */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Account Credentials</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Username *</span>
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={e => handleInputChange('username', e.target.value)}
                    placeholder="dr.smith"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center space-x-2">
                    <Lock className="w-4 h-4" />
                    <span>Password *</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={e => handleInputChange('password', e.target.value)}
                      placeholder="Minimum 8 characters"
                      required
                      disabled={loading}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-10 px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="flex items-center space-x-2">
                  <Lock className="w-4 h-4" />
                  <span>Confirm Password *</span>
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={e => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirm your password"
                    required
                    disabled={loading}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-10 px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>

            {/* Admin Authorization */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Admin Authorization</h3>
              
              <div className="space-y-2">
                <Label htmlFor="adminCode">Administrator Authorization Code *</Label>
                <Input
                  id="adminCode"
                  type="password"
                  value={formData.adminCode}
                  onChange={e => handleInputChange('adminCode', e.target.value)}
                  placeholder="Enter admin code"
                  required
                  disabled={loading}
                />
                <p className="text-xs text-gray-600">
                  Contact the system administrator to obtain the authorization code.
                </p>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              disabled={loading}
            >
              {loading ? 'Submitting Application...' : 'Submit Application'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Already have an account?
              </p>
              <Button 
                variant="link" 
                className="text-blue-600 hover:text-blue-700"
                onClick={() => navigate('/doctor-login')}
              >
                Login to Doctor Portal
              </Button>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              🔒 All applications are reviewed by administrators. Medical credentials will be verified for patient safety.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorRegister; 