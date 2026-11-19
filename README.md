# Envios Paloma

**Aplicación móvil y web de mensajería instantánea con Firebase y Supabase**

Envíos Paloma es una aplicación de mensajería desarrollada con Ionic, Angular y Capacitor, que integra Firebase y Supabase para ofrecer una plataforma de comunicación entre usuarios mediante conversaciones privadas y salas grupales.

El proyecto implementa una arquitectura de servicios en la nube con responsabilidades distribuidas: Firebase administra la autenticación, los perfiles y las salas de conversación, mientras que Supabase gestiona el almacenamiento de mensajes, la sincronización en tiempo real y los archivos multimedia.

La aplicación permite intercambiar mensajes de texto, fotografías, documentos y ubicaciones geográficas, además de personalizar la experiencia mediante diferentes combinaciones de colores.

## 1. Características principales

- Autenticación y gestión de usuarios mediante correo electrónico y contraseña.
- Conversaciones privadas entre dos usuarios.
- Creación y administración de salas de chat grupales.
- Mensajería instantánea con actualización en tiempo real.
- Envío y recepción de fotografías desde la cámara o galería.
- Adjuntar y compartir documentos y archivos.
- Compartir ubicaciones geográficas mediante GPS.
- Visualización de ubicaciones mediante Google Maps.
- Edición de información personal y biografía.
- Personalización de fotografías de perfil.
- Administración del estado de disponibilidad.
- Eliminación de mensajes propios.
- Búsqueda dinámica de usuarios y salas.
- Personalización de la interfaz mediante seis temas de colores.
- Persistencia de información en servicios de almacenamiento en la nube.

## 2. Tecnologías utilizadas

El desarrollo combina tecnologías de aplicaciones híbridas, servicios backend administrados y herramientas de integración nativa.

| Tecnología | Aplicación en el proyecto |
|---|---|
| Ionic Framework 9 | Desarrollo de la interfaz móvil y web. |
| Angular 22 | Estructura de componentes, servicios y navegación. |
| TypeScript | Lenguaje principal de programación. |
| Capacitor 8 | Integración con funcionalidades nativas de Android. |
| Firebase Authentication | Registro, inicio y cierre de sesión. |
| Cloud Firestore | Almacenamiento de perfiles y salas grupales. |
| Supabase | Servicios backend y gestión de datos. |
| PostgreSQL | Base de datos para el almacenamiento de mensajes. |
| Supabase Realtime | Sincronización de mensajes mediante WebSockets. |
| Supabase Storage | Almacenamiento de fotografías y documentos. |
| RxJS | Gestión reactiva del estado de autenticación. |
| HTML5 y SCSS | Estructura y estilos de la interfaz. |
| Ionicons | Iconografía de la aplicación. |

### Dependencias adicionales

- `@capacitor/camera`: acceso a la cámara y galería del dispositivo.
- `@capacitor/geolocation`: obtención de coordenadas geográficas.
- `@supabase/supabase-js`: comunicación con los servicios de Supabase.
- `firebase`: integración con Firebase Authentication y Cloud Firestore.
- `@ionic/pwa-elements`: compatibilidad de determinados componentes nativos en navegadores web.

## 3. Arquitectura e integración de Firebase y Supabase

Uno de los principales objetivos del proyecto es integrar dos plataformas backend diferentes dentro de una misma aplicación, aprovechando las funcionalidades específicas de cada servicio.

### Firebase: autenticación y gestión de usuarios

Firebase se encarga de administrar la identidad de los usuarios y almacenar información relacionada con sus perfiles y salas de conversación.

**Firebase Authentication**

Gestiona el registro de nuevos usuarios, el inicio de sesión y el cierre de sesión mediante correo electrónico y contraseña. Cada cuenta dispone de un identificador único (`uid`), utilizado para relacionar la información del usuario con los mensajes.

**Cloud Firestore**

Almacena principalmente dos colecciones:

- `users`: contiene información de los usuarios, incluyendo identificador, nombre, biografía, fotografía de perfil y estado de disponibilidad.
- `rooms`: almacena las salas grupales, sus nombres, descripciones, creador y fecha de creación.

