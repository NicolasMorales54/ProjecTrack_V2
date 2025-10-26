# Guía de Despliegue - Projectrack

Esta guía detalla los pasos para desplegar Projectrack en Google Cloud (backend + base de datos) y Netlify (frontend).

## Arquitectura de Despliegue

```
┌─────────────────┐         ┌──────────────────────────┐
│                 │         │  Google Cloud VM         │
│  Netlify        │         │  35.208.217.192:3000    │
│  (Frontend)     │────────▶│                          │
│                 │  /api/* │  ┌──────────┐            │
│                 │         │  │ Backend  │            │
└─────────────────┘         │  │ (NestJS) │            │
                            │  └────┬─────┘            │
                            │       │                  │
                            │  ┌────▼─────┐            │
                            │  │  MySQL   │            │
                            │  │  (Docker)│            │
                            │  └──────────┘            │
                            └──────────────────────────┘
```

## Requisitos Previos

### Para Google Cloud VM
- Acceso SSH a la VM (IP: 35.208.217.192)
- Docker y Docker Compose instalados
- Puerto 3000 abierto en el firewall

### Para Netlify
- Cuenta de Netlify
- Netlify CLI (opcional): `npm install -g netlify-cli`

## Parte 1: Despliegue del Backend en Google Cloud

### 1.1 Conectarse a la VM

```bash
# Conectarse por SSH a la máquina virtual
ssh usuario@35.208.217.192
```

### 1.2 Instalar Docker y Docker Compose (si no están instalados)

```bash
# Actualizar paquetes
sudo apt update

# Instalar Docker
sudo apt install -y docker.io

# Instalar Docker Compose
sudo apt install -y docker-compose

# Agregar usuario al grupo docker (para no usar sudo)
sudo usermod -aG docker $USER

# Aplicar cambios (cerrar sesión y volver a entrar)
exit
ssh usuario@35.208.217.192
```

### 1.3 Subir Archivos a la VM

Desde tu máquina local, sube los archivos necesarios:

```bash
# Crear directorio en la VM
ssh usuario@35.208.217.192 "mkdir -p ~/projectrack"

# Subir docker-compose.yml
scp docker-compose.yml usuario@35.208.217.192:~/projectrack/

# Subir script SQL de inicialización
scp db-yofer.sql usuario@35.208.217.192:~/projectrack/

# Subir carpeta backend completa
scp -r backend/ usuario@35.208.217.192:~/projectrack/
```

### 1.4 Configurar Variables de Entorno

**IMPORTANTE:** Antes de levantar los contenedores, actualiza la variable `FRONTEND_URL` en el archivo `docker-compose.yml` con tu dominio de Netlify.

```bash
# Conectarse a la VM
ssh usuario@35.208.217.192

# Navegar al directorio
cd ~/projectrack

# Editar docker-compose.yml
nano docker-compose.yml

# Cambiar la línea:
# FRONTEND_URL: https://tu-app.netlify.app
# Por:
# FRONTEND_URL: https://TU-DOMINIO-REAL.netlify.app
```

### 1.5 Construir y Levantar los Contenedores

```bash
# En el directorio ~/projectrack en la VM

# Construir las imágenes
docker-compose build

# Levantar los servicios
docker-compose up -d

# Verificar que los contenedores estén corriendo
docker-compose ps

# Ver logs del backend
docker-compose logs -f backend

# Ver logs de MySQL
docker-compose logs -f mysql
```

### 1.6 Verificar el Despliegue

```bash
# Verificar que el backend responde
curl http://localhost:3000

# Verificar conectividad MySQL
docker exec -it projectrack-mysql mysql -uroot -proot -e "SHOW DATABASES;"
```

### 1.7 Configurar Firewall (si es necesario)

```bash
# Abrir puerto 3000 en el firewall de Google Cloud
# Desde Google Cloud Console:
# VPC Network > Firewall > Create Firewall Rule
# - Name: allow-backend
# - Targets: All instances in the network
# - Source IP ranges: 0.0.0.0/0
# - Protocols and ports: tcp:3000
```

## Parte 2: Despliegue del Frontend en Netlify

### 2.1 Preparar el Frontend

Desde tu máquina local, en el directorio del proyecto:

```bash
# Navegar al frontend
cd frontend

# Instalar dependencias (si no lo has hecho)
npm install

# Construir para producción
npm run build
```

El build se generará en `dist/projectrack/browser/`.

### 2.2 Desplegar en Netlify

#### Opción A: Mediante la Interfaz Web de Netlify

