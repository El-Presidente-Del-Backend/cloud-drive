import React, { useState } from "react";

const PERMISSION_TYPES = {
  VIEW: "view",
  EDIT: "edit"
};

const ShareModal = ({ 
  file, 
  onShare, 
  onClose 
}) => {
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState(PERMISSION_TYPES.VIEW);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await onShare(file, email, permission);
      onClose();
    } catch (err) {
      setError(err.message);
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
            />
          </div>
          
          <div className="form-group">
            <label>Permisos:</label>
            <select 
              value={permission} 
              onChange={(e) => setPermission(e.target.value)}
            >
              <option value={PERMISSION_TYPES.VIEW}>Solo lectura</option>
              <option value={PERMISSION_TYPES.EDIT}>Editar</option>
            </select>
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