import React, { useState } from "react";

const CreateFolderForm = ({ onCreateFolder, isCreating }) => {
  const [folderName, setFolderName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!folderName.trim()) return;
    
    try {
      await onCreateFolder(folderName);
      setFolderName("");
    } catch (error) {
      console.error("Error al crear carpeta:", error);
      alert("Error al crear carpeta: " + error.message);
    }
  };

  return (
    <form className="folder-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={folderName}
        onChange={(e) => setFolderName(e.target.value)}
        placeholder="Nombre de la carpeta"
        disabled={isCreating}
      />
      <button 
        type="submit" 
        disabled={!folderName.trim() || isCreating}
      >
        {isCreating ? "Creando..." : "Crear carpeta"}
      </button>
    </form>
  );
};

export default CreateFolderForm;