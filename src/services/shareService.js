import {
  doc,
  collection,
  getDocs,
  query,
  where,
  serverTimestamp,
  setDoc,
  deleteDoc,
  addDoc,
  getDoc
} from "firebase/firestore";
import { db } from "../firebase";
<<<<<<< HEAD
import { PERMISSION_TYPES, ERROR_MESSAGES } from "../constants/permissions";

// Función para compartir un archivo
export const shareFile = async (file, targetEmail, permission, user) => {
  if (!targetEmail || !file || !user) {
    throw new Error("Se requiere un correo electrónico, un archivo y un usuario para compartir");
=======
import { notify } from "../services/notificationService";

// Función para compartir un archivo
export const shareFile = async (file, targetEmail, permission, user, userData) => {
  if (!targetEmail || !file) {
    notify.error("Se requiere un correo electrónico y un archivo para compartir");
    throw new Error("Se requiere un correo electrónico y un archivo para compartir");
>>>>>>> b2ea820c6ebe1ab549bbe390e8f222ad128ef28c
  }
  
  try {
    console.log("Iniciando proceso de compartir archivo:", file.id);
    
    // Normalizar el email (convertir a minúsculas)
    const normalizedEmail = targetEmail.toLowerCase().trim();
    
    // No permitir compartir consigo mismo
    if (normalizedEmail === user.email.toLowerCase()) {
      throw new Error(ERROR_MESSAGES.SELF_SHARE);
    }
    
    // Buscar el usuario por correo electrónico
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", normalizedEmail));
    const querySnapshot = await getDocs(q);
    
    let targetUserId;
    let targetUserData = {};
    
    if (querySnapshot.empty) {
      console.log("Usuario no encontrado, creando usuario temporal");
      // Si no encontramos el usuario, creamos uno temporal
      const userDocRef = doc(db, "users", normalizedEmail.replace(/[.@]/g, "_"));
      
      // Verificar si ya existe el documento
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // Crear documento temporal
        await setDoc(userDocRef, {
          email: normalizedEmail,
          name: "",
          phone: "",
          createdAt: serverTimestamp(),
          isTemporary: true
        });
      }
      
      targetUserId = userDocRef.id;
      console.log("Usuario temporal creado/encontrado con ID:", targetUserId);
    } else {
      targetUserId = querySnapshot.docs[0].id;
      targetUserData = querySnapshot.docs[0].data();
      console.log("Usuario existente encontrado con ID:", targetUserId);
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
      ownerName: user.displayName || "",
      permission: PERMISSION_TYPES.VIEW, // Siempre usar VIEW
      sharedAt: serverTimestamp(),
      size: file.size,
      type: file.type,
      extension: file.name.split('.').pop().toLowerCase()
    };
    
    console.log("Añadiendo a sharedWithMe del usuario destino:", targetUserId);
    
    // Añadir a la subcolección "sharedWithMe" del usuario destino
    await setDoc(
      doc(db, "users", targetUserId, "sharedWithMe", sharedId), 
      sharedFileData
    );
    
    console.log("Añadiendo a sharedByMe del usuario actual:", user.uid);
    
    // También mantener un registro en la colección del propietario
    await setDoc(
      doc(db, "users", user.uid, "sharedByMe", sharedId),
      {
        ...sharedFileData,
        targetUserId: targetUserId,
        recipientEmail: normalizedEmail,
        recipientName: targetUserData.name || ""
      }
    );
    
    console.log("Archivo compartido exitosamente");
    
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
    console.log("Revocando acceso:", sharedFileId, "para usuario:", targetUserId);
    
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

