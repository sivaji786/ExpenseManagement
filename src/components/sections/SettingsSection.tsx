import { useState } from 'react';
import { User } from '../../types/types';
import { Bell, Lock, Globe, Mail, Moon, Sun } from 'lucide-react';

interface SettingsSectionProps {
  user: User;
}

export function SettingsSection({ user }: SettingsSectionProps) {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    darkMode: false,
    language: 'en',
    currency: 'INR',
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-2">Settings</h2>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      {/* Profile Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-gray-900">Profile Information</h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              defaultValue={user.name}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              defaultValue={user.email}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Role</label>
            <input
              type="text"
              value={user.role}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 capitalize"
            />
          </div>
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Update Profile
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-gray-700" />
            <h3 className="text-gray-900">Notifications</h3>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-900">Email Notifications</div>
              <div className="text-gray-600 text-sm">Receive email updates about your projects</div>
            </div>
            <button
              onClick={() => handleToggle('emailNotifications')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.emailNotifications ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-900">Push Notifications</div>
              <div className="text-gray-600 text-sm">Receive push notifications for urgent updates</div>
            </div>
            <button
              onClick={() => handleToggle('pushNotifications')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.pushNotifications ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-900">Weekly Reports</div>
              <div className="text-gray-600 text-sm">Receive weekly summary reports via email</div>
            </div>
            <button
              onClick={() => handleToggle('weeklyReports')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.weeklyReports ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.weeklyReports ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-gray-900">Preferences</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settings.darkMode ? (
                <Moon className="w-5 h-5 text-gray-700" />
              ) : (
                <Sun className="w-5 h-5 text-gray-700" />
              )}
              <div>
                <div className="text-gray-900">Dark Mode</div>
                <div className="text-gray-600 text-sm">Use dark theme across the application</div>
              </div>
            </div>
            <button
              onClick={() => handleToggle('darkMode')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.darkMode ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-5 h-5 text-gray-700" />
              <label className="text-gray-900">Language</label>
            </div>
            <select
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="mr">मराठी (Marathi)</option>
              <option value="ta">தமிழ் (Tamil)</option>
            </select>
          </div>

          <div>
            <label className="text-gray-900 mb-2 block">Currency</label>
            <select
              value={settings.currency}
              onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="INR">₹ Indian Rupee (INR)</option>
              <option value="USD">$ US Dollar (USD)</option>
              <option value="EUR">€ Euro (EUR)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-gray-700" />
            <h3 className="text-gray-900">Security</h3>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Change Password
          </button>
          <button className="w-full px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
