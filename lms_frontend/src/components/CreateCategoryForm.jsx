import React, { useState } from 'react';
import axios from 'axios';

export default function CreateCategoryForm({ token, onCategoryCreated }) {
  const [inputs, setInputs] = useState({
    title: "",
    description: "",
  });

  const handleChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    if (!inputs.title.trim()) {
      console.error("Title is required");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/categories/",
        {
          title: inputs.title,
          description: inputs.description
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Call the callback function to update parent's state
      onCategoryCreated(response.data);
      
      // Clear the form
      setInputs({
        title: "",
        description: ""
      });
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  return (
    <div className="flex flex-col my-3 gap-y-2">
      <label className="input">
        <span className="label pe-13">Title: </span>
        <input 
          className="bg-gray-200 outline-none w-full" 
          type="text" 
          name="title"
          value={inputs.title}
          onChange={handleChange}
        />
      </label>
      <label className="input">
        <span className="label">Description: </span>
        <input 
          className="bg-gray-200 outline-none w-full" 
          type="text" 
          name="description"
          value={inputs.description}
          onChange={handleChange}
        />
      </label>
      <div className="text-center">
        <button 
          type="button" 
          onClick={handleSubmit}
          className="w-20 px-3 py-1 me-1 bg-blue-300 rounded-lg border-3 border-blue-700"
        >
          Create
        </button>
      </div>
    </div>
  );
}
