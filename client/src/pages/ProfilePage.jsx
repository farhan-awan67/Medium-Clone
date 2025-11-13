import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "../features/authSlice";
import Loading from "../components/Loading";

const ProfilePage = () => {
  const { user, loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({
    name: "",
    bio: "Writer. Dreamer. Coffee lover.",
    avatarUrl: "",
  });

  const handleChange = (e) => {
    return setUserData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For now, just show preview
      setUserData((prev) => {
        return { ...prev, avatarUrl: file };
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit formData to API
    const isValid =
      userData.name.trim() !== "" &&
      userData.bio.trim() !== "" &&
      userData.avatarUrl instanceof File;

    if (!isValid) return;

    const formData = new FormData();
    formData.append("name", userData.name.trim());
    formData.append("bio", userData.bio.trim());
    formData.append("avatarUrl", userData.avatarUrl);

    dispatch(updateUserProfile(formData));
    setUserData({
      name: "",
      bio: "",
      avatarUrl: "",
    });
  };

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || "",
        bio: user.bio || "",
        avatarUrl: user.avatarUrl || "",
      });
    }
  }, [user]);

  if (loading) {
    return <Loading className="w-8 h-8 mt-6" />;
  }
  // error
  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Upload */}
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100">
            {userData.avatarUrl && !(userData.avatarUrl instanceof File) ? (
              <img
                src={userData.avatarUrl}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : userData.avatarUrl instanceof File ? (
              <img
                src={URL.createObjectURL(userData.avatarUrl)}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="text-sm cursor-pointer"
            />
          </div>
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            name="username"
            value={user?.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border bg-gray-100 rounded-md text-gray-500 cursor-not-allowed"
            minLength={3}
            required
            readOnly
          />
        </div>

        {/* Email (Readonly) */}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={user?.email}
            readOnly
            className="w-full px-4 py-2 border bg-gray-100 rounded-md text-gray-500 cursor-not-allowed"
          />
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea
            name="bio"
            rows="4"
            value={userData.bio}
            onChange={handleChange}
            placeholder="Write a short bio..."
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
