import React, { useState, useEffect } from "react";
import { api } from "@/services/quizService";

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    avatar: "",
    bio: "",
    joined: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(user);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const response = await api.get("/user/profile", {
        withCredentials: true,
      });
      setUser(response.data);
      setUpdatedUser(response.data);
    };
    fetchUserProfile();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAvatarFile(e.target.files[0]);
    } else {
      setAvatarFile(null); // Handle the case where no file is selected
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", updatedUser.name);
    formData.append("email", updatedUser.email);
    formData.append("bio", updatedUser.bio);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    try {
      await api.put("/user/profile", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-4">
      <div className="flex items-center mb-6">
        <img
          src={user.avatar || "/default-avatar.png"}
          alt="User Avatar"
          className="w-24 h-24 rounded-full border-2 border-gray-300"
        />
        <div className="ml-4">
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap max-w-xs">
            {user.email}
          </p>
          <p className="text-gray-500">{`Joined: ${new Date(
            user.joined
          ).toLocaleDateString()}`}</p>
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              title="name"
              type="text"
              name="name"
              value={updatedUser.name}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              title="email"
              type="email"
              name="email"
              value={updatedUser.email}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Bio
            </label>
            <textarea
              title="bio"
              name="bio"
              value={updatedUser.bio}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Avatar
            </label>
            <input
              title="avatar"
              type="file"
              onChange={handleAvatarChange}
              accept=".jpg,.jpeg,.png"
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="mr-2 p-2 bg-gray-500 text-white rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="p-2 bg-blue-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      ) : (
        <div>
          <p className="mb-4">{user.bio || "No bio provided."}</p>
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 bg-blue-600 text-white rounded"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
