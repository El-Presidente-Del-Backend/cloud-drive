import { useState } from "react";
import { auth } from "./firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import "./styles/Auth.css"; 

export default function Auth({ onUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const createUserDocument = async (user, userData = {}) => {
    try {
      console.log("Creando documento para usuario:", user.uid, user.email);
      
      // Crear un documento para el usuario en la colección "users"
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name: userData.name || "",
        phone: userData.phone || "",
        createdAt: serverTimestamp()
      });
      
      console.log("Documento de usuario creado exitosamente");
    } catch (error) {
      console.error("Error al crear documento de usuario:", error);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // No necesitamos crear el documento al iniciar sesión, solo actualizarlo si es necesario
      } else {
        if (!name.trim()) {
          throw new Error("El nombre es obligatorio para registrarse");
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await createUserDocument(userCredential.user, { name, phone });
      }
    } catch (err) {
      let errorMessage = "Error de autenticación";
      
      // Mensajes de error más amigables
      if (err.code === 'auth/invalid-email') {
        errorMessage = "El formato del correo electrónico no es válido";
      } else if (err.code === 'auth/user-not-found') {
        errorMessage = "No existe una cuenta con este correo electrónico";
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = "Contraseña incorrecta";
      } else if (err.code === 'auth/weak-password') {
        errorMessage = "La contraseña debe tener al menos 6 caracteres";
      } else if (err.code === 'auth/email-already-in-use') {
        errorMessage = "Ya existe una cuenta con este correo electrónico";
      } else if (err.code === 'auth/network-request-failed') {
        errorMessage = "Error de conexión. Verifica tu conexión a internet";
      } else {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Cloud Drive</h1>
          <p>Tu almacenamiento en la nube personal</p>
        </div>
        
        <div className="auth-tabs">
          <button 
            className={`auth-tab ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Iniciar Sesión
          </button>
          <button 
            className={`auth-tab ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Registrarse
          </button>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleAuth} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              id="email"
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com" 
              required
            />
          </div>
          
          {!isLogin && (
            <>
              <div className="form-group">
                <label htmlFor="name">Nombre completo</label>
                <input 
                  id="name"
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Tu nombre completo" 
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Teléfono (opcional)</label>
                <input 
                  id="phone"
                  type="tel" 
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="Tu número de teléfono" 
                />
              </div>
            </>
          )}
          
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input 
              id="password"
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Tu contraseña" 
              required
            />
          </div>
          
          <button type="submit" className="auth-button">
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </button>
        </form>
      </div>
    </div>
  );
}
