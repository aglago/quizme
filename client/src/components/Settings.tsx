import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Sun,
  Clock,
  Bell,
  Lock,
  Eye,
  User,
  ChevronLeft,
} from "lucide-react";

interface SettingsTileProps {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const SettingsTile: React.FC<SettingsTileProps> = ({
  title,
  icon,
  onClick,
}) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="bg-white p-4 rounded-lg flex items-center justify-between cursor-pointer transition-all duration-300 hover:bg-gray-50"
  >
    <div className="flex items-center">
      {icon}
      <span className="text-gray-800 ml-3">{title}</span>
    </div>
    <ChevronLeft className="text-gray-400 transform rotate-180" />
  </motion.div>
);

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleTileClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleBack = () => {
    setActiveTab(null);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "appearance":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-4">Appearance Settings</h2>
            <label className="flex items-center mb-4 cursor-pointer">
              <span className="mr-2">Dark Mode</span>
              <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input
                  type="checkbox"
                  name="toggle"
                  id="toggle"
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label
                  htmlFor="toggle"
                  className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                ></label>
              </div>
              <Sun className="text-yellow-500" size={20} />
            </label>
          </motion.div>
        );
      case "quiz":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-4">Quiz Preferences</h2>
            {[
              "Each Question",
              "Multiple Choice",
              "Fill-in-the-Blank",
              "True/False",
              "Theory",
            ].map((type) => (
              <div key={type} className="mb-4">
                <label className="block mb-2">
                  Time Limit for {type} Questions (in seconds)
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  placeholder={`e.g., ${type === "Theory" ? "120" : "30"}`}
                />
              </div>
            ))}
          </motion.div>
        );
      case "notifications":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-4">
              Notification Settings
            </h2>
            {[
              "Email Notifications",
              "App Notifications",
              "Reminders to Learn",
              "Friend Invites",
            ].map((setting) => (
              <label
                key={setting}
                className="flex items-center mb-4 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600"
                />{" "}
                <span className="ml-2">{setting}</span>
              </label>
            ))}
          </motion.div>
        );
      case "security":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">
              Change Password
            </button>
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Enable Two-Factor Authentication
            </button>
          </motion.div>
        );
      case "privacy":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-4">Privacy Settings</h2>
            <label className="flex items-center mb-4 cursor-pointer">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600"
              />{" "}
              <span className="ml-2">Make Profile Private</span>
            </label>
            <label className="flex items-center mb-4 cursor-pointer">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600"
              />{" "}
              <span className="ml-2">Hide Email Address</span>
            </label>
          </motion.div>
        );
      case "account":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-4">
              Delete Account
            </button>
            <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
              Deactivate Account
            </button>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* <h1 className="text-3xl font-bold mb-6">Settings</h1> */}
      {isMobile && activeTab && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleBack}
          className="mb-4 text-blue-500 flex items-center"
        >
          <ChevronLeft className="mr-1" /> Back
        </motion.button>
      )}
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div
          className={`md:col-span-1 ${isMobile && activeTab ? "hidden" : ""}`}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SettingsTile
            title="Appearance"
            icon={<Sun size={20} />}
            onClick={() => handleTileClick("appearance")}
          />
          <SettingsTile
            title="Quiz Preferences"
            icon={<Clock size={20} />}
            onClick={() => handleTileClick("quiz")}
          />
          <SettingsTile
            title="Notifications"
            icon={<Bell size={20} />}
            onClick={() => handleTileClick("notifications")}
          />
          <SettingsTile
            title="Security"
            icon={<Lock size={20} />}
            onClick={() => handleTileClick("security")}
          />
          <SettingsTile
            title="Privacy"
            icon={<Eye size={20} />}
            onClick={() => handleTileClick("privacy")}
          />
          <SettingsTile
            title="Account"
            icon={<User size={20} />}
            onClick={() => handleTileClick("account")}
          />
        </motion.div>
        <motion.div
          className="md:col-span-2"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
