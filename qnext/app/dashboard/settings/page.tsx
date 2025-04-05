// app/dashboard/settings/page.tsx
'use client';

import { useState } from 'react';

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [studyReminders, setStudyReminders] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateSettings = async () => {
    try {
      setIsLoading(true);
      setSuccessMessage(null);
      setErrorMessage(null);

      const response = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          darkMode,
          notifications,
          studyReminders,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update settings');
      }

      setSuccessMessage('Settings updated successfully!');
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Settings</h1>

      {successMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
        <span className="block sm:inline">{successMessage}</span>
      </div>}

      {errorMessage && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
        <span className="block sm:inline">{errorMessage}</span>
      </div>}

      <div className="max-w-md">
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
            />
            <span className="ml-2 text-gray-700">Dark Mode</span>
          </label>
        </div>
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
            />
            <span className="ml-2 text-gray-700">Enable Notifications</span>
          </label>
        </div>
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
              checked={studyReminders}
              onChange={(e) => setStudyReminders(e.target.checked)}
            />
            <span className="ml-2 text-gray-700">Enable Study Reminders</span>
          </label>
        </div>

        <button onClick={handleUpdateSettings} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Settings'}
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;