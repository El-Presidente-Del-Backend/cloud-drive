import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

// Hook personalizado para obtener carpetas
export const useFolders = (user) => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setFolders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    const foldersRef = collection(db, "users", user.uid, "folders");
    
    const unsubscribe = onSnapshot(
      foldersRef, 
      (snapshot) => {
        const docs = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        }));
        setFolders(docs);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error al obtener carpetas:", err);
        setError("Error al cargar carpetas: " + err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return { folders, loading, error };
};