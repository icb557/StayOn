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
- Docker Hub account (for `dhi.io` login and image publishing)

### Login to `dhi.io` (Hardened Images)

This project uses pre-hardened base images from Docker Hub's official Hardened Images registry (`dhi.io`), specifically Node.js and PostgreSQL.

1. **Generate a Personal Access Token in Docker Hub**
2. **Login to `dhi.io` using your Docker Hub username and token:**
   ```bash
   docker login dhi.io
   ```
   When prompted, enter your Docker Hub username and the Personal Access Token as the password.

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

### Secret Management

StayOn uses environment variables for secure credential management. All sensitive data is stored in `.env` files that are excluded from version control.

#### Initial Setup

1. **Copy the environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` with your actual credentials:**
   ```bash
   # Use your preferred editor
   nano .env
   # or
   vim .env
   ```

3. **Verify `.env` is gitignored:**
   The `.env` file should never be committed to version control. It's automatically excluded via `.gitignore`.

#### Environment Variables

The following variables are required in your `.env` file:

**Database Configuration:**
- `POSTGRES_DB`: PostgreSQL database name
- `POSTGRES_USER`: PostgreSQL database user
- `POSTGRES_PASSWORD`: PostgreSQL database password

**Backend Database Connection:**
- `DB_HOST`: Database host (use `database` for Docker Compose service name)
- `DB_PORT`: Database port (default: 5432)
- `DB_NAME`: Database name (should match `POSTGRES_DB`)
- `DB_USER`: Database user (should match `POSTGRES_USER`)
- `DB_PASSWORD`: Database password (should match `POSTGRES_PASSWORD`)

**Application Configuration:**
- `NODE_ENV`: Node environment (`development`, `production`, `test`)
- `PORT`: Backend server port (optional, defaults to 3000)

#### Security Best Practices

- ✅ **Never commit `.env` files** to version control
- ✅ **Use strong passwords** in production environments
- ✅ **Rotate credentials regularly** for production systems
- ✅ **Use different credentials** for development and production
- ✅ **Limit access** to `.env` files (use file permissions: `chmod 600 .env`)
- ✅ **Review `.env.example`** to ensure all required variables are documented

#### Production Deployment

For production deployments, consider these approaches:

**Option 1: Environment-Specific `.env` Files**
```bash
# Use different .env files for different environments
docker-compose --env-file .env.production up
```

**Option 2: CI/CD Secret Injection**
Most CI/CD platforms (GitHub Actions, GitLab CI, Jenkins) support secure secret injection:
```yaml
# Example: GitHub Actions
env:
  DB_PASSWORD: ${{ secrets.DB_PASSWORD }}
```

**Option 3: Docker Secrets (Docker Swarm)**
For Docker Swarm deployments, use Docker Secrets:
```yaml
services:
  database:
    secrets:
      - db_password
secrets:
  db_password:
    external: true
```

**Option 4: HashiCorp Vault**
For enterprise environments, integrate with HashiCorp Vault:
- Store secrets in Vault
- Use Vault Agent or API to inject secrets at runtime
- Supports dynamic secret rotation

**Option 5: Cloud Provider Secret Managers**
- **AWS**: AWS Secrets Manager or AWS Systems Manager Parameter Store
- **Azure**: Azure Key Vault
- **GCP**: Google Secret Manager
- **Kubernetes**: Kubernetes Secrets (if migrating to K8s)

These cloud services provide:
- Automatic secret rotation
- Audit logging
- Fine-grained access control
- Integration with IAM/RBAC

### Database Connection

The backend automatically connects to the PostgreSQL database using environment variables loaded from the `.env` file. The connection is configured in `stayOn_Backend/src/database/connection.js`.

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

### Multi-Stage Docker Builds

This project uses **multi-stage Dockerfiles** to optimize production images while maintaining full-featured development environments.

**Architecture:**
- **Dev stage**: Full development tools (nodemon, Angular CLI, build tools) with volume mounts for hot reload
- **Build/Deps stage**: Installs dependencies and compiles production assets
- **Prod stage**: Minimal runtime-only image (no dev dependencies, build tools, or shell)

### Running Development vs Production

**Development (default):**
```bash
docker compose up --build
```
- Targets: `dev` stage in Dockerfiles
- Images: `stayon-backend:dev`, `stayon-frontend:dev`
- Features: Hot reload, volume mounts, dev dependencies
- Containers: `stayon-backend-dev`, `stayon-frontend-dev`

**Production:**
```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build
```
- Targets: `prod` stage in Dockerfiles
- Images: `stayon-backend:prod`, `stayon-frontend:prod`
- Features: Minimal images, no shell, no source mounts, optimized builds
- Containers: `stayon-backend-prod`, `stayon-frontend-prod`
- Frontend: Served by nginx (port 80) with static Angular production build
- Backend: Runs directly with `node` (no nodemon)

## 📤 Tagging and Pushing Images (Docker Hub)

Use these steps to publish the backend, frontend, and database images to Docker Hub.

### 1) Build the images locally
```bash
docker build -t stayon-backend:latest ./stayOn_Backend
docker build -t stayon-frontend:latest ./stayOn_Frontend
```

The database uses the hardened image directly, so there is nothing to build unless you create a custom database image.

### 2) Tag the images with your Docker Hub namespace
Replace `<DOCKERHUB_USER>` with your Docker Hub username:
```bash
docker tag stayon-backend:latest <DOCKERHUB_USER>/stayon-backend:latest
docker tag stayon-frontend:latest <DOCKERHUB_USER>/stayon-frontend:latest
docker tag dhi.io/postgres:17-alpine3.22-dev <DOCKERHUB_USER>/stayon-database:latest
```

### 3) Push to Docker Hub
```bash
docker push <DOCKERHUB_USER>/stayon-backend:latest
docker push <DOCKERHUB_USER>/stayon-frontend:latest
docker push <DOCKERHUB_USER>/stayon-database:latest
```

If you create a custom database image, replace the database tag line above with your built image name.

## 📄 License

This project is part of the StayOn application.

