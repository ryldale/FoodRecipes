"use client";

import { useState, useEffect } from "react";
import { api, serverAPI } from "@/core/api/api";
import { AxiosError } from "axios";

type UserData = {
  id: number;
  food_name: string;
  food_recipe: string;
};

const HomePage = () => {
  const [inputFoodName, setInputFoodName] = useState("");
  const [inputRecipe, setInputRecipe] = useState("");
  const [userData, setUserData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [modalFoodName, setModalFoodName] = useState("");
  const [modalRecipe, setModalRecipe] = useState("");

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await serverAPI.get<UserData[]>(api.read);
      setUserData(response.data);
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        setError(err.response.data.message || "Failed to fetch data.");
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (inputFoodName && inputRecipe) {
      try {
        setLoading(true);
        const response = await serverAPI.post(api.create, {
          food_name: inputFoodName,
          food_recipe: inputRecipe,
        });

        if (response.status === 200) {
          alert("Data created successfully!");
          setInputFoodName("");
          setInputRecipe("");
          setError("");
          fetchUserData();
        }
      } catch (err) {
        if (err instanceof AxiosError && err.response) {
          setError(err.response.data.message || "Failed to create data.");
        } else {
          setError("Something went wrong.");
        }
      } finally {
        setLoading(false);
      }
    } else {
      setError("Please enter both food name and recipe.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      const response = await serverAPI.delete(`${api.delete}/${id}`);

      if (response.status === 200) {
        alert("Data deleted successfully!");
        fetchUserData();
      }
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        setError(err.response.data.message || "Failed to delete data.");
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: number, foodName: string, recipe: string) => {
    setEditId(id);
    setModalFoodName(foodName);
    setModalRecipe(recipe);
    setIsModalOpen(true);
  };


  const handleModalSubmit = async () => {
    if (modalFoodName && modalRecipe && editId !== null) {
      try {
        setLoading(true);
        const response = await serverAPI.put(`${api.updateData}/${editId}`, {
          food_name: modalFoodName,
          food_recipe: modalRecipe,
        });

        if (response.status === 200) {
          alert("Data updated successfully!");
          setModalFoodName("");
          setModalRecipe("");
          setError("");
          setIsModalOpen(false);
          fetchUserData(); 
        }
      } catch (err) {
        if (err instanceof AxiosError && err.response) {
          setError(err.response.data.message || "Failed to update data.");
        } else {
          setError("Something went wrong.");
        }
      } finally {
        setLoading(false);
      }
    } else {
      setError("Please enter both food name and recipe.");
    }
  };

  // Effect to fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="px-8 py-8">
      <h1 className="text-2xl font-bold">Create New Recipe</h1>

      {/* Create Data Form */}
      <div className="mb-4">
        <input
          type="text"
          value={inputFoodName}
          onChange={(e) => setInputFoodName(e.target.value)}
          placeholder="Enter food name"
          className="border rounded-md px-4 py-2 mr-2"
        />
        <input
          type="text"
          value={inputRecipe}
          onChange={(e) => setInputRecipe(e.target.value)}
          placeholder="Enter recipe"
          className="border rounded-md px-4 py-2"
        />
      </div>
      <button
        onClick={handleCreate}
        disabled={loading}
        className={`mt-2 w-full py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-500 hover:bg-blue-600 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Creating..." : "Create"}
      </button>

      {/* Display any error */}
      {error && <div className="mt-2 text-red-500">{error}</div>}

      {/* Display User Data in Table */}
      <h2 className="mt-8 text-xl font-semibold">Your Recipes</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="w-1/5 px-4 py-2 text-left border-b">Food Name</th>
              <th className="w-3/5 px-4 py-2 text-left border-b">Recipe</th>
              <th className="w-1/5px-4 py-2 text-left border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {userData.length > 0 ? (
              userData.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="px-4 py-2">{item.food_name}</td>
                  <td className="px-4 py-2">{item.food_recipe}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() =>
                        handleEdit(item.id, item.food_name, item.food_recipe)
                      }
                      className="bg-yellow-500 text-white px-4 py-2 rounded-md mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center px-4 py-2">
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-1/3">
            <h2 className="text-xl font-semibold mb-4">Edit Recipe</h2>
            <input
              type="text"
              value={modalFoodName}
              onChange={(e) => setModalFoodName(e.target.value)}
              placeholder="Enter food name"
              className="border rounded-md px-4 py-2 mb-4 w-full"
            />
            <input
              type="text"
              value={modalRecipe}
              onChange={(e) => setModalRecipe(e.target.value)}
              placeholder="Enter recipe"
              className="border rounded-md px-4 py-2 mb-4 w-full"
            />
            <button
              onClick={handleModalSubmit}
              disabled={loading}
              className={`w-full py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-500 hover:bg-blue-600 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Updating..." : "Update"}
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-2 w-full py-2 text-gray-700 rounded-md bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
