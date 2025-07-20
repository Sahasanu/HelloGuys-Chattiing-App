import { useEffect, useState } from 'react';
import useAuthUser from '../hooks/useAuthUser.js';
import { updateProfile, deleteAccount, changePassword } from '../lib/api.js';
import toast from 'react-hot-toast';

function ProfileSettings() {
  const { authUser, setAuthUser } = useAuthUser();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    profilePic: '',
    newPassword: '',
  });

  useEffect(() => {
    if (authUser) {
      setFormData({
        fullName: authUser.fullName || '',
        bio: authUser.bio || '',
        profilePic: authUser.profilePic || '',
        newPassword: '',
      });
    }
  }, [authUser]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const updated = await updateProfile(formData);
      setAuthUser(updated);
      localStorage.setItem('chat-user', JSON.stringify(updated));
      toast.success("Profile updated");
      setEditMode(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete your account?")) return;
    try {
      await deleteAccount();
      toast.success("Account deleted");
      localStorage.clear();
      location.href = "/login";
    } catch (err) {
      toast.error("Failed to delete account");
    }
  };

  const handleChangePassword = async () => {
    if (!formData.newPassword) return toast.error("Enter a new password");
    try {
      await changePassword(formData.newPassword);
      toast.success("Password changed");
      setFormData(prev => ({ ...prev, newPassword: '' }));
    } catch (err) {
      toast.error("Failed to change password");
    }
  };

  if (!authUser) {
    return <div className="text-white text-center py-10">Loading profile...</div>;
  }

  return (
    <div className="p-6 max-w-xl mx-auto bg-gray-800 rounded-md text-white">
      <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>

      {!editMode ? (
        <>
          <div className="flex items-center gap-4">
            <img
              src={authUser.profilePic || 'https://via.placeholder.com/100'}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <p className="text-lg font-semibold">{authUser.fullName}</p>
              <p className="text-sm text-gray-300">{authUser.bio}</p>
            </div>
          </div>
          <button
            onClick={() => setEditMode(true)}
            className="mt-4 px-4 py-2 bg-green-600 rounded-md"
          >
            Edit Profile
          </button>
        </>
      ) : (
        <>
          <div className="space-y-4">
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-gray-700"
              placeholder="Full Name"
            />
            <input
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-gray-700"
              placeholder="Bio"
            />
            <input
              name="profilePic"
              value={formData.profilePic}
              onChange={handleChange}
              className="w-full p-2 rounded-md bg-gray-700"
              placeholder="Profile Pic URL"
            />
            {formData.profilePic && (
              <img
                src={formData.profilePic}
                alt="Preview"
                className="w-16 h-16 rounded-full object-cover"
              />
            )}

            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 rounded-md"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="px-4 py-2 bg-gray-600 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}

      <div className="mt-6 border-t border-gray-700 pt-4">
        <h3 className="text-lg font-semibold mb-2">Security</h3>
        <input
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          className="w-full p-2 mb-2 rounded-md bg-gray-700"
          placeholder="New Password"
        />
        <button
          onClick={handleChangePassword}
          className="px-4 py-2 bg-yellow-600 rounded-md"
        >
          Change Password
        </button>
      </div>

      <div className="mt-6 border-t border-gray-700 pt-4">
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 rounded-md"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}

export default ProfileSettings;
