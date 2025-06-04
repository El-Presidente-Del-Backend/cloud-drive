// Función para formatear el tamaño del archivo
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Función para determinar el tipo de archivo basado en la extensión
export const getFileTypeFromExtension = (extension) => {
  if (!extension) return 'Otro';
  
  // Convertir a minúsculas para comparación
  const ext = extension.toLowerCase();
  
  // Imágenes
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(ext)) {
    return 'Imagen';
  }
  
  // Documentos
  if (['doc', 'docx', 'pdf', 'txt', 'rtf', 'odt', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext)) {
    return 'Documento';
  }
  
  // Videos
  if (['mp4', 'webm', 'mov', 'avi', 'mkv', 'flv', 'wmv'].includes(ext)) {
    return 'Video';
  }
  
  // Audio
  if (['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a'].includes(ext)) {
    return 'Audio';
  }
  
  // Archivos comprimidos
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
    return 'Archivo comprimido';
  }
  
  // Código
  if (['js', 'html', 'css', 'py', 'java', 'c', 'cpp', 'php', 'rb', 'go', 'ts'].includes(ext)) {
    return 'Código';
  }
  
  // Otros tipos
  return 'Otro';
};

// Función para obtener el tipo de archivo a partir del nombre
export const getFileTypeFromName = (fileName) => {
  if (!fileName) return 'Otro';
  
  const parts = fileName.split('.');
  if (parts.length <= 1) return 'Otro';
  
  const extension = parts.pop().toLowerCase();
  return getFileTypeFromExtension(extension);
};

// Función para obtener el icono según el tipo de archivo
export const getFileIcon = (fileType) => {
  switch (fileType) {
    case 'Imagen':
      return '🖼️';
    case 'Documento':
      return '📄';
    case 'Video':
      return '🎬';
    case 'Audio':
      return '🎵';
    case 'Archivo comprimido':
      return '🗜️';
    case 'Código':
      return '📝';
    default:
      return '📁';
  }
};

// Función para generar un nombre de copia
export const generateCopyName = (existingNames, originalName) => {
  const [base, ext] = originalName.split(/\.(?=[^\.]+$)/); 
  let counter = 2;
  let newName = `${base} (${counter}).${ext}`;
  
  while (existingNames.includes(newName)) {
    counter++;
    newName = `${base} (${counter}).${ext}`;
  }
  
  return newName;
};



