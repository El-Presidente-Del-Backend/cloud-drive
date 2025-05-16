import React, { useState } from "react";

const UploadForm = ({ onUpload, selectedFolderId, isUploading }) => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    
    try {
      await onUpload(file);
      setFile(null);
      // Resetear el input de archivo
      e.target.reset();
    } catch (error) {
      console.error("Error al subir archivo:", error);
      alert("Error al subir archivo: " + error.message);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <form 
      className={`upload-form ${dragActive ? 'drag-active' : ''}`}
      onSubmit={handleSubmit}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      <div className="upload-area">
        <input 
          type="file" 
          id="file-upload" 
          onChange={handleFileChange} 
          className="file-input"
        />
        <label htmlFor="file-upload" className="file-label">
          {file ? file.name : "Seleccionar archivo o arrastrar aquí"}
        </label>
        
        <div className="upload-info">
          {selectedFolderId ? 
            <p>Subiendo a carpeta seleccionada</p> : 
            <p>Subiendo a raíz</p>
          }
        </div>
      </div>
      
      <button 
        type="submit" 
        className="upload-btn"
        disabled={!file || isUploading}
      >
        {isUploading ? "Subiendo..." : "Subir"}
      </button>
    </form>
  );
};

export default UploadForm;