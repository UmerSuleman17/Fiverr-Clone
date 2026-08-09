import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/common/ProtectedRoutes';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import GigDetail from './pages/GigDetail';
import CreateGig from './pages/CreatedGig';
import EditGig from './pages/EditGig';
import Orders from './pages/Orders';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import Wishlist from './pages/Wishlist';
import Chat from './pages/Chat';
import './index.css';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          <Route path="/gig/:id" element={<GigDetail />} />
          
          {/* Protected Routes */}
          <Route path="/create-gig" element={
            <ProtectedRoute roles={['seller']}>
              <CreateGig />
            </ProtectedRoute>
          } />
          <Route path="/edit-gig/:id" element={
            <ProtectedRoute roles={['seller']}>
              <EditGig />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute roles={['seller', 'admin']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute roles={['admin']}>
              <AdminPanel />
            </ProtectedRoute>
          } />
          <Route path="/wishlist" element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          } />
          <Route path="/chat" element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;