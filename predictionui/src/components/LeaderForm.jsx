import React, { useState } from 'react';
import axios from 'axios';

const LeaderForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    country: '',
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      const file = e.target.files[0];
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const formDataObj = new FormData();
      formDataObj.append('name', formData.name);
      formDataObj.append('title', formData.title);
      formDataObj.append('description', formData.description);
      formDataObj.append('country', formData.country);
      if (formData.image) formDataObj.append('image', formData.image); // Conditionally append image

      await axios.post('http://localhost:8000/api/v1/leaders/', formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccessMsg('Leader created successfully!');
      setFormData({
        name: '',
        title: '',
        description: '',
        country: '',
        image: null,
      });
      setPreview(null);
    } catch (error) {
      setErrorMsg(`Error: ${error.response?.data?.detail || error.message}`);
      console.error('Full error:', error.response || error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md p-6 rounded-lg mt-8">
      <h2 className="text-xl font-bold mb-4">Create Leader Card</h2>
      {successMsg && <div className="text-green-600 mb-2">{successMsg}</div>}
      {errorMsg && <div className="text-red-600 mb-2">{errorMsg}</div>}
      <form onSubmit={handleSubmit}>
        <input name="name" type="text" placeholder="Name" className="input mb-2" value={formData.name} onChange={handleChange} required />
        <input name="title" type="text" placeholder="Title" className="input mb-2" value={formData.title} onChange={handleChange} required />
        <input name="country" type="text" placeholder="Country" className="input mb-2" value={formData.country} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" className="input mb-2" value={formData.description} onChange={handleChange} required />
        <input name="image" type="file" accept="image/*" className="mb-2" onChange={handleChange} />
        {preview && <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded mb-2" />}
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">Create Leader</button>
      </form>
    </div>
  );
};

export default LeaderForm;