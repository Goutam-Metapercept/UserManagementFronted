import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import MainPage from './components/MainPage'
import Login from './components/Login'
import Signup from './components/Signup'
import Profile from './components/Profile'
import Dashboard from './components/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
function App() {
  

  return (
   <Router>
    <div className="app">
    <Navbar />
      <Routes>
        <Route path="/" element={<MainPage/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/dashboard" 
        element={
          <ProtectedRoute>
          <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>
   </div>
   </Router>
  )
}

export default App
