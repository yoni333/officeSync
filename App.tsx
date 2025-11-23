import React, { useEffect, useState } from 'react';
import { authService } from './services/authService';
import { User } from './types';
import { Login } from './components/Login';
import { MySchedule } from './components/MySchedule';
import { TeamRoster } from './components/TeamRoster';
import { APP_NAME } from './constants';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'myschedule' | 'roster'>('myschedule');
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((u) => {
      setUser(u);
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    await authService.logout();
  };

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-primary flex items-center gap-2">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                {APP_NAME}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">{user.displayName}</span>
                {user.photoURL && (
                  <img className="h-8 w-8 rounded-full border border-gray-200" src={user.photoURL} alt="" />
                )}
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-red-600 transition-colors font-medium"
              >
                התנתק
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 space-x-reverse rounded-xl bg-blue-900/5 p-1 mb-8 max-w-md mx-auto sm:mr-0">
          <button
            onClick={() => setActiveTab('myschedule')}
            className={`w-full rounded-lg py-2.5 text-sm font-bold leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 transition-all
              ${activeTab === 'myschedule'
                ? 'bg-white text-primary shadow'
                : 'text-gray-600 hover:bg-white/[0.12] hover:text-primary'
              }`}
          >
            העדכון שלי
          </button>
          <button
            onClick={() => setActiveTab('roster')}
            className={`w-full rounded-lg py-2.5 text-sm font-bold leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 transition-all
              ${activeTab === 'roster'
                ? 'bg-white text-primary shadow'
                : 'text-gray-600 hover:bg-white/[0.12] hover:text-primary'
              }`}
          >
            מצב צוות
          </button>
        </div>

        {/* Tab Content */}
        <div className="transition-opacity duration-300">
          {activeTab === 'myschedule' ? (
            <MySchedule user={user} />
          ) : (
            <TeamRoster />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;