La aplicación utiliza listeners de Firestore (`onSnapshot`) para recibir actualizaciones de usuarios y salas sin necesidad de realizar consultas manuales constantemente.

### Supabase: mensajería y almacenamiento multimedia

Supabase se encarga de la gestión de las conversaciones y los recursos compartidos.

**PostgreSQL**

Almacena los mensajes en la tabla `messages`, relacionándolos mediante el identificador de la sala o conversación (`room_id`) y el identificador del usuario (`user_id`).

Los registros permiten gestionar diferentes tipos de contenido:

- Mensajes de texto.
- Fotografías.
- Archivos y documentos.
- Coordenadas geográficas.

**Supabase Realtime**

Utiliza canales de comunicación WebSocket para detectar nuevas inserciones en la tabla `messages`. De esta manera, los participantes reciben los mensajes sin tener que actualizar manualmente la conversación.

**Supabase Storage**

Almacena los recursos multimedia en el bucket `chat-files`. Las fotografías, imágenes de perfil y documentos se cargan al almacenamiento y posteriormente se obtiene una URL pública que permite acceder al contenido compartido.

### Flujo de integración

1. El usuario se registra o inicia sesión mediante Firebase Authentication.
2. Firebase genera y proporciona el identificador único del usuario.
3. La información del perfil se almacena en Cloud Firestore.
4. Las salas grupales se crean y consultan desde Firestore.
5. Al ingresar a una conversación, la aplicación consulta el historial de mensajes en Supabase.
6. Supabase Realtime establece una suscripción para recibir nuevos mensajes.
7. Los archivos multimedia se almacenan en Supabase Storage.
8. Los mensajes y las referencias a los archivos se guardan en PostgreSQL.

Esta distribución permite aprovechar los servicios de ambas plataformas sin depender exclusivamente de una sola solución backend.

## 4. Funcionalidades implementadas

La aplicación incorpora 15 funcionalidades principales.

| N.º | Funcionalidad | Descripción | Tecnología |
|---|---|---|---|
| 1 | Registro de usuarios | Creación de cuentas con correo y contraseña. | Firebase Authentication |
| 2 | Inicio de sesión | Autenticación de usuarios registrados. | Firebase Authentication |
| 3 | Cierre de sesión | Finalización de la sesión activa. | Firebase Authentication |
| 4 | Creación de salas grupales | Creación de espacios de conversación. | Firestore |
| 5 | Listado de salas en tiempo real | Actualización automática de las salas disponibles. | Firestore |
| 6 | Chats privados | Conversaciones individuales entre usuarios. | Firestore y Supabase |
| 7 | Búsqueda dinámica | Filtrado de salas y usuarios registrados. | Angular y TypeScript |
| 8 | Mensajes de texto | Envío y almacenamiento persistente de mensajes. | PostgreSQL |
| 9 | Mensajería en tiempo real | Recepción automática de nuevos mensajes. | Supabase Realtime |
| 10 | Envío de fotografías | Captura o selección de imágenes. | Capacitor Camera y Storage |
| 11 | Envío de documentos | Adjuntar y compartir archivos. | Supabase Storage |
| 12 | Compartir ubicación | Envío de coordenadas geográficas. | Capacitor Geolocation |
| 13 | Eliminación de mensajes | Eliminación de mensajes propios. | Supabase |
| 14 | Edición de perfil | Modificación de nombre, biografía, avatar y disponibilidad. | Firestore y Supabase Storage |
| 15 | Temas personalizados | Seis combinaciones de colores para la interfaz. | Angular, SCSS y localStorage |

## 5. Personalización de la interfaz

Envíos Paloma incorpora un sistema de personalización visual que permite seleccionar entre seis combinaciones de colores.

| Tema | Combinación |
|---|---|
| Rojo y negro | Interfaz con predominio de tonos oscuros y acentos rojos. |
| Rojo y blanco | Interfaz clara con detalles rojos. |
| Azul y negro | Interfaz oscura con detalles azules. |
| Azul y blanco | Interfaz clara con detalles azules. |
| Verde y negro | Interfaz oscura con detalles verdes. |
| Verde y blanco | Interfaz clara con detalles verdes. |

