# 🧬 HealthAI Labs

HealthAI Labs is a modern full-stack project that delivers AI-powered health tools and real-time medical news.  
It includes:

- **FastAPI Backend** – AI endpoints & medical news API  
- **React Frontend** – clean UI served via Nginx  
- **Dockerized Deployment** – start everything with one command  

This repository lets you deploy the entire system easily using **Docker Compose**.

---

# ✨ Features

### 🧠 Backend (FastAPI)
- `/api/news` → Fetches real-time medical news from GNews API  
- `/rays`, `/report`, `/analysis`, `/askdoctor` → AI service routes  
- Automatic fallback to **mock news** when no API key exists  
- Fully asynchronous using FastAPI + httpx  

### 🎨 Frontend (React + TailwindCSS)
- Responsive modern news layout  
- Floating news card design  
- Skeleton loading  
- Beautiful animations  

### 🐳 Deployment
- Docker images hosted on Docker Hub  
- One network + persistent Nginx cache  
- Cross-container communication via bridge network  

---

# 🏗️ Architecture

```
                ┌─────────────────────────┐
                │       Frontend          │
                │   React + Nginx (80)    │
                └─────────────┬───────────┘
                              │
                              ▼
                       healthai-network
                              │
                              ▼
                ┌─────────────────────────┐
                │        Backend          │
                │     FastAPI (8000)      │
                └─────────────────────────┘
```

---

# 📦 Technologies Used

**Backend**  
FastAPI, Python, httpx, Uvicorn

**Frontend**  
React, Vite, TailwindCSS, Axios, Nginx

**DevOps**  
Docker, Docker Compose, Docker Hub

---

# 🔧 Requirements

- Docker  
- Docker Compose  
- Git  

---

# 🐳 Install Docker (Latest Version)

### Ubuntu / Debian
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

Allow Docker without sudo:
```bash
sudo usermod -aG docker $USER
```
Logout/login again.

---

# 🧩 Install Docker Compose (Latest)

```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" \
  -o /usr/local/bin/docker-compose

sudo chmod +x /usr/local/bin/docker-compose
```

Check version:
```bash
docker-compose --version
```

---

# 📁 Clone the Project

```bash
git clone https://github.com/passw0rd010/healthai-labs.git
cd healthai-labs
```

---

# 🔐 Environment Variables

Create a `.env` file in the project root:

```env
GNEWS_API_KEY=your_gnews_api_key_here
```

If missing, backend returns **mock news** automatically.

---

# 🐳 Docker Compose (Pulling Images From Docker Hub)

This project uses prebuilt images:

- **Backend** → `passw0rd010/healthai-labs:backend`  
- **Frontend** → `passw0rd010/healthai-labs:frontend`  

Here is the full `docker-compose.yml`:

```yaml
version: '3.8'

services:
  backend:
    image: passw0rd010/healthai-labs:backendv2
    container_name: healthai-backend
    ports:
      - "8000:8000"
    environment:
      - GNEWS_API_KEY=${GNEWS_API_KEY}
    env_file:
      - .env
    networks:
      - healthai-network

  frontend:
    image: passw0rd010/healthai-labs:frontendv2
    container_name: healthai-frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    volumes:
      - nginx_cache:/var/cache/nginx
    networks:
      - healthai-network

volumes:
  nginx_cache:

networks:
  healthai-network:
    driver: bridge
```

---

# 🚀 Run the App

Start everything:

```bash
docker-compose up -d
```

Backend → http://localhost:8000  
Frontend → http://localhost  

Check running containers:
```bash
docker ps
```

---

# 🛑 Stop the App

```bash
docker-compose down
```

Remove containers + volumes:
```bash
docker-compose down -v
```

---

# 🔄 Update to Newest Images

```bash
docker pull passw0rd010/healthai-labs:backend
docker pull passw0rd010/healthai-labs:frontend
docker-compose up -d --force-recreate
```

---

# 🧪 Test Backend

```bash
curl http://localhost:8000/
curl http://localhost:8000/api/news
curl http://localhost:8000/rays
```

---

# 🌐 Frontend Access

Open in browser:

```
http://localhost
```

---

# ❗ Troubleshooting

### Backend API key missing
Check `.env` file.

### "Port already in use"
Edit ports in `docker-compose.yml`.

### Log errors
```bash
docker-compose logs -f
```

---

# 🤝 Contributing

Pull requests and issues are welcome!

---

# 👤 Author

**Abdullah Sameh**  
Docker Hub: passw0rd010  
GitHub: https://github.com/passw0rd010

---

# 📜 License  
MIT License

