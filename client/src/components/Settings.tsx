import React, { useState, useEffect } from 'react';

interface SettingsTileProps {
  title: string;
  onClick: () => void;
}

const SettingsTile: React.FC<SettingsTileProps> = ({ title, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white p-4 rounded-lg flex items-center justify-between cursor-pointer"
  >
    <span className="text-gray-800">{title}</span>
    <span className="text-gray-500"></span>
  </div>
);

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTileClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleBack = () => {
    setActiveTab(null);
  };

  return isMobile ? (
    <div className="container mx-auto px-4 py-8">
      {activeTab && (
        <button onClick={handleBack} className="mb-4 text-blue-500">
          ← Back
        </button>
      )}
      {activeTab === 'appearance' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Appearance Settings</h2>
          <label className="flex items-center mb-4">
            <span className="mr-2">Dark Mode</span>
            <input type="checkbox" className="toggle" />
          </label>
        </div>
      )}
      {activeTab === 'quiz' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Quiz Preferences</h2>
          <div className="mb-4">
            <label className="block mb-2">
              Time Limit for Each Question (in seconds)
            </label>
            <input type="number" className="input" placeholder="e.g., 30" />
          </div>
          <div className="mb-4">
            <label className="block mb-2">
              Time Limit for Multiple Choice Questions (in seconds)
            </label>
            <input type="number" className="input" placeholder="e.g., 60" />
          </div>
          <div className="mb-4">
            <label className="block mb-2">
              Time Limit for Fill-in-the-Blank Questions (in seconds)
            </label>
            <input type="number" className="input" placeholder="e.g., 45" />
          </div>
          <div className="mb-4">
            <label className="block mb-2">
              Time Limit for True/False Questions (in seconds)
            </label>
            <input type="number" className="input" placeholder="e.g., 30" />
          </div>
          <div className="mb-4">
            <label className="block mb-2">
              Time Limit for Theory Questions (in seconds)
            </label>
            <input type="number" className="input" placeholder="e.g., 120" />
          </div>
        </div>
      )}
      {activeTab === 'notifications' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
          <div>
            <label className="mb-2 flex items-center">
              <input type="checkbox" className="mr-2" /> Email Notifications
            </label>
            <label className="mb-2 flex items-center">
              <input type="checkbox" className="mr-2" /> App Notifications
            </label>
            <label className="mb-2 flex items-center">
              <input type="checkbox" className="mr-2" /> Reminders to Learn
            </label>
            <label className="mb-2 flex items-center">
              <input type="checkbox" className="mr-2" /> Friend Invites
            </label>
          </div>
        </div>
      )}
      {activeTab === 'security' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
          <button className="btn btn-primary mb-2">Change Password</button>
          <button className="btn btn-primary">
            Enable Two-Step Verification
          </button>
        </div>
      )}
      {activeTab === 'privacy' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Privacy Settings</h2>
          <label className="mb-2 flex items-center">
            <input type="checkbox" className="mr-2" /> Make Profile Private
          </label>
          <label className="mb-2 flex items-center">
            <input type="checkbox" className="mr-2" /> Hide Email Address
          </label>
        </div>
      )}
      {activeTab === 'account' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
          <button className="btn btn-danger mb-2">Delete Account</button>
          <button className="btn btn-warning">Freeze Account</button>
        </div>
      )}
      {!activeTab && (
        <>
          <h2 className="text-2xl font-semibold mb-4">Settings</h2>
          <SettingsTile
            title="Appearance"
            onClick={() => handleTileClick('appearance')}
          />
          <SettingsTile
            title="Quiz Preferences"
            onClick={() => handleTileClick('quiz')}
          />
          <SettingsTile
            title="Notifications"
            onClick={() => handleTileClick('notifications')}
          />
          <SettingsTile
            title="Security"
            onClick={() => handleTileClick('security')}
          />
          <SettingsTile
            title="Privacy"
            onClick={() => handleTileClick('privacy')}
          />
          <SettingsTile
            title="Account Settings"
            onClick={() => handleTileClick('account')}
          />
        </>
      )}
    </div>
  ) : (
    <div className="container mx-auto px-4 py-8">
      <div className="tabs mb-4">
        <ul className="flex flex-wrap md:flex-nowrap border-b">
          {[
            'appearance',
            'quiz',
            'notifications',
            'security',
            'privacy',
            'account',
          ].map((tab) => (
            <li
              key={tab}
              className={`tab cursor-pointer p-2 md:px-4 md:py-2 transition-colors ${
                activeTab === tab
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-600 border-transparent'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </li>
          ))}
        </ul>
      </div>

      <div className="settings-content">
        {activeTab === 'appearance' && (
          <div className="settings-section">
            <h2 className="text-xl font-semibold mb-4">Appearance Settings</h2>
            <label className="flex items-center mb-4">
              <span className="mr-2">Dark Mode</span>
              <input type="checkbox" className="toggle" />
            </label>
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="settings-section">
            <h2 className="text-xl font-semibold mb-4">Quiz Preferences</h2>
            <div className="mb-4">
              <label className="block mb-2">
                Time Limit for Each Question (in seconds)
              </label>
              <input type="number" className="input" placeholder="e.g., 30" />
            </div>
            <div className="mb-4">
              <label className="block mb-2">
                Time Limit for Multiple Choice Questions (in seconds)
              </label>
              <input type="number" className="input" placeholder="e.g., 60" />
            </div>
            <div className="mb-4">
              <label className="block mb-2">
                Time Limit for Fill-in-the-Blank Questions (in seconds)
              </label>
              <input type="number" className="input" placeholder="e.g., 45" />
            </div>
            <div className="mb-4">
              <label className="block mb-2">
                Time Limit for True/False Questions (in seconds)
              </label>
              <input type="number" className="input" placeholder="e.g., 30" />
            </div>
            <div className="mb-4">
              <label className="block mb-2">
                Time Limit for Theory Questions (in seconds)
              </label>
              <input type="number" className="input" placeholder="e.g., 120" />
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="settings-section">
            <h2 className="text-xl font-semibold mb-4">
              Notification Settings
            </h2>
            <div>
              <label className="mb-2 flex items-center">
                <input type="checkbox" className="mr-2" /> Email Notifications
              </label>
              <label className="mb-2 flex items-center">
                <input type="checkbox" className="mr-2" /> App Notifications
              </label>
              <label className="mb-2 flex items-center">
                <input type="checkbox" className="mr-2" /> Reminders to Learn
              </label>
              <label className="mb-2 flex items-center">
                <input type="checkbox" className="mr-2" /> Friend Invites
              </label>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="settings-section">
            <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
            <button className="btn btn-primary mb-2">Change Password</button>
            <button className="btn btn-primary">
              Enable Two-Step Verification
            </button>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="settings-section">
            <h2 className="text-xl font-semibold mb-4">Privacy Settings</h2>
            <label className="mb-2 flex items-center">
              <input type="checkbox" className="mr-2" /> Make Profile Private
            </label>
            <label className="mb-2 flex items-center">
              <input type="checkbox" className="mr-2" /> Hide Email Address
            </label>
          </div>
        )}

        {activeTab === 'account' && (
          <div className="settings-section">
            <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
            <button className="btn btn-danger mb-2">Delete Account</button>
            <button className="btn btn-warning">Freeze Account</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
