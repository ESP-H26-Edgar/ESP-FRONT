# RacePortal – Frontend

Frontend de l’application **RacePortal**, une plateforme de gestion de courses sportives avec interface utilisateur et panneau d’administration.

---

## Information sur le projet : 

- React (TypeScript)
- Vite
- SCSS
- Fetch API custom hook
- JWT via cookies HttpOnly
- React Hooks (useState, useEffect)

##  Installation
### 1 Cloner le projet

  ```bash
  git clone https://github.com/ton-compte/raceportal-frontend.git
  cd raceportal-frontend
  ```

### 2 Installer les dépendances
  ```bash
  npm install
  ```
### 3 Configurer l'api dans le useFetch
  const baseurl = "https://api;

### 4 Ajout du .env
  ```bash
  VITE_STRIPE_PUBLIC_KEY=cleStripe
  ```

### 5 Lancer le projet en développement 
  ```bash
    npm run dev
  ```
### 6 Build en production
  ```bash
    npm run build
  ```
### 7 Ajouter la config nginx
  ```bash
    server {
        server_name example.com www.example.com;
    
        root /var/www/app;
        index index.html;
    
        # API backend
        location /api {
            proxy_pass http://localhost:5000;
    
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    
        # Swagger / docs API
        location /swagger {
            proxy_pass http://localhost:5000;
    
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    
        # Images statiques
        location /images {
            alias /var/www/app/api/images/;
            expires 30d;
            add_header Cache-Control "public";
        }
    
        # React SPA
        location / {
            try_files $uri $uri/ /index.html;
        }
    
        listen 443 ssl;
    
        ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    
        include /etc/letsencrypt/options-ssl-nginx.conf;
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
    }
    
    # Redirect HTTP → HTTPS
    server {
        listen 80;
        server_name example.com www.example.com;
    
        return 301 https://$host$request_uri;
    }
  ```
