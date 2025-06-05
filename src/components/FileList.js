import React from "react";
import DownloadIcon from "./DownloadIcon";
import LinkIcon from "./LinkIcon";
import DeleteIcon from "./DeleteIcon";
import { formatFileSize, getFileIcon } from "../utils/fileUtils";

// Función de respaldo para formatear fechas si no está disponible en fileUtils
const formatDateFallback = (timestamp) => {
  if (!timestamp) return 'Fecha desconocida';
  
  // Si es un objeto Timestamp de Firestore
  if (timestamp.toDate && typeof timestamp.toDate === 'function') {
    timestamp = timestamp.toDate();
  }
  
  // Si es un string, convertirlo a Date
  if (typeof timestamp === 'string') {
    timestamp = new Date(timestamp);
  }
  
  // Verificar si es una fecha válida
  if (!(timestamp instanceof Date) || isNaN(timestamp)) {
    return 'Fecha inválida';
  }
  
  // Formatear la fecha
  return new Date(timestamp).toLocaleDateString('es-ES', {
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric'
  });
};

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

  return (
    <ul className="files-list">
      {files.map(file => {
        const fileType = file.type || "Otro";
        const fileIcon = getFileIcon(fileType);
        const dateStr = formatDateFallback(file.createdAt || file.sharedAt);
        
        return (
          <li key={file.id} className="file-item">
            <div className="file-preview" onClick={() => onView(file)}>
              <span className="file-icon">{fileIcon}</span>
            </div>
            
            <div className="file-info" onClick={() => onView(file)}>
              <div className="file-name clickable">{file.isShared ? file.fileName : file.name}</div>
              <div className="file-details">
                <span>{fileType}</span> • {dateStr}
              </div>
            </div>
            
            <div className="file-actions">
              <a 
                href={file.isShared ? file.fileUrl : file.url} 
                download={file.isShared ? file.fileName : file.name}
                className="download-btn"
                title="Descargar archivo"
              >
                <DownloadIcon size={20} />
              </a>
              
              {!file.isShared && (
                <button 
                  className="share-btn" 
                  onClick={() => onShare(file)}
                  title="Compartir archivo"
                >
                  <LinkIcon size={20} />
                </button>
              )}
              
              <button 
                className="delete-btn" 
                onClick={() => onDelete(file)}
                title={file.isShared ? "Eliminar acceso" : "Eliminar archivo"}
              >
                <DeleteIcon size={20} />
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default FileList;

