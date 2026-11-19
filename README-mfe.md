# MFE de gestión de inventario

## Despliegue local con Docker

1. Instala Docker Desktop desde [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/) e inicia Docker Desktop.
2. Conserva en el `.env` del backend las mismas credenciales de PostgreSQL y `JWT_SECRET_KEY` que usas en desarrollo. No guardes secretos en este README ni los publiques.
3. Desde esta carpeta, abre PowerShell y cambia al backend:

   ```powershell
   Set-Location ..\bff-inventory-management
   ```

4. Construye las imágenes e inicia PostgreSQL, la API y el frontend:

   ```powershell
   docker compose up --build -d
   ```

5. Revisa que los contenedores estén activos:

   ```powershell
   docker compose ps
   docker compose logs -f frontend api db
   ```

6. Abre el frontend en `http://localhost:3000`. Las solicitudes `/api` se envían a la API mediante Nginx; no es necesario configurar otra URL en el navegador.

El `Dockerfile` de esta carpeta construye la aplicación Vite y la sirve con Nginx. Para detener todos los servicios, ejecuta `docker compose down` desde la carpeta del backend. Esto conserva los datos de PostgreSQL. No ejecutes `docker compose down -v` salvo que quieras eliminar permanentemente la base local.

## Inicio local sin Docker

1. Inicia PostgreSQL y el backend siguiendo `bff-inventory-management/README.md`; la API debe estar disponible en `http://localhost:8000`.
2. Desde esta carpeta, instala dependencias e inicia Vite:

   ```powershell
   npm install
   npm run dev
   ```

3. Abre `http://localhost:5173`. Vite reenvía las solicitudes `/api` al backend local.

El inicio de sesión usa `POST /api/v1/authentication/login` y carga el perfil con `GET /api/v1/authentication/me`. Al cerrar sesión, llama a `POST /api/v1/authentication/logout` y revoca los tokens. Los tokens se mantienen solo en memoria mientras la aplicación está abierta. Las cuentas de desarrollo y sus credenciales están documentadas en el README del backend.

## Módulos conectados

- **Inicio** consulta el inventario y los últimos eventos para generar un resumen.
- **Activos tecnológicos** consulta los activos y catálogos; el Administrador puede registrar, editar y dar de baja. Cada activo permite consultar su historial.
- En **Activos tecnológicos > Catálogos**, el Administrador y el Encargado de inventario pueden crear, editar y eliminar marcas, modelos y tipos de equipo.
- **Ubicaciones** permite consultar sucursales y departamentos; el Administrador y el Encargado de inventario pueden crear, editar y eliminar esos registros.
- **Asignaciones** y **Traslados** muestran activos, custodios y ubicaciones. El Administrador puede cambiar custodio y ubicación en una operación.
- **Bitácora de auditoría** consulta los eventos inmutables del backend.
- **Usuarios y roles** consulta usuarios activos e inactivos y roles, y permite al Administrador crear, actualizar/reactivar y eliminar usuarios, además de crear, actualizar y eliminar roles. El backend impide eliminar la cuenta activa, usuarios con referencias históricas/asignaciones y roles que estén en uso.

Las operaciones usan la API con el token de sesión. `ADMINISTRADOR` tiene acceso completo; `ENCARGADO_INVENTARIO` puede realizar operaciones de activos y catálogos y consultar Usuarios y roles, sin modificar ese módulo. `CONSULTA` y otros roles pueden ver los módulos generales en modo de solo lectura, excepto Usuarios y roles. El backend aplica la autorización definitiva.
