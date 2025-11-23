import React, { useState } from 'react';
import { authService } from '../services/authService';

export const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await authService.login();
    } catch (error) {
      console.error("Login failed", error);
      alert("שגיאה בהתחברות");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">HybridFlow</h2>
          <p className="mt-2 text-sm text-gray-600">
            ניהול נוכחות עובדים - משרד, בית והיעדרות.
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <button
            onClick={handleLogin}
            disabled={loading}
            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white ${loading ? 'bg-gray-400' : 'bg-primary hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transition-all`}
          >
             {loading ? 'מתחבר...' : 'כניסה באמצעות Google'}
          </button>
        </div>
      </div>
    </div>
  );
};