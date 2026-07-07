import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loginUser, error, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // For now while testing, loginUser will let you through
    const success = await loginUser(email, password);
    if (success) {
      navigate('/dashboard'); // Fixed path to match App.jsx route
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-slate-950 text-slate-100">
      <form onSubmit={handleSubmit} className="bg-slate-900 p-8 rounded-lg border border-slate-800 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-emerald-400">Welcome to HuddleUp</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <input
          type="email"
          placeholder="Email address"
          className="w-full p-3 mb-4 bg-slate-950 border border-slate-800 rounded text-slate-100 focus:outline-none focus:border-emerald-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 bg-slate-950 border border-slate-800 rounded text-slate-100 focus:outline-none focus:border-emerald-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded font-medium transition-colors"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
    </div>
  );
};

export default Login;