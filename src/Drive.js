import React, { useState, useMemo, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { useFiles, useSharedWithMe } from "./hooks/useFiles";
import { useFolders } from "./hooks/useFolders";
import { uploadFile, deleteFile } from "./services/fileService";
import { createFolder, deleteFolder } from "./services/folderService";
import { shareFile } from "./services/shareService";
import { SUCCESS_MESSAGES } from "./constants/permissions";

import FileList from "./components/FileList";
import FolderList from "./components/FolderList";
import UploadForm from "./components/UploadForm";
import CreateFolderForm from "./components/CreateFolderForm";
import ShareModal from "./components/ShareModal";
import SearchAndFilter from "./components/SearchAndFilter";
import FileViewer from "./components/FileViewer"; // Importar el nuevo componente

import "./styles/Drive.css";

function Drive({ user, userData }) {
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [viewMode, setViewMode] = useState("my-files");
  const [isUploading, setIsUploading] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [selectedFileForShare, setSelectedFileForShare] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  
  const { folders, loading: loadingFolders, error: foldersError } = useFolders(user);
  const { files, loading: loadingFiles, error: filesError } = useFiles(user, selectedFolderId);
  const { sharedFiles, loading: loadingShared, error: sharedError } = useSharedWithMe(user);
  
  const displayName = userData?.name || user.email;

  const filteredAndSortedFiles = useMemo(() => {
    let result = [...files];
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(file => 
        file.name.toLowerCase().includes(searchLower)
      );
    }
    
    if (filterType !== "all") {
      result = result.filter(file => file.type === filterType);
    }
    
    result.sort((a, b) => {
      let valueA, valueB;
      
      if (sortBy === "name") {
        valueA = a.name.toLowerCase();
        valueB = b.name.toLowerCase();
      } else if (sortBy === "size") {
        valueA = a.size || 0;
        valueB = b.size || 0;
      } else if (sortBy === "createdAt") {
        valueA = a.createdAt ? (a.createdAt.toDate ? a.createdAt.toDate() : new Date(a.createdAt)) : new Date(0);
        valueB = b.createdAt ? (b.createdAt.toDate ? b.createdAt.toDate() : new Date(b.createdAt)) : new Date(0);
      } else if (sortBy === "type") {
        valueA = a.type || "";
        valueB = b.type || "";
      }
      
      if (sortDirection === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
    
    return result;
  }, [files, searchTerm, filterType, sortBy, sortDirection]);
  
  const filteredAndSortedSharedFiles = useMemo(() => {
    let result = [...sharedFiles];
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(file => 
        file.fileName.toLowerCase().includes(searchLower)
      );
    }
    
    if (filterType !== "all") {
      result = result.filter(file => file.type === filterType);
    }
    
    result.sort((a, b) => {
      let valueA, valueB;
      
      if (sortBy === "name") {
        valueA = a.fileName.toLowerCase();
        valueB = b.fileName.toLowerCase();
      } else if (sortBy === "size") {
        valueA = a.size || 0;
        valueB = b.size || 0;
      } else if (sortBy === "createdAt") {
        valueA = a.createdAt ? (a.createdAt.toDate ? a.createdAt.toDate() : new Date(a.createdAt)) : new Date(0);
        valueB = b.createdAt ? (b.createdAt.toDate ? b.createdAt.toDate() : new Date(b.createdAt)) : new Date(0);
      } else if (sortBy === "type") {
        valueA = a.type || "";
        valueB = b.type || "";
      }
      
      if (sortDirection === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
    
    return result;
  }, [sharedFiles, searchTerm, filterType, sortBy, sortDirection]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };
  
  const handleUpload = async (file) => {
    if (!file) return;
    
    setIsUploading(true);
    try {
      await uploadFile(file, user, selectedFolderId);
      alert(SUCCESS_MESSAGES.UPLOAD);
    } catch (error) {
      console.error("Error al subir archivo:", error);
      alert("Error al subir archivo: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleCreateFolder = async (folderName) => {
    if (!folderName.trim()) return;
    
    setIsCreatingFolder(true);
    try {
      await createFolder(folderName, user);
      alert(SUCCESS_MESSAGES.FOLDER_CREATE);
    } catch (error) {
      console.error("Error al crear carpeta:", error);
      alert("Error al crear carpeta: " + error.message);
    } finally {
      setIsCreatingFolder(false);
    }
  };
  
  const handleDeleteFile = async (file) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar "${file.name || file.fileName}"?`)) {
      return;
    }
    
    try {
      const message = await deleteFile(file, user);
      alert(message);
    } catch (error) {
      console.error("Error al eliminar archivo:", error);
      alert("Error al eliminar archivo: " + error.message);
    }
  };
  
  const handleDeleteFolder = async (folderId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta carpeta y todo su contenido?")) {
      return;
    }
    
    try {
      const message = await deleteFolder(folderId, user);
      alert(message);
    } catch (error) {
      console.error("Error al eliminar carpeta:", error);
      alert("Error al eliminar carpeta: " + error.message);
    }
  };
  
  const handleShareFile = async (file, email, permission) => {
    try {
      const result = await shareFile(file, email, permission, user);
      alert(result.message || SUCCESS_MESSAGES.SHARE);
      return result;
    } catch (error) {
      console.error("Error al compartir archivo:", error);
      throw error;
    }
  };
  
  const openShareModal = (file) => {
    setSelectedFileForShare(file);
    setShowShareModal(true);
  };
  
  const closeShareModal = () => {
    setSelectedFileForShare(null);
    setShowShareModal(false);
  };

  // Añadir un estado para controlar la visibilidad del sidebar en móviles
  const [showSidebar, setShowSidebar] = useState(window.innerWidth > 992);

  // Añadir un efecto para manejar el cambio de tamaño de ventana
  useEffect(() => {
    const handleResize = () => {
      setShowSidebar(window.innerWidth > 992);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Nuevo estado para el visor de archivos
  const [selectedFileForView, setSelectedFileForView] = useState(null);

  // Función para abrir el visor de archivos
  const openFileViewer = (file) => {
    setSelectedFileForView(file);
  };

  // Función para cerrar el visor de archivos
  const closeFileViewer = () => {
    setSelectedFileForView(null);
  };

  return (
    <div className="drive-container">
      <header className="drive-header">
        <h1>Bienvenido, {displayName}</h1>
        <div className="header-actions">
          {window.innerWidth <= 992 && (
            <button 
              className="toggle-sidebar-btn"
              onClick={() => setShowSidebar(!showSidebar)}
              aria-label={showSidebar ? "Ocultar carpetas" : "Mostrar carpetas"}
            >
              {showSidebar ? "◀ Ocultar" : "▶ Carpetas"}
            </button>
          )}
          <button className="btn logout-btn" onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </header>

      <div className="view-toggle">
        <button 
          className={`toggle-btn ${viewMode === "my-files" ? "active" : ""}`}
          onClick={() => setViewMode("my-files")}
        >
          Mis archivos
        </button>
        <button 
          className={`toggle-btn ${viewMode === "shared-with-me" ? "active" : ""}`}
          onClick={() => setViewMode("shared-with-me")}
        >
          Compartidos conmigo
        </button>
      </div>
      
      {viewMode === "my-files" && (
        <div className="drive-content">
          {(showSidebar || window.innerWidth > 992) && (
            <div className="sidebar">
              <h3>Carpetas</h3>
              <FolderList 
                folders={folders}
                selectedFolderId={selectedFolderId}
                onSelectFolder={setSelectedFolderId}
                onDeleteFolder={handleDeleteFolder}
                loading={loadingFolders}
                error={foldersError}
              />
              
              <div className="create-folder-section">
                <h3>Crear carpeta</h3>
                <CreateFolderForm 
                  onCreateFolder={handleCreateFolder}
                  isCreating={isCreatingFolder}
                />
              </div>
            </div>
          )}
          
          <div className="main-content">
            <h2>
              {selectedFolderId 
                ? `Archivos en: ${folders.find(f => f.id === selectedFolderId)?.name || "Carpeta"}`
                : "Archivos en raíz"}
            </h2>
            
            <div className="upload-section">
              <h3>Subir archivo</h3>
              <UploadForm 
                onUpload={handleUpload}
                selectedFolderId={selectedFolderId}
                isUploading={isUploading}
              />
            </div>
            
            <div className="files-section">
              <h3>Mis archivos</h3>
              
              <SearchAndFilter 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterType={filterType}
                setFilterType={setFilterType}
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortDirection={sortDirection}
                setSortDirection={setSortDirection}
              />
              
              <FileList 
                files={filteredAndSortedFiles}
                onDelete={handleDeleteFile}
                onShare={openShareModal}
                onView={openFileViewer} // Añadir el manejador para ver archivos
                loading={loadingFiles}
                error={filesError}
                emptyMessage={
                  searchTerm || filterType !== "all" 
                    ? "No se encontraron archivos con los filtros aplicados" 
                    : (selectedFolderId 
                      ? "No hay archivos en esta carpeta" 
                      : "No hay archivos en la raíz")
                }
              />
            </div>
          </div>
        </div>
      )}
      
      {viewMode === "shared-with-me" && (
        <div className="shared-content">
          <h2>Archivos compartidos conmigo</h2>
          
          <SearchAndFilter 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterType={filterType}
            setFilterType={setFilterType}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
          />
          
          <FileList 
            files={filteredAndSortedSharedFiles}
            onDelete={handleDeleteFile}
            onView={openFileViewer} // Añadir el manejador para ver archivos
            loading={loadingShared}
            error={sharedError}
            emptyMessage={
              searchTerm || filterType !== "all" 
                ? "No se encontraron archivos compartidos con los filtros aplicados" 
                : "No hay archivos compartidos contigo"
            }
          />
        </div>
      )}
      
      {/* Modal para compartir archivos */}
      {showShareModal && (
        <ShareModal 
          file={selectedFileForShare}
          onShare={handleShareFile}
          onClose={closeShareModal}
        />
      )}
      
      {/* Visor de archivos */}
      {selectedFileForView && (
        <FileViewer 
          file={selectedFileForView}
          onClose={closeFileViewer}
        />
      )}
    </div>
  );
}

export default Drive;
