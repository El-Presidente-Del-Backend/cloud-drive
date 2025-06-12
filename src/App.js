import { useState, useEffect, useTransition } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { Toaster } from "sonner";
import Auth from "./Auth";
import Drive from "./Drive";
import "./styles/App.css";

function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  
  // Escuchar cambios en el estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Obtener datos adicionales del usuario desde Firestore
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userDataFromFirestore = userDoc.data();
            
            // Combinar datos de autenticación con datos de Firestore
            startTransition(() => {
              setUser(currentUser);
              setUserData(userDataFromFirestore);
              setLoading(false);
            });
          } else {
            startTransition(() => {
              setUser(currentUser);
              setUserData(null);
              setLoading(false);
            });
          }
        } catch (error) {
          console.error("Error al obtener datos del usuario:", error);
          startTransition(() => {
            setUser(currentUser);
            setUserData(null);
            setLoading(false);
          });
        }
      } else {
        startTransition(() => {
          setUser(null);
          setUserData(null);
          setLoading(false);
        });
      }
    });
    
    // Limpiar el listener cuando el componente se desmonte
    return () => unsubscribe();
  }, []);
  
  const handleUserChange = (newUser) => {
    startTransition(() => {
      setUser(newUser);
    });
  };
  
  // Mostrar spinner mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }
  
  return (
    <div className="app">
      <Toaster 
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            color: "#202124",
            border: "1px solid #e0e0e0",
          },
        }}
      />
      {isPending ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      ) : !user ? (
        <Auth onUser={handleUserChange} />
      ) : (
        <Drive user={user} userData={userData} />
      )}
    </div>
  );
}

export default App;



