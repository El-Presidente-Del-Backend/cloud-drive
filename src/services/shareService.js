import {
  doc,
  collection,
  getDocs,
  query,
  where,
  serverTimestamp,
  setDoc,
  deleteDoc
} from "firebase/firestore";
import { db } from "../firebase";

// Función para compartir un archivo
export const shareFile = async (file, targetEmail, permission, user, userData) => {
  if (!targetEmail || !file) {
    throw new Error("Se requiere un correo electrónico y un archivo para compartir");
  }
  
  try {
    // Normalizar el email (convertir a minúsculas)
    const normalizedEmail = targetEmail.toLowerCase().trim();
    
    // Buscar el usuario por correo electrónico
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", normalizedEmail));
    const querySnapshot = await getDocs(q);
    
    let targetUserId;
    let targetUserData = {};
    
    if (querySnapshot.empty) {
      // Si no encontramos el usuario, creamos uno temporal
      targetUserId = normalizedEmail.replace(/[.@]/g, "_");
      
      // Crear documento temporal
      await setDoc(doc(db, "users", targetUserId), {
        email: normalizedEmail,
        name: "",
        phone: "",
        createdAt: serverTimestamp(),
        isTemporary: true
      });
      
      console.log("Usuario temporal creado con ID:", targetUserId);
    } else {
      targetUserId = querySnapshot.docs[0].id;
      targetUserData = querySnapshot.docs[0].data();
      
      // No permitir compartir consigo mismo
      if (targetUserId === user.uid) {
        throw new Error("No puedes compartir un archivo contigo mismo");
      }
    }
    
    // Crear un ID único para el documento compartido
    const sharedId = `${file.id}_${Date.now()}`;
    
    // Datos del archivo compartido
    const sharedFileData = {
      fileId: file.id,
      fileName: file.name,
      fileUrl: file.url,
      ownerId: user.uid,
      ownerEmail: user.email,
      ownerName: userData?.name || "",
      permission: permission,
      sharedAt: serverTimestamp(),
      size: file.size,
      type: file.type,
      extension: file.extension,
      createdAt: file.createdAt
    };
    
    // Añadir a la subcolección "sharedWithMe" del usuario destino
    await setDoc(
      doc(db, "users", targetUserId, "sharedWithMe", sharedId), 
      sharedFileData
    );
    
    // También mantener un registro en la colección del propietario
    await setDoc(
      doc(db, "users", user.uid, "sharedByMe", sharedId),
      {
        ...sharedFileData,
        targetUserId: targetUserId,
        targetUserEmail: normalizedEmail,
        targetUserName: targetUserData.name || ""
      }
    );
    
    return {
      success: true,
      message: `Archivo compartido con ${targetEmail} exitosamente`,
      isTemporaryUser: querySnapshot.empty
    };
  } catch (error) {
    console.error("Error al compartir archivo:", error);
    throw error;
  }
};

// Función para revocar acceso compartido
export const revokeAccess = async (sharedFileId, targetUserId, user) => {
  try {
    // Eliminar de la colección "sharedWithMe" del usuario destino
    await deleteDoc(
      doc(db, "users", targetUserId, "sharedWithMe", sharedFileId)
    );
    
    // Eliminar de nuestra colección "sharedByMe"
    await deleteDoc(
      doc(db, "users", user.uid, "sharedByMe", sharedFileId)
    );
    
    return "Acceso revocado exitosamente";
  } catch (error) {
    console.error("Error al revocar acceso:", error);
    throw new Error("Error al revocar acceso: " + error.message);
  }
};

