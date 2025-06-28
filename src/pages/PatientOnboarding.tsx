import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, User, Lock, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import axios from 'axios';

const PatientOnboarding = () => {
  const [mode, setMode] = useState<'choice' | 'login' | 'register'>('choice');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Login form state
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  // Registration form state
  const [registerData, setRegisterData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    age: '',
    gender: '',
    contact: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await axios.post('http://127.0.0.1:5000/api/login', loginData);
      if (res.data.role !== 'patient') {
        setError('Only patients can log in here.');
        return;
      }
      localStorage.setItem('user', JSON.stringify(res.data));
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => navigate('/patient'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        username: registerData.username,
        password: registerData.password,
        role: 'patient',
        name: registerData.name,
        age: registerData.age,
        gender: registerData.gender,
        contact: registerData.contact
      };
      
      await axios.post('http://127.0.0.1:5000/api/register', payload);
      setSuccess('Registration successful! You can now log in.');
      setTimeout(() => setMode('login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const updateLoginData = (field: string, value: string) => {
    setLoginData(prev => ({ ...prev, [field]: value }));
  };

  const updateRegisterData = (field: string, value: string) => {
    setRegisterData(prev => ({ ...prev, [field]: value }));
  };

  if (mode === 'choice') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-2xl shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">Welcome to CareCraft</CardTitle>
            <p className="text-xl text-gray-600">Your journey to better dental care starts here</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center mb-8">
              <p className="text-gray-700 mb-6">
                Join thousands of patients who trust CareCraft for their dental care management. 
                Book appointments, track your dental health, and connect with your care team seamlessly.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* New Patient */}
              <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500">
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-green-100 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                    <User className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">New Patient?</h3>
                  <p className="text-gray-600 mb-6">
                    Create your account and start managing your dental care journey
                  </p>
                  <Button 
                    onClick={() => setMode('register')}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Create Account <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              {/* Returning Patient */}
              <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
                <CardContent className="p-6 text-center">
                  <div className="p-3 bg-blue-100 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                    <Lock className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Returning Patient?</h3>
                  <p className="text-gray-600 mb-6">
                    Welcome back! Sign in to access your dental care dashboard
                  </p>
                  <Button 
                    onClick={() => setMode('login')}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Sign In <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="text-center pt-6 border-t border-gray-200">
              <Link to="/" className="text-blue-600 hover:text-blue-700 flex items-center justify-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
          </CardTitle>
          <p className="text-gray-600">
            {mode === 'login' 
              ? 'Sign in to access your dental care dashboard' 
              : 'Join CareCraft and start your dental care journey'
            }
          </p>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="mb-6">
              <AlertDescription className="text-green-700">{success}</AlertDescription>
            </Alert>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={loginData.username}
                  onChange={e => updateLoginData('username', e.target.value)}
                  placeholder="Enter your username"
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginData.password}
                  onChange={e => updateLoginData('password', e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
              
              <div className="text-center">
                <Button 
                  type="button" 
                  variant="link" 
                  onClick={() => setMode('register')}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Don't have an account? Create one
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reg-username">Username</Label>
                <Input
                  id="reg-username"
                  type="text"
                  value={registerData.username}
                  onChange={e => updateRegisterData('username', e.target.value)}
                  placeholder="Choose a username"
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reg-password">Password</Label>
                <Input
                  id="reg-password"
                  type="password"
                  value={registerData.password}
                  onChange={e => updateRegisterData('password', e.target.value)}
                  placeholder="Create a password"
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reg-confirm-password">Confirm Password</Label>
                <Input
                  id="reg-confirm-password"
                  type="password"
                  value={registerData.confirmPassword}
                  onChange={e => updateRegisterData('confirmPassword', e.target.value)}
                  placeholder="Confirm your password"
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reg-name">Full Name</Label>
                <Input
                  id="reg-name"
                  type="text"
                  value={registerData.name}
                  onChange={e => updateRegisterData('name', e.target.value)}
                  placeholder="Enter your full name"
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-age">Age</Label>
                  <Input
                    id="reg-age"
                    type="number"
                    value={registerData.age}
                    onChange={e => updateRegisterData('age', e.target.value)}
                    placeholder="Age"
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reg-gender">Gender</Label>
                  <Select value={registerData.gender} onValueChange={(value) => updateRegisterData('gender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reg-contact">Contact Number</Label>
                <Input
                  id="reg-contact"
                  type="tel"
                  value={registerData.contact}
                  onChange={e => updateRegisterData('contact', e.target.value)}
                  placeholder="Enter your contact number"
                  required
                  disabled={loading}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
              
              <div className="text-center">
                <Button 
                  type="button" 
                  variant="link" 
                  onClick={() => setMode('login')}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Already have an account? Sign in
                </Button>
              </div>
            </form>
          )}
          
          <div className="text-center pt-6 border-t border-gray-200">
            <Button 
              type="button" 
              variant="link" 
              onClick={() => setMode('choice')}
              className="text-gray-600 hover:text-gray-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Options
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientOnboarding; 