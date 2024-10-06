import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate, Link, useLocation } from 'react-router-dom';

const Login: React.FC = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const location = useLocation();
  const message = location.state?.message;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Login to your account</h2>
        
        {message && (
          <p className="mt-2 text-center text-sm text-green-600">
            {message}
          </p>
        )}
        
        <button
          onClick={() => loginWithRedirect()}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Sign in with Auth0
        </button>
        <p className="mt-2 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;