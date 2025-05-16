import React from "react";

const FolderList = ({ 
  folders, 
  selectedFolderId, 
  onSelectFolder, 
  onDeleteFolder, 
  loading, 
  error 
}) => {
  if (loading) {
    return <p>Cargando carpetas...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <ul className="folders-list">
      <li>
        <button 
          className={`folder-btn ${!selectedFolderId ? 'active' : ''}`}
          onClick={() => onSelectFolder(null)}
        >
          Raíz
        </button>
      </li>
      {folders.map(folder => (
        <li key={folder.id}>
          <button 
            className={`folder-btn ${selectedFolderId === folder.id ? 'active' : ''}`}
            onClick={() => onSelectFolder(folder.id)}
          >
            {folder.name}
          </button>
          <button 
            className="delete-btn" 
            onClick={() => onDeleteFolder(folder.id)}
          >
            🗑️
          </button>
        </li>
      ))}
    </ul>
  );
};

export default FolderList;