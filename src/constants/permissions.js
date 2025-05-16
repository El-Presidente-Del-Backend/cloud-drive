// Tipos de permisos para compartir archivos
export const PERMISSION_TYPES = {
  VIEW: "view",
  EDIT: "edit"
};

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  SELF_SHARE: "No puedes compartir un archivo contigo mismo",
  NOT_FOUND: "No se encontró el archivo solicitado",
  PERMISSION_DENIED: "No tienes permisos para realizar esta acción",
  UPLOAD_FAILED: "Error al subir el archivo",
  DELETE_FAILED: "Error al eliminar el archivo",
  SHARE_FAILED: "Error al compartir el archivo"
};

// Mensajes de éxito
export const SUCCESS_MESSAGES = {
  UPLOAD: "Archivo subido con éxito",
  DELETE: "Archivo eliminado con éxito",
  SHARE: "Archivo compartido con éxito",
  FOLDER_CREATE: "Carpeta creada con éxito",
  FOLDER_DELETE: "Carpeta eliminada con éxito"
};