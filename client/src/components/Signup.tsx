import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Signup: React.FC = () => {
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',  // Added username
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password) {
      setError('All fields are required');
      return false;
    }
    // if (formData.password !== formData.confirmPassword) {
    //   setError('Passwords do not match');
    //   return false;
    // }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    return true;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      // Send the signup data to the Flask API
      const dbSignupUrl = `${import.meta.env.VITE_API_URL}/api/register`;
      const response = await axios.post(dbSignupUrl, {
        username: formData.username,  // Include username
        email: formData.email,
        password: formData.password
      });

      console.log('Signup response:', response.data);

      // Redirect user to login page after successful signup
      navigate('/login', { state: { message: 'Signup successful! Please log in.' } });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response?.data || error.message);
        if (error.response) {
          setError(`Error: ${error.response.data.message || error.response.data.errors.join(', ') || error.message}`);
        } else if (error.request) {
          setError('No response received from the server. Please try again.');
        } else {
          setError(`Error: ${error.message}`);
        }
      } else {
        console.error('Non-Axios error:', error);
        setError('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5e6d3] py-12">
      <div className="bg-[#fff3e0] rounded-lg shadow-md max-w-md w-full p-8">
        <h2 className="text-3xl font-extrabold text-[#6d4c41] text-center mb-6">Create your account</h2>
        <form className="space-y-6" onSubmit={handleSignup}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="w-full px-4 py-2 border border-grey-500 rounded-md bg-white text-gray-900"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-2 border border-grey-500 rounded-md bg-white text-gray-900"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="w-full px-4 py-2 border border-grey-500 rounded-md bg-white text-gray-900"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#a1887f] text-[#fff3e0] font-semibold rounded-md hover:bg-[#8d6e63] transition-colors"
            >
              {isLoading ? 'Signing up...' : 'Sign up'}
            </button>
          </div>
        </form>

        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-[#8d6e63] hover:text-[  #6d4c41]">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;