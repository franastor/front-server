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

#### Opción 1: Usando PM2 (recomendado)

1. Instalar PM2 globalmente:
```bash
npm install -g pm2
```

2. Iniciar la aplicación con PM2:
```bash
pm2 start ./node_modules/.bin/serve --name "front-server" -- dist -l 3000
```

Comandos útiles de PM2:
```bash
# Ver logs
pm2 logs front-server

# Ver estado
pm2 status

# Reiniciar la aplicación
pm2 restart front-server

# Detener la aplicación
pm2 stop front-server

# Eliminar la aplicación
pm2 delete front-server

# Configurar inicio automático
pm2 startup
pm2 save
```

#### Opción 2: Usando Nginx

1. Instalar Nginx en tu servidor:
```bash
# En Ubuntu/Debian
sudo apt update
sudo apt install nginx

# En CentOS/RHEL
sudo yum install nginx
```

2. Copiar los archivos de la carpeta `dist` a la carpeta de Nginx:
```bash
# Crear directorio para la aplicación
sudo mkdir -p /var/www/front-server

# Copiar los archivos de la build
sudo cp -r dist/* /var/www/front-server/

# Asignar permisos correctos
sudo chown -R www-data:www-data /var/www/front-server
sudo chmod -R 755 /var/www/front-server
```

3. Crear un archivo de configuración para Nginx:
```bash
sudo nano /etc/nginx/sites-available/front-server
```

4. Copiar la siguiente configuración (también disponible en `nginx.conf` en la raíz del proyecto):
```nginx
server {
    listen 80;
    server_name tu-dominio.com;  # Reemplazar con tu dominio

    root /var/www/front-server;
    index index.html;

    # Compresión GZIP
    gzip on;
    gzip_vary on;
    gzip_min_length 10240;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml application/javascript;
    gzip_disable "MSIE [1-6]\.";

    # Caché del navegador
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # Configuración principal
    location / {
        try_files $uri $uri/ /index.html;
        add_header X-Frame-Options "SAMEORIGIN";
        add_header X-XSS-Protection "1; mode=block";
        add_header X-Content-Type-Options "nosniff";
    }

    # Prevenir acceso a archivos ocultos
    location ~ /\. {
        deny all;
    }

    # Optimización de seguridad
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin";
}
```

5. Habilitar el sitio:
```bash
# Crear enlace simbólico
sudo ln -s /etc/nginx/sites-available/front-server /etc/nginx/sites-enabled/

# Eliminar la configuración por defecto si existe
sudo rm /etc/nginx/sites-enabled/default

# Verificar la configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

6. Configurar SSL con Let's Encrypt (opcional pero recomendado):
```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obtener certificado SSL
sudo certbot --nginx -d tu-dominio.com
```

Notas importantes:
- Reemplaza `tu-dominio.com` con tu dominio real
- Asegúrate de que los puertos 80 y 443 estén abiertos en tu firewall
- Para desarrollo local, puedes usar `localhost` como server_name
- La configuración incluye optimizaciones de rendimiento y seguridad

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
