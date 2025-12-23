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
  # PostgreSQL Database
  db:
    image: postgres:15-alpine
    container_name: healthai_postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: healthai
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: healthai_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U healthai"]
      interval: 10s
      timeout: 5s
      retries: 10
      start_period: 30s
    networks:
      - healthai-network

  # MinIO Object Storage
  minio:
    image: minio/minio:latest
    container_name: healthai_minio
    restart: unless-stopped
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: ${MINIO_ROOT_USER:-minioadmin}
      MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD}
    volumes:
      - minio_data:/data
    ports:
      - "9000:9000"
      - "9001:9001"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 20s
      retries: 3
    networks:
      - healthai-network

  # Backend API
  backend:
    image: passw0rd010/healthai-backend:latest
    container_name: healthai-backend
    restart: unless-stopped
    ports:
      - "8000:8000"
    env_file:
      - ./.env  # Path to .env in root
    environment:
      DATABASE_URL: postgresql://healthai:${DB_PASSWORD}@db:5432/healthai_db
    volumes:
      - backend_uploads:/app/uploads
      - backend_logs:/app/logs
    depends_on:
      db:
        condition: service_healthy
    networks:
      - healthai-network
    command: >
      sh -c '
      echo "Waiting for database to be ready...";
      for i in 1 2 3 4 5 6 7 8 9 10; do
        echo "Attempt $$i: Checking database connection...";
        if python -c "from db import check_db_connection; check_db_connection()"; then
          echo "Database is ready!";
          break;
        fi;
        if [ $$i -eq 10 ]; then
          echo "Database connection failed after 10 attempts";
          exit 1;
        fi;
        echo "Database not ready, waiting 3 seconds...";
        sleep 3;
      done;
      echo "Initializing database tables...";
      python -c "from db import init_db; init_db()";
      echo "Starting uvicorn server...";
      uvicorn app:app --host 0.0.0.0 --port 8000 --workers 1 --log-level info
      '

  # Frontend (React + Nginx)
  frontend:
    image: passw0rd010/healthai-frontend:latest
    container_name: healthai-frontend
    restart: unless-stopped
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - healthai-network

volumes:
  postgres_data:
  minio_data:
  backend_uploads:
  backend_logs:

networks:
  healthai-network:
    driver: bridge
```

---

# 🚀 Run the App

Start everything:

```bash
docker-compose up -d
or
docker compose up -d
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
or
docker compose down
```

Remove containers + volumes:
```bash
docker-compose down -v
```

---

# 🔄 Update to Newest Images

```bash
docker pull  passw0rd010/healthai-backendend:latest
docker pull  passw0rd010/healthai-frontend:latest
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


