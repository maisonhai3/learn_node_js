# Mini-Trello API - Docker Setup

## 🐳 Docker Compose Setup

Dự án này đã được đóng gói hoàn chỉnh với Docker Compose, bao gồm:
- **Node.js App**: Express API server với TypeScript
- **PostgreSQL**: Database server
- **Prisma**: ORM với auto-migration

## 🚀 Cách chạy dự án

### 1. Production Mode (Recommended)
```bash
# Build và chạy containers
npm run docker:up

# Hoặc sử dụng docker-compose trực tiếp
docker-compose up -d
```

### 2. Development Mode
```bash
# Chạy với hot-reload trong container
npm run docker:dev

# Hoặc
docker-compose --profile dev up -d
```

### 3. Kiểm tra logs
```bash
# Xem logs của app
npm run docker:logs

# Xem logs của tất cả services
docker-compose logs -f
```

### 4. Dừng dự án
```bash
npm run docker:down
```

## 📊 Endpoints để test

Sau khi chạy `docker-compose up -d`, bạn có thể test các endpoints:

- **API Root**: http://localhost:3000/
- **Health Check**: http://localhost:3000/health  
- **Database Test**: http://localhost:3000/db-test
- **Boards API**: http://localhost:3000/boards (sẽ implement)
- **Tasks API**: http://localhost:3000/tasks (sẽ implement)

## 🔧 Services Configuration

### PostgreSQL Database
- **Host**: localhost:5432
- **Database**: minitrello
- **Username**: minitrello
- **Password**: password123

### Node.js App
- **Port**: 3000
- **Environment**: production/development
- **Auto-migration**: Enabled

## 🛠️ Docker Commands Cheat Sheet

```bash
# Build lại images
npm run docker:build

# Xem trạng thái containers
docker-compose ps

# Truy cập vào container app
docker exec -it minitrello-app sh

# Truy cập vào database
docker exec -it minitrello-db psql -U minitrello -d minitrello

# Xóa tất cả (bao gồm volumes)
docker-compose down -v

# Xem resource usage
docker stats
```

## 🔍 Troubleshooting

### 1. Container không start được
```bash
# Xem logs chi tiết
docker-compose logs app
docker-compose logs postgres
```

### 2. Database connection failed
```bash
# Kiểm tra database đã ready chưa
docker-compose ps
curl http://localhost:3000/db-test
```

### 3. Port conflict
Nếu port 3000 hoặc 5432 đã được sử dụng, sửa trong `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Thay đổi port mapping
```

## 📝 Next Steps

1. ✅ Docker setup hoàn tất
2. 🔄 Implement Board CRUD APIs
3. 🔄 Implement Task CRUD APIs  
4. 🔄 Add input validation middleware
5. 🔄 Add error handling
6. 🔄 Add logging middleware