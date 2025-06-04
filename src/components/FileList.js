import React from "react";
import { formatFileSize, getFileIcon } from "../utils/fileUtils";

const FileList = ({ 
  files, 
  onDelete, 
  onShare, 
  onView,
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
      {files.map(file => {
        const fileType = file.type || "Otro";
        const fileIcon = getFileIcon(fileType);
        
        return (
          <li key={file.id} className={`file-item ${file.isShared ? 'shared' : ''}`}>
            <div className="file-info">
              <span className="file-icon">{fileIcon}</span>
              {file.isShared ? (
                <>
                  <span 
                    className="file-name clickable" 
                    onClick={() => onView(file)}
                  >
                    {file.fileName}
                  </span>
                  <span className="file-owner">
                    Compartido por: {file.ownerName || file.ownerEmail}
                  </span>
                  <span className="file-permission">
                    Permiso: {file.permission === "view" ? "Solo lectura" : "Editar"}
                  </span>
                </>
              ) : (
                <>
                  <span 
                    className="file-name clickable" 
                    onClick={() => onView(file)}
                  >
                    {file.name}
                  </span>
                  <div className="file-details">
                    <span className="file-type">{fileType}</span>
                    <span className="file-size">{formatFileSize(file.size || 0)}</span>
                    <span className="file-date">
                      Subido: {formatDate(file.createdAt)}
                    </span>
                  </div>
                </>
              )}
            </div>
            
            <div className="file-actions">
              <button 
                className="view-btn" 
                onClick={() => onView(file)}
                title="Ver archivo"
              >
                👁️
              </button>
              
              <a 
                href={file.isShared ? file.fileUrl : file.url} 
                download={file.isShared ? file.fileName : file.name}
                className="download-btn"
                title="Descargar archivo"
              >
                ⬇️
              </a>
              
              {!file.isShared && (
                <button 
                  className="share-btn" 
                  onClick={() => onShare(file)}
                  title="Compartir archivo"
                >
                  🔗
                </button>
              )}
              
              <button 
                className="delete-btn" 
                onClick={() => onDelete(file)}
                title={file.isShared ? "Eliminar acceso" : "Eliminar archivo"}
              >
                🗑️
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default FileList;

