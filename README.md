# Cloud Drive - Almacenamiento en la Nube Personal

Cloud Drive es una aplicación web que permite a los usuarios almacenar, organizar y compartir archivos en la nube de manera segura y eficiente. Desarrollada con React y Firebase, ofrece una experiencia intuitiva para gestionar archivos personales desde cualquier dispositivo.

![Cloud Drive Screenshot](https://via.placeholder.com/800x450.png?text=Cloud+Drive+Screenshot)

## Características Principales

- **Autenticación Segura**: Sistema de registro e inicio de sesión con Firebase Authentication.
- **Almacenamiento de Archivos**: Sube y descarga archivos de cualquier tipo y tamaño.
- **Organización por Carpetas**: Crea y gestiona carpetas para mantener tus archivos organizados.
- **Compartir Archivos**: Comparte archivos con otros usuarios mediante correo electrónico.
- **Búsqueda y Filtrado**: Encuentra rápidamente tus archivos con búsqueda por nombre y filtros por tipo.
- **Ordenamiento Personalizado**: Ordena tus archivos por nombre, tamaño, tipo o fecha de subida.
- **Interfaz Responsiva**: Diseño adaptable a diferentes dispositivos y tamaños de pantalla.
- **Persistencia de Datos**: Acceso offline a la información previamente cargada.

## Tecnologías Utilizadas

- **Frontend**: React.js, CSS3, HTML5
- **Backend**: Firebase (Authentication, Firestore, Storage, Realtime Database)
- **Herramientas de Desarrollo**: Create React App, npm

## Instalación y Configuración

### Requisitos Previos

- Node.js (v14.0.0 o superior)
- npm (v6.0.0 o superior)
- Cuenta en Firebase

### Pasos de Instalación

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/cloud-drive.git
   cd cloud-drive
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar Firebase**:
   - Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
   - Habilita Authentication, Firestore, Storage y Realtime Database
   - Configura las reglas de seguridad para cada servicio
   - Copia las credenciales de configuración

4. **Configurar variables de entorno**:
   - Crea un archivo `.env.local` en la raíz del proyecto
   - Añade las credenciales de Firebase:
     ```
     REACT_APP_FIREBASE_API_KEY=tu-api-key
     REACT_APP_FIREBASE_AUTH_DOMAIN=tu-auth-domain
     REACT_APP_FIREBASE_PROJECT_ID=tu-project-id
     REACT_APP_FIREBASE_STORAGE_BUCKET=tu-storage-bucket
     REACT_APP_FIREBASE_MESSAGING_SENDER_ID=tu-messaging-sender-id
     REACT_APP_FIREBASE_APP_ID=tu-app-id
     REACT_APP_FIREBASE_DATABASE_URL=tu-database-url
     ```

5. **Iniciar la aplicación en modo desarrollo**:
   ```bash
   npm start
   ```

## Estructura del Proyecto

```
cloud-drive/
├── public/                  # Archivos públicos
├── src/                     # Código fuente
│   ├── components/          # Componentes React
│   │   ├── Auth.js          # Componente de autenticación
│   │   ├── CreateFolderForm.js # Formulario para crear carpetas
│   │   ├── Drive.js         # Componente principal de la aplicación
│   │   ├── FileList.js      # Lista de archivos
│   │   ├── FolderList.js    # Lista de carpetas
│   │   ├── SearchAndFilter.js # Barra de búsqueda y filtros
│   │   ├── ShareModal.js    # Modal para compartir archivos
│   │   └── UploadForm.js    # Formulario para subir archivos
│   ├── constants/           # Constantes de la aplicación
│   ├── hooks/               # Hooks personalizados
│   │   ├── useFiles.js      # Hook para gestionar archivos
│   │   └── useFolders.js    # Hook para gestionar carpetas
│   ├── services/            # Servicios de la aplicación
│   │   ├── fileService.js   # Servicio para gestionar archivos
│   │   ├── folderService.js # Servicio para gestionar carpetas
│   │   └── shareService.js  # Servicio para compartir archivos
│   ├── utils/               # Utilidades
│   │   └── fileUtils.js     # Utilidades para archivos
│   ├── App.js               # Componente raíz
│   ├── App.css              # Estilos globales
│   ├── Drive.css            # Estilos del componente Drive
│   ├── Auth.css             # Estilos del componente Auth
│   ├── firebase.js          # Configuración de Firebase
│   └── index.js             # Punto de entrada
├── .env.local               # Variables de entorno (no incluido en el repositorio)
├── .gitignore               # Archivos ignorados por Git
├── package.json             # Dependencias y scripts
└── README.md                # Documentación
```

## Guía de Uso

### Registro e Inicio de Sesión

1. Accede a la aplicación y serás dirigido a la pantalla de autenticación.
2. Para registrarte, haz clic en la pestaña "Registrarse" y completa el formulario con tu correo electrónico, nombre, teléfono (opcional) y contraseña.
3. Para iniciar sesión, introduce tu correo electrónico y contraseña.

### Gestión de Archivos

1. **Subir archivos**:
   - Selecciona una carpeta o la raíz donde deseas subir el archivo.
   - Haz clic en "Seleccionar archivo" y elige el archivo de tu dispositivo.
   - Haz clic en "Subir" para iniciar la carga.

2. **Descargar archivos**:
   - Haz clic en el botón "Descargar" junto al archivo que deseas obtener.

3. **Eliminar archivos**:
   - Haz clic en el botón "Eliminar" junto al archivo que deseas borrar.
   - Confirma la acción cuando se te solicite.

### Organización en Carpetas

1. **Crear carpetas**:
   - En la sección "Crear carpeta", introduce el nombre de la nueva carpeta.
   - Haz clic en "Crear" para añadir la carpeta.

2. **Navegar entre carpetas**:
   - Haz clic en el nombre de una carpeta en la lista para ver su contenido.
   - Haz clic en "Raíz" para volver al nivel principal.

3. **Eliminar carpetas**:
   - Haz clic en el icono de papelera junto al nombre de la carpeta.
   - Confirma la acción cuando se te solicite.

### Compartir Archivos

1. Haz clic en el botón "Compartir" junto al archivo que deseas compartir.
2. Introduce el correo electrónico del destinatario.
3. Selecciona el nivel de permiso (solo lectura o edición).
4. Haz clic en "Compartir" para enviar el acceso.

### Búsqueda y Filtrado

1. **Buscar archivos**:
   - Utiliza la barra de búsqueda para encontrar archivos por nombre.
   - Los resultados se actualizan automáticamente mientras escribes.

2. **Filtrar por tipo**:
   - Selecciona un tipo de archivo en el menú desplegable "Filtrar por".
   - Puedes elegir entre imágenes, documentos, videos, audios, etc.

3. **Ordenar archivos**:
   - Selecciona un criterio de ordenamiento en el menú "Ordenar por".
   - Cambia entre orden ascendente y descendente con el botón correspondiente.

## Seguridad

Cloud Drive implementa varias capas de seguridad:

- **Autenticación**: Verificación de usuarios mediante Firebase Authentication.
- **Reglas de Firestore**: Control de acceso a nivel de documento para proteger los datos.
- **Reglas de Storage**: Restricciones para la subida y descarga de archivos.
- **Permisos de Compartición**: Control granular sobre quién puede acceder a los archivos compartidos.

## Limitaciones y Consideraciones

- El tamaño máximo de archivo depende de la configuración de Firebase Storage.
- La aplicación requiere conexión a internet para la mayoría de las operaciones, aunque algunas funciones están disponibles offline.
- La versión gratuita de Firebase tiene límites en cuanto a almacenamiento y transferencia de datos.

## Contribución

Las contribuciones son bienvenidas. Para contribuir:

1. Haz un fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Haz push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Contacto

Si tienes preguntas o sugerencias, no dudes en contactarnos:

- Email: [tu-email@ejemplo.com](mailto:tu-email@ejemplo.com)
- GitHub: [tu-usuario](https://github.com/tu-usuario)

---

Desarrollado con ❤️ usando React y Firebase.

