"use client";

import { api, serverAPI } from "@/core/api/api";
import { AxiosError } from "axios";
import { useState, FormEvent, useEffect } from "react";

type Country = {
  name: string;
};

type UserUpdateData = {
  first_name: string;
  last_name: string;
  email: string;
  country: string;
  current_password?: string;
  new_password?: string;
};

const ProfilePage = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [countries, setCountries] = useState<Country[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await serverAPI.get(api.countries);
        setCountries(response.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    const fetchUserProfile = async () => {
      try {
        const response = await serverAPI.get(api.profile);
        const { first_name, last_name, email, country } = response.data;

        setFirstName(first_name || "");
        setLastName(last_name || "");
        setEmail(email || "");
        setCountry(country || "");
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchCountries();
    fetchUserProfile();
  }, []);

  const passwordsMatch = newPassword === confirmPassword;

  const isFormValid = () => {
    return (
      firstName &&
      lastName &&
      email &&
      country &&
      (newPassword === "" || passwordsMatch) &&
      (!newPassword || currentPassword)
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const updateData: UserUpdateData = {
        first_name: firstName,
        last_name: lastName,
        email,
        country,
        current_password: currentPassword,
        new_password: newPassword || "",
      };

      const response = await serverAPI.put(api.update, updateData);

      if (response.status === 200) {
        alert("Profile updated successfully!");
      }
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        const errorMessage =
          err.response.data.message || "Profile update failed";
        setError(errorMessage);
      } else {
        setError("Profile update failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Edit Profile</h2>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="firstName"
              className="block text-sm font-semibold mb-2"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder={firstName}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="lastName"
              className="block text-sm font-semibold mb-2"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder={lastName || "Enter your last name"}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder={email || "Enter your email"}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="country"
              className="block text-sm font-semibold mb-2"
            >
              Country
            </label>
            <select
              id="country"
              name="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-2 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country.name} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="currentPassword"
              className="block text-sm font-semibold mb-2"
            >
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter current password"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="newPassword"
              className="block text-sm font-semibold mb-2"
            >
              New Password (Leave empty to keep current password)
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder={
                newPassword
                  ? "Enter new password"
                  : "Leave empty to keep current"
              }
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-semibold mb-2"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Confirm new password"
            />
            {!passwordsMatch && confirmPassword && (
              <div className="text-red-500 text-sm mt-2">
                Passwords do not match
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!isFormValid() || loading}
            className={`w-full py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              !isFormValid() || loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