1. Ve a [https://app.netlify.com](https://app.netlify.com)
2. Haz clic en "Add new site" > "Deploy manually"
3. Arrastra la carpeta `dist/projectrack/browser/` al área de despliegue
4. Espera a que termine el despliegue
5. Netlify te asignará un dominio (ej: `random-name-123.netlify.app`)

#### Opción B: Mediante Netlify CLI

```bash
# En el directorio frontend/

# Iniciar sesión en Netlify
netlify login

# Desplegar el sitio
netlify deploy --prod --dir=dist/projectrack/browser
```

### 2.3 Obtener el Dominio de Netlify

Después del despliegue, Netlify te dará un dominio. Por ejemplo:
- `https://projectrack.netlify.app`

**IMPORTANTE:** Copia este dominio.

### 2.4 Actualizar CORS en el Backend

Ahora que tienes el dominio de Netlify, debes actualizar la variable `FRONTEND_URL` en el backend:

```bash
# Conectarse a la VM
ssh usuario@35.208.217.192

# Navegar al directorio
cd ~/projectrack

# Editar docker-compose.yml
nano docker-compose.yml

# Actualizar:
# FRONTEND_URL: https://projectrack.netlify.app

# Reiniciar el backend para aplicar cambios
docker-compose restart backend
```

### 2.5 Verificar el Despliegue Completo

1. Abre tu aplicación en Netlify: `https://tu-dominio.netlify.app`
2. Intenta iniciar sesión con las credenciales de prueba
3. Verifica que las peticiones API funcionen correctamente

Puedes abrir las DevTools del navegador (F12) y ver en la pestaña "Network" que las peticiones a `/api/*` se están redirigiendo correctamente al backend en Google Cloud.

## Comandos Útiles

### En la VM (Google Cloud)

```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs solo del backend
docker-compose logs -f backend

# Ver logs solo de MySQL
docker-compose logs -f mysql

# Reiniciar servicios
docker-compose restart

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes (¡CUIDADO! Elimina los datos de la BD)
docker-compose down -v

# Reconstruir imágenes
docker-compose build --no-cache

# Ver estado de contenedores
docker-compose ps

# Ejecutar comando en el contenedor MySQL
docker exec -it projectrack-mysql mysql -uroot -proot yofer

# Ver espacio usado por Docker
docker system df

# Limpiar imágenes y contenedores no usados
docker system prune -a
```

### En el Frontend (Local)

```bash
# Hacer un nuevo build
npm run build

# Desplegar actualización en Netlify (CLI)
netlify deploy --prod --dir=dist/projectrack/browser

# Ver logs de Netlify
netlify logs
```

## Solución de Problemas

### Error: "Cannot connect to database"

```bash
# Verificar que MySQL esté corriendo
docker-compose ps

# Ver logs de MySQL
docker-compose logs mysql

# Verificar conectividad desde el backend
docker exec -it projectrack-backend sh
# Dentro del contenedor:
ping mysql
```

### Error: CORS en el Frontend

1. Verifica que el `FRONTEND_URL` en `docker-compose.yml` sea correcto
2. Reinicia el backend: `docker-compose restart backend`
3. Limpia el caché del navegador

### Error: 404 en rutas del Frontend

Verifica que el archivo `netlify.toml` esté en la raíz del directorio `frontend/` y que se haya subido correctamente.

### El backend no responde desde el frontend

1. Verifica que el puerto 3000 esté abierto en el firewall de Google Cloud
2. Verifica que la IP en `netlify.toml` sea correcta: `35.208.217.192`
3. Prueba hacer una petición directa desde tu navegador: `http://35.208.217.192:3000`

## Actualización de la Aplicación

### Actualizar Backend

```bash
# En la VM

# Hacer pull de los cambios (si usas Git)
cd ~/projectrack/backend
git pull

# O subir archivos manualmente desde local
# scp -r backend/ usuario@35.208.217.192:~/projectrack/

# Reconstruir y reiniciar
cd ~/projectrack
docker-compose build backend
docker-compose up -d backend
```

### Actualizar Frontend

```bash
# En local, directorio frontend/

# Hacer build de producción
npm run build

# Desplegar en Netlify
netlify deploy --prod --dir=dist/projectrack/browser
```

## Backup de la Base de Datos

```bash
# En la VM

# Crear backup
docker exec projectrack-mysql mysqldump -uroot -proot yofer > backup_$(date +%Y%m%d).sql

# Restaurar backup
docker exec -i projectrack-mysql mysql -uroot -proot yofer < backup_20250126.sql
```

## Monitoreo

### Verificar Salud de los Servicios

```bash
# CPU y memoria de contenedores
docker stats

# Ver procesos dentro del contenedor
docker top projectrack-backend
docker top projectrack-mysql
```

## Notas Adicionales

- **Seguridad**: En producción, considera cambiar las contraseñas de MySQL y el `SESSION_SECRET`
- **SSL/HTTPS**: Para usar HTTPS en el backend, considera usar un reverse proxy como Nginx con Let's Encrypt
- **Dominio personalizado**: Puedes configurar un dominio personalizado en Netlify
- **Logs**: Los logs de Docker se almacenan en `/var/lib/docker/containers/`
- **Volúmenes**: Los datos de MySQL persisten en el volumen `mysql_data` definido en `docker-compose.yml`

## Contacto y Soporte

Para problemas o dudas sobre el despliegue, consulta la documentación oficial:
- [Docker Compose](https://docs.docker.com/compose/)
- [Netlify](https://docs.netlify.com/)
- [Google Cloud](https://cloud.google.com/docs)
