import React, { useRef, useState } from 'react';
import { Navigate, Link, useLocation } from 'react-router-dom';
import { DollarSign, TrendingUp, MessageCircle, BookOpen, Award, Users } from 'lucide-react';
import './login.css';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const message = location.state?.message;
  const loginSectionRef = useRef<HTMLDivElement>(null);

  if (isLoggedIn) {
    return <Navigate to="/roadmap" replace />;
  }

  const scrollToLogin = () => {
    loginSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Store the token in localStorage or a secure storage method
        localStorage.setItem('token', data.access_token);
        setIsLoggedIn(true);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="landing-page">
      <div className="hero-section">
        <h1 className="hero-title">Welcome to Centsify</h1>
        <p className="hero-subtitle">Gamifying financial literacy to empower your future</p>
        <button onClick={scrollToLogin} className="cta-button">
          Get Started
        </button>
      </div>

        <div className="who-we-are-section">
        <div className="who-we-are-content">
          <h2 className="who-we-are-title">Who We Are</h2>
          <p className="who-we-are-description">
            Centsify is an innovative tool that transforms financial education into an engaging and interactive experience. We believe that understanding money shouldn't be a chore, but an exciting journey of discovery and growth.
          </p>
        </div>
      </div>

      <div className="section bg-white">
        <h2 className="section-title">Our Features</h2>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="feature-card">
              <TrendingUp className="w-12 h-12 text-indigo-600 mb-4" />
              <h3 className="feature-title">Finance Roadmap</h3>
              <p className="feature-description">Personalized learning paths to guide you through financial concepts at your own pace.</p>
            </div>
            <div className="feature-card">
              <DollarSign className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="feature-title">Paper Trading</h3>
              <p className="feature-description">Practice investing in a risk-free environment with our realistic stock market simulator.</p>
            </div>
            <div className="feature-card">
              <MessageCircle className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="feature-title">AI Chatbot</h3>
              <p className="feature-description">Get instant answers to your financial questions from our intelligent chatbot assistant.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Why Choose Us</h2>
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="why-us-item">
            <div className="why-us-icon">
              <BookOpen className="w-6 h-6" />
            </div>
            <p>Financial literacy is often overlooked in traditional education</p>
          </div>
          <div className="why-us-item">
            <div className="why-us-icon">
              <Award className="w-6 h-6" />
            </div>
            <p>Our gamified approach makes learning finance fun and rewarding</p>
          </div>
          <div className="why-us-item">
            <div className="why-us-icon">
              <Users className="w-6 h-6" />
            </div>
            <p>Join a community of like-minded individuals on the path to financial success</p>
          </div>
        </div>
      </div>

      <div ref={loginSectionRef} className="login-section">
        <div className="login-container">
          <h2 className="login-title">Login to your account</h2>
          {message && (
            <p className="login-message">
              {message}
            </p>
          )}
          {error && (
            <p className="error-message">
              {error}
            </p>
          )}
          <form onSubmit={handleLogin} className="login-form">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-input"
              style={{
                width: '100%',          // Make inputs take the full width of their container
                padding: '10px',       // Add padding for better touch targets
                border: '1px solid #ccc', // Set a border color
                borderRadius: '5px',   // Slightly round the corners
                marginBottom: '16px',  // Add space between inputs
                fontSize: '16px'       // Adjust font size for better readability
            }}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              style={{
                width: '100%',          // Make inputs take the full width of their container
                padding: '10px',       // Add padding for better touch targets
                border: '1px solid #ccc', // Set a border color
                borderRadius: '5px',   // Slightly round the corners
                marginBottom: '16px',  // Add space between inputs
                fontSize: '16px'       // Adjust font size for better readability
            }}
              required
            />
            <button type="submit" className="login-button">
              Log In
            </button>
          </form>
          <p className="signup-text">
            Don't have an account?{' '}
            <Link to="/signup" className="signup-link">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      <footer className="footer">
        <p>&copy; 2024 Centsify. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Login