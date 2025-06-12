import React, { useState } from "react";
import { PERMISSION_TYPES } from "../constants/permissions";
import "../styles/ShareModal.css";

const ShareModal = ({ 
  file, 
  onShare, 
  onClose 
}) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      console.log("Enviando solicitud para compartir archivo");
      await onShare(file, email, PERMISSION_TYPES.VIEW);
      onClose();
    } catch (err) {
      console.error("Error en ShareModal:", err);
      setError(err.message || "Error al compartir archivo");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="share-modal">
        <h3>Compartir "{file?.name}"</h3>
        
        {error && <p className="error-message">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Correo electrónico:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@ejemplo.com"
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div className="form-group">
            <p className="permission-info">
              El archivo se compartirá con permisos de solo lectura.
            </p>
          </div>
          
          <div className="modal-buttons">
            <button 
              type="button" 
              className="btn cancel-btn" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn share-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Compartiendo..." : "Compartir"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShareModal;
