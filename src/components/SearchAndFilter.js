import React from "react";

const SearchAndFilter = ({ 
  searchTerm, 
  setSearchTerm, 
  filterType, 
  setFilterType, 
  sortBy, 
  setSortBy,
  sortDirection,
  setSortDirection
}) => {
  // Opciones de filtro por tipo
  const filterOptions = [
    { value: "all", label: "Todos" },
    { value: "Imagen", label: "Imágenes" },
    { value: "Documento", label: "Documentos" },
    { value: "Video", label: "Videos" },
    { value: "Audio", label: "Audios" },
    { value: "Archivo comprimido", label: "Comprimidos" },
    { value: "Otro", label: "Otros" }
  ];

  // Opciones de ordenamiento
  const sortOptions = [
    { value: "name", label: "Nombre" },
    { value: "size", label: "Tamaño" },
    { value: "createdAt", label: "Fecha" },
    { value: "type", label: "Tipo" }
  ];

  return (
    <div className="search-filter-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar archivos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button 
          className="clear-search-btn"
          onClick={() => setSearchTerm("")}
          style={{ visibility: searchTerm ? "visible" : "hidden" }}
          aria-label="Limpiar búsqueda"
        >
          ✕
        </button>
      </div>
      
      <div className="filter-options">
        <div className="filter-group">
          <label htmlFor="filter-type">Filtrar:</label>
          <select
            id="filter-type"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            {filterOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="sort-by">Ordenar:</label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <button
            className="sort-direction-btn"
            onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
            aria-label={sortDirection === "asc" ? "Ordenar descendente" : "Ordenar ascendente"}
          >
            {sortDirection === "asc" ? "↑" : "↓"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilter;
