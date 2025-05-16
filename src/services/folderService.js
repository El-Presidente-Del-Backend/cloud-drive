import {
  doc,
  collection,
  deleteDoc,
  getDocs,
  query,
  where,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "../firebase";

// Función para crear una carpeta
export const createFolder = async (folderName, user) => {
  if (!folderName.trim()) return null;

  const foldersRef = collection(db, "users", user.uid, "folders");
  const docRef = await addDoc(foldersRef, {
    name: folderName.trim(),
    createdAt: serverTimestamp()
  });
  
  return {
    id: docRef.id,
    name: folderName.trim(),
    createdAt: new Date()
  };
};

// Función para eliminar una carpeta
export const deleteFolder = async (folderId, user) => {
  try {
    // Obtener todos los archivos en la carpeta
    const filesRef = collection(db, "users", user.uid, "files");
    const q = query(filesRef, where("folderId", "==", folderId));
    const snapshot = await getDocs(q);
  
    // Borrar todos los archivos asociados
    for (const docSnap of snapshot.docs) {
      const fileData = docSnap.data();
      const filePath = `files/${user.uid}/${fileData.name}`;
      await deleteObject(ref(storage, filePath)).catch(() => {});
      await deleteDoc(doc(db, "users", user.uid, "files", docSnap.id));
    }
  
    // Borrar carpeta
    await deleteDoc(doc(db, "users", user.uid, "folders", folderId));
    
    return "Carpeta eliminada con éxito";
  } catch (error) {
    console.error("Error al eliminar carpeta:", error);
    throw new Error("Error al eliminar carpeta: " + error.message);
  }
};