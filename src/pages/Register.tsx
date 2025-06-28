import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [contact, setContact] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const payload = { username, password, role: 'patient', name, age, gender, contact };
      await axios.post('http://127.0.0.1:5000/api/register', payload);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Patient Registration</h2>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        {success && <div className="mb-4 text-green-600">{success}</div>}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Username</label>
          <input type="text" className="w-full border px-3 py-2 rounded" value={username} onChange={e => setUsername(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Password</label>
          <input type="password" className="w-full border px-3 py-2 rounded" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Name</label>
          <input type="text" className="w-full border px-3 py-2 rounded" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Age</label>
          <input type="number" className="w-full border px-3 py-2 rounded" value={age} onChange={e => setAge(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Gender</label>
          <select className="w-full border px-3 py-2 rounded" value={gender} onChange={e => setGender(e.target.value)} required>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium">Contact</label>
          <input type="text" className="w-full border px-3 py-2 rounded" value={contact} onChange={e => setContact(e.target.value)} required />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition">Register</button>
        <div className="mt-4 text-center">
          <a href="/login" className="text-blue-600 hover:underline">Already have an account? Login</a>
        </div>
      </form>
    </div>
  );
};

export default Register; 