import { useState } from 'react';
import { User } from '../types/types';
import { authService } from '../services/authService';
import { LogIn, Zap } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await authService.login(username, password);
      onLogin(user);
    } catch (err: any) {
      setError(err.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (username: string, password: string) => {
    setUsername(username);
    setPassword(password);
    setError('');
    setLoading(true);

    try {
      const user = await authService.login(username, password);
      onLogin(user);
    } catch (err: any) {
      setError(err.message || 'Login failed');
      setLoading(false);
    }
  };

  // Demo credentials for quick login
  const quickLoginCredentials = [
    { id: '1', name: 'Super Admin', username: 'admin', password: 'admin123', role: 'admin' as const },
    { id: '2', name: 'John Smith', username: 'manager1', password: 'manager123', role: 'manager' as const },
    { id: '3', name: 'Sarah Johnson', username: 'manager2', password: 'manager123', role: 'manager' as const },
    { id: '4', name: 'Mike Davis', username: 'manager3', password: 'manager123', role: 'manager' as const },
  ];

  const adminUsers = quickLoginCredentials.filter(u => u.role === 'admin');
  const managerUsers = quickLoginCredentials.filter(u => u.role === 'manager');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-indigo-900 mb-2">Expenditure Management System</h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter your username"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white text-gray-500">Quick Login</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {adminUsers.map(user => (
                <button
                  key={user.id}
                  onClick={() => handleQuickLogin(user.username, user.password)}
                  disabled={loading}
                  className="w-full flex items-center justify-between px-4 py-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="text-left">
                    <div className="text-gray-900">{user.name}</div>
                    <div className="text-gray-600">{user.username} / {user.password}</div>
                  </div>
                  <Zap className="w-5 h-5 text-purple-600" />
                </button>
              ))}

              {managerUsers.map(user => (
                <button
                  key={user.id}
                  onClick={() => handleQuickLogin(user.username, user.password)}
                  disabled={loading}
                  className="w-full flex items-center justify-between px-4 py-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="text-left">
                    <div className="text-gray-900">{user.name}</div>
                    <div className="text-gray-600">{user.username} / {user.password}</div>
                  </div>
                  <Zap className="w-5 h-5 text-green-600" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}