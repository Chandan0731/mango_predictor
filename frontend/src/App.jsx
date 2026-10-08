// src/App.js
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000').replace(/\/+$/, '');

  const handlePredict = async () => {
    if (!image) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', image);

    try {
      const res = await axios.post(`${API_BASE_URL}/predict`, formData);
      setResult(res.data);
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Prediction failed. Please ensure the backend is running.';
      setResult({ error: errorMsg });
    }
    setLoading(false);
  };

  const getMangoDetails = (classId) => {
    switch (classId) {
      case 1:
        return {
          name: 'RASPURI',
          description: 'Raspuri is juicy and aromatic, perfect for traditional Indian juices and desserts.'
        };
      case 2:
        return {
          name: 'LANGRA',
          description: 'Langra is a soft-fleshed, fiberless variety known for its rich sweetness and smooth texture.'
        };
      case 3:
        return {
          name: 'TOTAPURI',
          description: 'Totapuri is tangy and firm, widely used in making juices, pulp, and pickles.'
        };
      default:
        return {
          name: 'UNKNOWN',
          description: 'No description available for this variety.'
        };
    }
  };

  return (
    <>
      <div className="container">
        <h1>Mango Variety Detection</h1>

        <div className="upload-section">
          <label className="custom-file-input">
            Choose Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </label>

          {preview && <img src={preview} alt="Preview" className="preview" />}
        </div>

        <button
          className="predict-btn"
          onClick={handlePredict}
          disabled={loading || !image}
        >
          {loading ? 'Predicting...' : '⚡ Predict'}
        </button>

        {result && (
          <div className="result-section">
            {result.error ? (
              <p className="error">{result.error}</p>
            ) : (
              <>
                <p><strong>Class Name:</strong> <strong style={{ fontSize: '18px' }}>{getMangoDetails(result.class_id).name}</strong></p>
                <p><strong>Class ID:</strong> {result.class_id}</p>
                <p><strong>Confidence:</strong> {result.confidence}%</p>
                <p><em>{getMangoDetails(result.class_id).description}</em></p>
              </>
            )}
          </div>
        )}
      </div>

      <div className="footer">
        This model is trained with over 1,000 curated images per mango variety to ensure accurate classification.<br />
        Future updates will expand the model to include many more regional mango varieties.
      </div>
    </>
  );
}

export default App;
