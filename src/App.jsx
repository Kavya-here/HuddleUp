import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Login from './pages/Login';

// Temporary workspace container layout
const Dashboard = () => (
  <div className="flex items-center justify-center h-screen bg-slate-950 text-slate-100">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-emerald-400 mb-2">HuddleUp Workspace Live!</h1>
      <p className="text-slate-400">Day 6 setup running smoothly.</p>
    </div>
  </div>
);

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
