import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, User, Lock, Eye, EyeOff } from 'lucide-react';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Security: Check login attempts
    if (loginAttempts >= 5) {
      setError('Too many failed attempts. Please try again later.');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post('http://127.0.0.1:5000/api/admin/login', { username, password });
      
      if (res.data.role !== 'admin') {
        setLoginAttempts(prev => prev + 1);
        setError('Access denied. This portal is for administrators only.');
        return;
      }

      // Security: Store admin session with additional security
      const adminSession = {
        ...res.data,
        loginTime: new Date().toISOString(),
        sessionId: Math.random().toString(36).substring(2),
        userAgent: navigator.userAgent
      };
      
      localStorage.setItem('adminSession', JSON.stringify(adminSession));
      
      // Log successful login for security
      console.log(`Admin login successful: ${username} at ${new Date().toISOString()}`);
      
      navigate('/admin');
    } catch (err: any) {
      setLoginAttempts(prev => prev + 1);
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
      
      // Security: Log failed attempts
      console.warn(`Failed admin login attempt: ${username} at ${new Date().toISOString()}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-purple-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Admin Portal</CardTitle>
          <p className="text-gray-600">Secure administrative access</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {loginAttempts >= 3 && (
              <Alert>
                <AlertDescription className="text-orange-700">
                  ⚠️ Multiple failed attempts detected. Please verify your credentials.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Admin Username</span>
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter admin username"
                required
                disabled={loading}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center space-x-2">
                <Lock className="w-4 h-4" />
                <span>Admin Password</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                  disabled={loading}
                  className="h-11 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-11 px-3 py-2 hover:bg-transparent"
                  onClick={handlePasswordToggle}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white font-semibold"
              disabled={loading || loginAttempts >= 5}
            >
              {loading ? 'Authenticating...' : 'Login to Admin Portal'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                For authorized administrators only
              </p>
              <Button 
                variant="link" 
                className="text-purple-600 hover:text-purple-700"
                onClick={() => navigate('/')}
              >
                ← Back to Home
              </Button>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              🔒 This is a secure administrative portal. All access is logged and monitored for security purposes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin; 