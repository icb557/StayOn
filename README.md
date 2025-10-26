# StayOn - Docker Setup

This project uses Docker Compose to orchestrate three containerized services: PostgreSQL database, Express.js backend, and Angular frontend.

## 🐳 Docker Architecture

### Services

| Service | Container Name | Port | Base Image |
|---------|---------------|------|------------|
| **Database** | `stayon-database` | 5432 | `postgres:17.6-alpine3.22` |
| **Backend** | `stayon-backend` | 3000 | `node:22.21.0-alpine3.22` |
| **Frontend** | `stayon-frontend` | 4000 | `node:22.21.0-alpine3.22` |

### Project Structure

```
StayOn/
├── docker-compose.yml          # Orchestrates all services
├── stayOn_Backend/
│   ├── Dockerfile             # Backend container configuration
│   └── src/                   # Express.js application
└── stayOn_Frontend/
    ├── Dockerfile             # Frontend container configuration
    └── src/                   # Angular application
```

## 🚀 Getting Started

### Prerequisites

- Docker Engine 20.10+
- Docker Compose V2

### Running the Application

1. **Start all services:**
   ```bash
   docker-compose up --build
   ```

2. **Run in detached mode (background):**
   ```bash
   docker-compose up -d --build
   ```

3. **Access the application:**
   - Frontend: http://localhost:4000
   - Backend API: http://localhost:3000
   - Database: localhost:5432

### Stopping the Application

- **Stop all containers:**
  ```bash
  docker-compose down
  ```

- **Stop and remove volumes (⚠️ deletes all database data):**
  ```bash
  docker-compose down -v
  ```

## 🔧 Configuration

### Database Connection

The backend automatically connects to the PostgreSQL database using these environment variables:

- `DB_HOST`: database
- `DB_PORT`: 5432
- `DB_NAME`: stayonDB
- `DB_USER`: stayon
- `DB_PASSWORD`: 1234

### Database Initialization

On backend startup, the container automatically:
1. Runs `npm run sync` - Creates/syncs database tables
2. Runs `npm run dev` - Starts the Express.js server with nodemon

### Volumes

- **stayon**: Named volume for persistent PostgreSQL data storage

### Networks

- **stayon-network**: Bridge network for inter-container communication

## 📝 Useful Commands

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f database
```

### Rebuild specific service
```bash
docker-compose up -d --build backend
docker-compose up -d --build frontend
```

### Execute commands in containers
```bash
# Access backend shell
docker exec -it stayon-backend sh

# Access database shell
docker exec -it stayon-database psql -U stayon -d stayonDB

# Access frontend shell
docker exec -it stayon-frontend sh
```

### Database queries (inside container)
```bash
docker exec -it stayon-database psql -U stayon -d stayonDB
```

**Note:** PostgreSQL table names are case-sensitive. Use double quotes:
```sql
SELECT * FROM "Posts";
SELECT * FROM "Users";
```

## 🔍 Troubleshooting

### Port already in use
If ports 3000, 4000, or 5432 are already in use, modify the port mappings in `docker-compose.yml`:
```yaml
ports:
  - "YOUR_PORT:CONTAINER_PORT"
```

### Database connection issues
Ensure the database service is healthy before the backend starts. The health check is configured with:
- Interval: 10s
- Timeout: 5s
- Retries: 5

### Permission errors
The containers run as non-root user `stayon` for security. If you encounter permission issues, verify file ownership in your local directories.

### Frontend not accessible
Angular dev server must bind to `0.0.0.0` to accept external connections. This is configured in the container command:
```bash
npm run start -- --host 0.0.0.0 --port 4000
```

## 🛠️ Development

### Hot Reload

Both frontend and backend support hot reload during development:
- **Backend**: Uses `nodemon` to watch for file changes
- **Frontend**: Uses Angular's dev server watch mode

Changes to source files are immediately reflected in the running containers.

### Node Modules

The `node_modules` directories are excluded from volume mounts to avoid conflicts between host and container dependencies:
```yaml
volumes:
  - ./stayOn_Backend:/app
  - /app/node_modules  # Keeps container's node_modules
```

## 📦 Production Considerations

For production deployment, consider:
- Using environment-specific `docker-compose.prod.yml`
- Securing database credentials with Docker secrets
- Using multi-stage builds to reduce image size
- Implementing proper logging and monitoring
- Setting up reverse proxy (nginx) for frontend and backend
- Using production builds for Angular (`ng build --configuration production`)

## 📄 License

This project is part of the StayOn application.

