# Front Server

Una aplicación web que simula una terminal de Linux con efectos visuales y animaciones.

## Características

- Interfaz de terminal de Linux
- Animaciones de texto
- Barra de carga
- Efectos visuales de "hackeo"
- Diseño responsive

## Tecnologías utilizadas

- React
- TypeScript
- Vite
- CSS3 con animaciones

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/franastor/front-server.git

# Entrar al directorio
cd front-server

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

## Uso

La aplicación se ejecutará en `http://localhost:5173` por defecto.

## Despliegue en Producción

### 1. Construir la aplicación

```bash
# Generar la build de producción
npm run build
```

Esto creará una carpeta `dist` con los archivos optimizados para producción.

### 2. Desplegar la aplicación

Hay varias opciones para desplegar la aplicación:

#### Opción 1: Usando un servidor estático (recomendado)

```bash
# Instalar un servidor estático (por ejemplo, serve)
npm install -g serve

# Servir la aplicación
serve -s dist
```

#### Opción 2: Usando Nginx

1. Instalar Nginx en tu servidor
2. Copiar los archivos de la carpeta `dist` a la carpeta de Nginx (normalmente `/var/www/html/`)
3. Configurar Nginx para servir la aplicación:

```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### Opción 3: Usando Docker

1. Crear un Dockerfile:

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

2. Construir y ejecutar el contenedor:

```bash
# Construir la imagen
docker build -t front-server .

# Ejecutar el contenedor
docker run -p 80:80 front-server
```

### 3. Variables de entorno

Para producción, puedes crear un archivo `.env.production` con las variables de entorno necesarias:

```env
VITE_API_URL=https://tu-api.com
```

### 4. Optimizaciones recomendadas

- Configurar un CDN para servir los archivos estáticos
- Habilitar compresión GZIP en el servidor
- Configurar caché del navegador
- Implementar HTTPS
- Configurar monitoreo y logs

### 5. Monitoreo

Para monitorear la aplicación en producción, puedes usar servicios como:
- Google Analytics
- Sentry para tracking de errores
- LogRocket para análisis de usuario
- New Relic para monitoreo de rendimiento
