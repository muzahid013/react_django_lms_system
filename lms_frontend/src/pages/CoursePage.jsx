import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import CreateCategoryForm from "../components/CreateCategoryForm";




export default function CategoryPage() {
  // Get the user's authentication token from context
  const { token } = useAuth(); 
  // Store the list of all categories
  const [allCategories, setAllCategories] = useState([]);
  // Track if the current user is an admin
  const [isCurrentUserAdmin, setIsCurrentUserAdmin] = useState(false);
  // Store loading state
  const [isLoading, setIsLoading] = useState(true);
  // Store error state
  const [error, setError] = useState(null);
  
  const handleCategoryCreated = (newCategory) => {
    setAllCategories(prevCategories => [...prevCategories, newCategory]);
  };

  // useEffect runs when the component loads or when the token changes
  // Check if user is admin
  useEffect(() => {
    const checkIsAdmin = async () => {
      setError(null);
      setIsLoading(true);
      try {
        const profileResponse = await axios.get("http://localhost:8000/api/user/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsCurrentUserAdmin(profileResponse.data.role === "admin");
      } catch (err) {
        setError("Failed to check admin status");
        setIsCurrentUserAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkIsAdmin();
  }, [token]);

  // Fetch categories if user is admin
  useEffect(() => {
    const fetchCategories = async () => {
      if (!isCurrentUserAdmin) return;
      
      setIsLoading(true);
      setError(null);
      try {
        const categoriesResponse = await axios.get("http://127.0.0.1:8000/api/courses/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Array.isArray(categoriesResponse.data)) {
          setAllCategories(categoriesResponse.data);
        }
      } catch (err) {
        setError("Failed to fetch categories");
        console.error("Error fetching categories:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, [token, isCurrentUserAdmin]);



  if (isLoading) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Error</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  // If the user is not an admin, show an access denied message
  if (!isCurrentUserAdmin) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Sorry, You Can't View This Page</h2>
        <p className="text-gray-600">
          Only admin users can see the list of all categories. If you think this is a mistake, please contact your administrator.
        </p>
      </div>
    );
  }

  // If the user is an admin, show the table of all categories
  return (
    <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-6xl ">
      <CreateCategoryForm 
        token={token}
        onCategoryCreated={handleCategoryCreated}
      />
      <h2 className="text-2xl text-center font-bold mb-6 text-green-600">List of All Courses</h2>
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-blue-50">
            <tr>
              <th className="border px-4 py-2 text-center">Title</th>
              <th className="border px-4 py-2 text-left">Description</th>
              <th className="border px-4 py-2 text-left">Category Name</th>
            </tr>
          </thead>
          <tbody>
            {allCategories.map((course,index) => (
              <tr key={course.id}>
                <td className="border px-4 py-1 font-semibold">{index+1}. {course.title}</td>
                <td className="border px-4 py-2 font-semibold">{course.description}</td>
                <td className="border px-4 py-2 font-semibold">{course.description}</td>            
              </tr> 
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
