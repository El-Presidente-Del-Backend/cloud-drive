import React from "react";
import { formatFileSize } from "../utils/fileUtils";

const FileList = ({ 
  files, 
  onDelete, 
  onShare, 
  loading, 
  error, 
  emptyMessage = "No hay archivos en esta ubicación" 
}) => {
  if (loading) {
    return <p>Cargando archivos...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (files.length === 0) {
    return <p className="empty-message">{emptyMessage}</p>;
  }

  // Función para formatear la fecha
  const formatDate = (timestamp) => {
    if (!timestamp) return "Fecha desconocida";
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <ul className="files-list">
      {files.map(file => (
        <li key={file.id} className={`file-item ${file.isShared ? 'shared' : ''}`}>
          <div className="file-info">
            {file.isShared ? (
              <>
                <span className="file-name">{file.fileName}</span>
                <span className="file-owner">
                  Compartido por: {file.ownerName || file.ownerEmail}
                </span>
                <span className="file-permission">
                  Permiso: {file.permission === "view" ? "Solo lectura" : "Editar"}
                </span>
              </>
            ) : (
              <>
                <span className="file-name">{file.name}</span>
                <div className="file-details">
                  <span className="file-type">{file.type || "Archivo"}</span>
                  <span className="file-size">{formatFileSize(file.size || 0)}</span>
                  <span className="file-date">
                    Subido: {formatDate(file.createdAt)}
                  </span>
                </div>
              </>
            )}
          </div>
          
          <div className="file-actions">
            <a 
              href={file.isShared ? file.fileUrl : file.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="download-link"
            >
              Descargar
            </a>
            
            {!file.isShared && (
              <button 
                className="share-btn" 
                onClick={() => onShare(file)}
              >
                Compartir
              </button>
            )}
            
            <button 
              className="delete-btn" 
              onClick={() => onDelete(file)}
            >
              {file.isShared ? "Eliminar acceso" : "Eliminar"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default FileList;

