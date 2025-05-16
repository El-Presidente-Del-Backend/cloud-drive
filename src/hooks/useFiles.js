import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

// Hook personalizado para obtener archivos
export const useFiles = (user, selectedFolderId) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setFiles([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    const filesRef = collection(db, "users", user.uid, "files");
    const q = query(filesRef, where("folderId", "==", selectedFolderId || null));
    
    const unsubscribe = onSnapshot(
      q, 
      (snapshot) => {
        const docs = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        }));
        setFiles(docs);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error al obtener archivos:", err);
        setError("Error al cargar archivos: " + err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, selectedFolderId]);

  return { files, loading, error };
};

// Hook para obtener archivos compartidos conmigo
export const useSharedWithMe = (user) => {
  const [sharedFiles, setSharedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setSharedFiles([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    const sharedRef = collection(db, "users", user.uid, "sharedWithMe");
    
    const unsubscribe = onSnapshot(
      sharedRef, 
      (snapshot) => {
        const sharedDocs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          isShared: true
        }));
        setSharedFiles(sharedDocs);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error al obtener archivos compartidos:", err);
        setError("Error al cargar archivos compartidos: " + err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return { sharedFiles, loading, error };
};