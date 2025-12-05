# 👩‍⚕️ MatriTrack - Sistema de Automatización para el Seguimiento Materno

![Angular](https://img.shields.io/badge/Angular-20.3-red) ![NestJS](https://img.shields.io/badge/Backend-NestJS-E0234E) ![MySQL](https://img.shields.io/badge/Database-MySQL-00758F) ![TypeORM](https://img.shields.io/badge/ORM-TypeORM-4285F4) ![JWT](https://img.shields.io/badge/Auth-JWT-orange)

MatriTrack es un **Sistema Integral Full-Stack** diseñado para la gestión clínica del personal de **Obstetricia** (MINSA). Su objetivo principal es automatizar y optimizar el **seguimiento de mujeres en etapa de gestación y puerperio**, garantizando la integridad del historial clínico, la trazabilidad de los controles y la gestión de resultados de análisis.

Este proyecto demuestra una arquitectura de microservicios con separación de responsabilidades, seguridad basada en tokens y manejo de lógica de negocio compleja.

---

## 🔑 Credenciales de Acceso (Demo)

Utiliza estas credenciales precargadas para probar los diferentes niveles de acceso y flujos de trabajo del sistema. Recuerda que la autenticación usa el DNI (8 dígitos) como usuario:

| Rol | Usuario (DNI) | Contraseña | Permisos Clave |
| :--- | :--- | :--- | :--- |
| **Administrador** 🛡️ | `12345678` | `admin123` | Gestión de Obstetras y Catálogo de Análisis. |
| **Obstetra** 🩺 | `45678949` | `NoS69$6J` | Registro de Pacientes, Creación de Programas (Diagnóstico/Puerperio) y Controles. |

---

## ✨ Características y Lógica de Negocio

### 🏥 Módulo Clínico (Obstetra)

- **Historial Clínico Centralizado:** Registro y consulta de toda la información médica.
- **Doble Programa de Seguimiento:** Lógica de negocio separada para pacientes en **Gestación** (Diagnóstico) y **Puerperio** (Postnatal).
- **Controles y Análisis:** Solicitud de análisis y registro de resultados con manejo de carga de archivos (PDF) en el backend.

### ⚙️ Módulo Administrativo (Administrador)

- **Gestión de Usuarios:** Registro de nuevo personal Obstetra con generación de contraseña segura.
- **Mantenimiento de Catálogos:** Gestión (CRUD) de los tipos de análisis disponibles en el sistema.

---

## 🛠️ Stack Tecnológico (Full-Stack)

| Componente | Tecnología | Versión Clave | Uso Específico |
| :--- | :--- | :--- | :--- |
| **Frontend** | Angular | `20.3.0` | Interfaz de usuario rica y manejo de formularios reactivos. |
| **Backend** | NestJS | `10.3.0` | Servidor API RESTful, Arquitectura Modular y JWT. |
| **Bases de Datos** | MySQL | `8.x` | Almacenamiento persistente de la información clínica. |
| **ORM** | TypeORM | `0.3.12` | Mapeo Objeto-Relacional y gestión de entidades. |

---

## 🏗️ Estructura del Proyecto

El proyecto se organiza en una carpeta principal que contiene el Frontend y el Backend separados, tal como se encuentra en el repositorio:
```text
MatriTrack-Obstetricia/
├── backend/            # API RESTful (NestJS, Puerto 3000)
│   ├── src/
│   │   ├── auth/           # Módulo de Autenticación (JWT)
│   │   └── modules/        # Lógica de Negocio (Paciente, Programa, Control)
│   └── .env            # Configuración de BD y claves
├── frontend/           # Interfaz de Usuario (Angular, Puerto 4200)
│   └── src/app/
│       ├── pages/          # Vistas (Login, Dashboard, Pacientes)
│       └── services/       # Conexión al backend
└── README.md           # Este documento
```

---

## 🚀 Instalación y Ejecución

Sigue estos pasos para levantar el proyecto. La carpeta raíz es `MatriTrack-Obstetricia`.

### 1. Requisitos y Configuración de Base de Datos

1. **Requisitos:** Instalar Node.js (LTS) y MySQL Server.
2. **Crea la BD:** Abre tu gestor de base de datos (MySQL Workbench, DBeaver) y ejecuta:
```sql
CREATE DATABASE matritrack;
```

3. **Clonar el repositorio:**
```bash
git clone https://github.com/YuleisyQuipuzcoa22/MatriTrack.git MatriTrack-Obstetricia
cd MatriTrack-Obstetricia
```

4. **Crea el archivo `.env`:** En la carpeta `backend`, crea el archivo `.env` con el siguiente template. Debes sustituir los valores de `DB_USERNAME` y `DB_PASSWORD` por tus credenciales de MySQL local.
```
# CONFIGURACIÓN DE LA BASE DE DATOS LOCAL
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root         # <-- ¡COLOCA AQUÍ TU USUARIO DE MYSQL!
DB_PASSWORD=             # <-- ¡COLOCA AQUÍ TU CONTRASEÑA DE MYSQL! (ej. password123)
DB_DATABASE=matritrack

# CLAVES DE SEGURIDAD
JWT_SECRET=UNA_CLAVE_SUPER_LARGA_Y_COMPLEJA_AQUI12345
RECAPTCHA_SECRET_KEY=6LfoWeIrAAAAAD2tJutMn5jZEPCkKpLLroJHK113
```

### 2. Puesta en Marcha del Backend (Terminal 1)

1. Navega al backend:
```bash
cd backend
```

2. Instala dependencias:
```bash
npm install
```

3. Ejecutar el servidor:
```bash
npm run start # Servidor API disponible en http://localhost:3000
```

### 3. Puesta en Marcha del Frontend (Terminal 2)

1. Navega al frontend (en una nueva terminal):
```bash
cd ../frontend
```

2. Instala dependencias:
```bash
npm install
```

3. Ejecutar la aplicación:
```bash
npm start # Aplicación Angular disponible en http://localhost:4200
```

Una vez ambos servidores estén activos, accede a `http://localhost:4200` e inicia sesión con las credenciales de demo.
