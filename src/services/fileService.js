import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from "firebase/storage";
import {
  doc,
  collection,
  deleteDoc,
  getDocs,
  query,
  where,
  addDoc,
  serverTimestamp,
  setDoc
} from "firebase/firestore";
import { storage, db } from "../firebase";

// Función para subir un archivo
export const uploadFile = async (file, user, selectedFolderId) => {
  if (!file) return null;

  const filesRef = collection(db, "users", user.uid, "files");
  const q = query(filesRef, where("folderId", "==", selectedFolderId || null));
  const snapshot = await getDocs(q);

  const filesInFolder = snapshot.docs.map(doc => ({
    id: doc.id,
    name: doc.data().name,
    url: doc.data().url
  }));

  const existing = filesInFolder.find(f => f.name === file.name);

  let finalName = file.name;

  if (existing) {
    const overwrite = window.confirm(
      `Ya existe un archivo llamado "${file.name}".\n¿Quieres sobrescribirlo? (Aceptar = sobrescribir, Cancelar = subir como copia)`
    );

    if (overwrite) {
      await deleteObject(ref(storage, `files/${user.uid}/${existing.name}`));
      await deleteDoc(doc(db, "users", user.uid, "files", existing.id));
    } else {
      const names = filesInFolder.map(f => f.name);
      finalName = generateCopyName(names, file.name);
    }
  }

  const fileRef = ref(storage, `files/${user.uid}/${finalName}`);
  const snap = await uploadBytes(fileRef, file);
  const url = await getDownloadURL(snap.ref);

  // Obtener la extensión del archivo
  const fileExtension = finalName.split('.').pop().toLowerCase();
  
  // Determinar el tipo de archivo
  const fileType = getFileTypeFromExtension(fileExtension);

  const fileData = {
    name: finalName,
    url,
    folderId: selectedFolderId || null,
    createdAt: serverTimestamp(),
    ownerId: user.uid,
    ownerEmail: user.email,
    size: file.size, // Guardar el tamaño del archivo en bytes
    type: fileType, // Guardar el tipo de archivo
    extension: fileExtension // Guardar la extensión
  };

  const docRef = await addDoc(filesRef, fileData);
  
  return {
    id: docRef.id,
    ...fileData
  };
};

// Función para eliminar un archivo
export const deleteFile = async (file, user) => {
  try {
    // Si es un archivo compartido conmigo, solo eliminar el permiso
    if (file.isShared) {
      await deleteDoc(doc(db, "users", user.uid, "sharedWithMe", file.id));
      return "Archivo eliminado de tus archivos compartidos";
    }
    
    // Si es mi archivo, eliminar el archivo
    const fileRef = ref(storage, `files/${user.uid}/${file.name}`);
    await deleteObject(fileRef);
    await deleteDoc(doc(db, "users", user.uid, "files", file.id));
    
    // Eliminar todos los permisos compartidos de este archivo
    const sharedByMeRef = collection(db, "users", user.uid, "sharedByMe");
    const q = query(sharedByMeRef, where("fileId", "==", file.id));
    const snapshot = await getDocs(q);
    
    // Para cada documento compartido, eliminar el acceso del usuario correspondiente
    const deletePromises = snapshot.docs.map(async (doc) => {
      const sharedData = doc.data();
      // Eliminar de la colección "sharedWithMe" del usuario destino
      await deleteDoc(
        doc(db, "users", sharedData.targetUserId, "sharedWithMe", doc.id)
      );
      // Eliminar de nuestra colección "sharedByMe"
      await deleteDoc(
        doc(db, "users", user.uid, "sharedByMe", doc.id)
      );
    });
    
    await Promise.all(deletePromises);
    
    return "Archivo eliminado con éxito";
  } catch (err) {
    console.error("Error al eliminar archivo:", err);
    throw new Error("Error al eliminar archivo: " + err.message);
  }
};

// Función auxiliar para generar nombres de copia
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

// Función para determinar el tipo de archivo basado en la extensión
const getFileTypeFromExtension = (extension) => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
  const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'];
  const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'];
  const audioExtensions = ['mp3', 'wav', 'ogg', 'flac', 'aac'];
  const compressedExtensions = ['zip', 'rar', '7z', 'tar', 'gz'];
  
  if (imageExtensions.includes(extension)) return 'Imagen';
  if (documentExtensions.includes(extension)) return 'Documento';
  if (videoExtensions.includes(extension)) return 'Video';
  if (audioExtensions.includes(extension)) return 'Audio';
  if (compressedExtensions.includes(extension)) return 'Archivo comprimido';
  
  return 'Otro';
};
