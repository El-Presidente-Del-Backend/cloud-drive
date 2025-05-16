// Función para formatear el tamaño de archivo
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Función para obtener la extensión de un archivo
export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
};

// Función para determinar el tipo de archivo
export const getFileType = (filename) => {
  const ext = getFileExtension(filename).toLowerCase();
  
  const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
  const documentTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'];
  const videoTypes = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'];
  const audioTypes = ['mp3', 'wav', 'ogg', 'flac', 'aac'];
  
  if (imageTypes.includes(ext)) return 'image';
  if (documentTypes.includes(ext)) return 'document';
  if (videoTypes.includes(ext)) return 'video';
  if (audioTypes.includes(ext)) return 'audio';
  
  return 'other';
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