La selección se realiza desde el apartado de personalización y se aplica dinámicamente mediante variables CSS. La preferencia seleccionada se conserva utilizando `localStorage`, permitiendo mantener el tema elegido al volver a abrir la aplicación.

## 6. Estructura del proyecto

La organización del código se basa en una arquitectura modular de Ionic con Angular Standalone Components, separando las pantallas de usuario, los servicios de conexión y la configuración de la aplicación.

```text
EnviosPaloma-by-Alex/
│
├── android/
│   └── Aplicación nativa Android
│
├── assets/
│   └── Recursos gráficos
│
├── src/
│   ├── app/
│   │   ├── login/
│   │   │   ├── login.page.ts
│   │   │   └── login.page.html
│   │   │
│   │   ├── tab1/
│   │   │   ├── tab1.page.ts
│   │   │   └── tab1.page.html
│   │   │
│   │   ├── tab2/
│   │   │   ├── tab2.page.ts
│   │   │   └── tab2.page.html
│   │   │
│   │   ├── chat-room/
│   │   │   ├── chat-room.page.ts
│   │   │   └── chat-room.page.html
│   │   │
│   │   ├── services/
│   │   │   ├── firebase.ts
│   │   │   ├── supabase.ts
│   │   │   └── theme.ts
│   │   │
│   │   ├── app.component.ts
│   │   ├── app.routes.ts
│   │   └── tabs/
│   │
│   ├── environments/
│   │   └── environment.example.ts
│   │
│   ├── global.scss
│   ├── index.html
│   └── main.ts
│
├── capacitor.config.ts
├── angular.json
├── ionic.config.json
├── package.json
├── package-lock.json
└── README.md
```

## 7. Instalación y configuración

Para ejecutar el proyecto localmente es necesario contar con Node.js, npm, Ionic CLI y las herramientas correspondientes para el desarrollo con Android.

### 7.1. Clonar el repositorio

```bash
git clone https://github.com/MaCaReNo26/EnviosPaloma-by-Alex.git
```

Ingresar al directorio:

```bash
cd EnviosPaloma-by-Alex
```

### 7.2. Instalar dependencias

```bash
npm install
```

### 7.3. Configurar Firebase y Supabase

Por seguridad, los archivos de configuración con las credenciales de conexión no se incluyen en el repositorio.

Se proporciona `src/environments/environment.example.ts` como plantilla de configuración.

Crear los archivos locales:

- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`

Configurar los datos correspondientes:

```typescript
export const environment = {
  production: false,

  firebase: {
    apiKey: 'TU_FIREBASE_API_KEY',
    authDomain: 'TU_FIREBASE_AUTH_DOMAIN',
    projectId: 'TU_FIREBASE_PROJECT_ID',
    storageBucket: 'TU_FIREBASE_STORAGE_BUCKET',
    messagingSenderId: 'TU_FIREBASE_MESSAGING_SENDER_ID',
    appId: 'TU_FIREBASE_APP_ID'
  },

  supabase: {
    url: 'TU_SUPABASE_URL',
    key: 'TU_SUPABASE_ANON_O_PUBLISHABLE_KEY'
  }
};
```

Los valores deben obtenerse desde los respectivos paneles de administración de Firebase y Supabase.

### 7.4. Preparar los servicios backend

Antes de utilizar la aplicación, se deben configurar los siguientes servicios:

**En Firebase:**

1. Crear un proyecto en Firebase.
2. Habilitar Firebase Authentication con correo electrónico y contraseña.
3. Crear una base de datos Cloud Firestore.
4. Configurar las reglas de seguridad para las colecciones `users` y `rooms`.
5. Registrar la aplicación web y obtener las credenciales de configuración.

**En Supabase:**

1. Crear un proyecto.
2. Preparar la tabla PostgreSQL `messages` con las columnas utilizadas por la aplicación.
3. Habilitar Supabase Realtime para la tabla `messages`.
4. Crear el bucket de almacenamiento `chat-files`.
5. Configurar las políticas de acceso y almacenamiento correspondientes.
6. Obtener la URL del proyecto y su clave pública de cliente.

**Importante:** La configuración de los permisos y políticas de seguridad de ambos servicios debe realizarse antes de utilizar la aplicación en un entorno de producción.

### 7.5. Ejecutar en el navegador

```bash
ionic serve
```

La aplicación estará disponible localmente en la dirección indicada por Ionic CLI.

### 7.6. Compilar para producción

```bash
npm run build
```

### 7.7. Ejecutar en Android

Sincronizar los recursos web con el proyecto nativo:

```bash
npx cap sync android
```

Abrir el proyecto en Android Studio:

```bash
npx cap open android
```

Desde Android Studio se puede compilar, ejecutar y generar el APK para instalarlo en un dispositivo físico o emulador.

## 8. Seguridad y configuración de credenciales

El repositorio está preparado para excluir los archivos de configuración locales que contienen las credenciales de Firebase y Supabase.

Se utiliza `environment.example.ts` como referencia para que otros desarrolladores puedan configurar sus propias conexiones sin publicar información privada.

Se recomienda:

- No publicar contraseñas ni credenciales de acceso.
- No incluir archivos `environment.ts` o `environment.prod.ts` en Git.
- Configurar políticas de seguridad en Cloud Firestore.
- Aplicar políticas de acceso adecuadas en Supabase.
- Restringir las operaciones de eliminación de mensajes al usuario autorizado.
- Evitar exponer claves privadas o claves administrativas en aplicaciones cliente.

La clave pública de Supabase utilizada por el cliente no sustituye las políticas de autorización de la base de datos ni del almacenamiento.

## 9. Capturas de pantalla

A continuación se presentan las principales interfaces de Envíos Paloma.

### 9.1. Pantalla de inicio

<p align="center">
  <strong>Splash Screen</strong><br>
  
  <img src="https://github.com/user-attachments/assets/19fe46d4-1581-4d1a-b30b-36af5391cb5b" width="160">
  
</p>

### 9.2. Gestión de chats grupales

<table align="center">
  <tr>
    <th>Chats grupales</th>
    <th>Creación de nuevo chat grupal</th>
  </tr>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/a4357fa9-7c31-4bf5-b1f7-5788b6fb849f" width="160">
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/8f541132-2492-4d2f-a05c-47a39c212820" width="160">
    </td>
  </tr>
</table>

### 9.3. Chats privados

<table align="center">
  <tr>
    <th>Chats personales</th>
    <th>Chat con un usuario</th>
  </tr>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/52372300-f330-4835-9bf8-d08c4bf575b3" width="160">
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/3045d264-de2f-43cb-999b-67632cff03ca" width="160">
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/0bb233b0-9407-42b6-b721-3ec3ad1ee712" width="160">
    </td>
  </tr>
</table>

### 9.4. Perfil y personalización

<table align="center">
  <tr>
    <th>Perfil de usuario</th>
    <th>Personalización de temas</th>
  </tr>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/83864284-efe7-4de8-9f79-f86e17ef500a" width="160">
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/504d7f72-48e8-4481-b672-1ba6649af971" width="160">
    </td>
  </tr>
</table>

## 10. Objetivo académico

Este proyecto fue desarrollado como parte de una actividad académica orientada a la integración de servicios backend en aplicaciones móviles y web.

El propósito principal consiste en demostrar la capacidad de implementar una aplicación de comunicación que utilice simultáneamente Firebase y Supabase, distribuyendo las responsabilidades entre autenticación, almacenamiento de información, mensajería en tiempo real y gestión de archivos multimedia.

Asimismo, el desarrollo permite aplicar conocimientos de programación con Angular e Ionic, integración de servicios externos, bases de datos relacionales y no relacionales, comunicación mediante WebSockets y acceso a funcionalidades nativas de dispositivos móviles.

## 11. Despligue

La aplicación cuenta con una versión web desplegada mediante Firebase Hosting, lo que permite acceder a Envíos Paloma directamente desde un navegador sin necesidad de instalar la aplicación en un dispositivo móvil.

Acceso a la aplicación:

https://chat-dual-app.web.app

Ademas en la carpeta APK se encuentra una versión descargable de Envíos Paloma para probar su funcionalidad en un celular 

## 12. Autor

**Alex Suarez**

Proyecto académico desarrollado individualmente.
