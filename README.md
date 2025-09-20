# Mini-Trello API

Một REST API đơn giản để quản lý công việc theo mô hình Trello, được xây dựng với Node.js, TypeScript, Express.js và Prisma.

## ✅ Status: HOÀN THÀNH VÀ SẴN SÀNG SỬ DỤNG!

🎉 **Dự án đã được containerized hoàn toàn và chạy thành công!**

### 🚀 Quick Start (Docker)
```bash
# Chạy toàn bộ stack (PostgreSQL + API)
npm run docker:up

# ✅ Database migration tự động chạy khi container khởi động!
# Không cần manual setup nữa

# Test API
curl http://localhost:3000/
curl http://localhost:3000/boards
```

### 📊 API đã test thành công:
- ✅ Server khởi động: http://localhost:3000
- ✅ Health check: http://localhost:3000/health  
- ✅ Database connection: http://localhost:3000/db-test
- ✅ Boards CRUD: http://localhost:3000/boards
- ✅ Tasks CRUD: http://localhost:3000/boards/:id/tasks

### 🏆 Performance Testing: Express.js vs Fastify
🎯 **Performance Winner: Express.js** (11.3% faster under load)

| Test Scenario | Express.js | Fastify | Winner |
|---------------|------------|---------|---------|
| Baseline (10 conn) | 835 req/s | 765 req/s | 🏆 Express |
| High Load (100 conn) | 1,043 req/s | 937 req/s | 🏆 Express |
| Avg Latency | 11.47ms | 12.55ms | 🏆 Express |

**🚀 Quick Performance Test:**
```bash
# Start both servers
npm run docker:perf

# Run quick comparison
./perf-test.sh quick

# Full performance suite
./perf-test.sh full
```

### 🤖 Auto Database Migration
Database schema được setup tự động khi container khởi động:
- **Lần đầu**: Tự động tạo migration từ schema.prisma
- **Lần sau**: Apply existing migrations  
- **Production**: Chỉ deploy migrations có sẵn
- **Development**: Có thể tạo migrations mới

## Tính năng

- **Quản lý Boards (Bảng)**: Tạo, đọc, cập nhật và xóa các bảng công việc
- **Quản lý Tasks (Nhiệm vụ)**: Tạo, đọc, cập nhật và xóa các nhiệm vụ trong mỗi bảng
- **Trạng thái Task**: Hỗ trợ 3 trạng thái: `Todo`, `In Progress`, `Done`
- **Validation**: Kiểm tra dữ liệu đầu vào và tồn tại của resources
- **Logging**: Ghi log chi tiết các request

## Công nghệ sử dụng

- **Runtime**: Node.js
- **Framework**: Express.js
- **Ngôn ngữ**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Dev Tools**: ts-node-dev

## Cài đặt và Chạy

### 1. Clone repository và cài đặt dependencies

```bash
npm install
```

### 2. Cấu hình database

Cập nhật file `.env` với thông tin kết nối PostgreSQL:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/minitrello"
```

### 3. Khởi tạo database

```bash
# Tạo và chạy migration
npm run db:migrate

# Hoặc push schema trực tiếp (development)
npm run db:push

# Generate Prisma client
npm run db:generate
```

### 4. Chạy ứng dụng

```bash
# Development mode với auto-reload
npm run dev

# Build và chạy production
npm run build
npm start
```

Server sẽ chạy tại `http://localhost:3000`

## API Endpoints

### Health Check

```
GET /
```

Kiểm tra trạng thái API và xem danh sách endpoints có sẵn.

### Board APIs

#### Lấy tất cả boards

```
GET /boards
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "My Project",
      "tasks": [...],
      "createdAt": "2025-09-20T10:00:00.000Z",
      "updatedAt": "2025-09-20T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

#### Lấy board theo ID

```
GET /boards/:id
```

#### Tạo board mới

```
POST /boards
```

**Request Body:**
```json
{
  "name": "New Board Name"
}
```

#### Cập nhật board

```
PUT /boards/:id
```

**Request Body:**
```json
{
  "name": "Updated Board Name"
}
```

#### Xóa board

```
DELETE /boards/:id
```

Lưu ý: Xóa board sẽ xóa tất cả tasks bên trong.

### Task APIs

#### Lấy tất cả tasks trong một board

```
GET /boards/:boardId/tasks
```

#### Tạo task mới trong board

```
POST /boards/:boardId/tasks
```

**Request Body:**
```json
{
  "title": "Task Title",
  "description": "Task Description (optional)",
  "status": "Todo"
}
```

**Valid statuses:** `Todo`, `In Progress`, `Done`

#### Lấy task theo ID

```
GET /tasks/:id
```

#### Cập nhật task

```
PUT /tasks/:id
```

**Request Body:**
```json
{
  "title": "Updated Title (optional)",
  "description": "Updated Description (optional)",
  "status": "In Progress (optional)"
}
```

#### Xóa task

```
DELETE /tasks/:id
```

## Cấu trúc Database

### Board Model

```prisma
model Board {
  id        Int      @id @default(autoincrement())
  name      String
  tasks     Task[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Task Model

```prisma
model Task {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  status      String   // Todo, In Progress, Done
  board       Board    @relation(fields: [boardId], references: [id])
  boardId     Int
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Cấu trúc Project

```
src/
├── controllers/     # HTTP request handlers
├── services/        # Business logic và database operations
├── routes/          # API route definitions
├── middleware/      # Custom middleware functions
└── app.ts          # Express app configuration

prisma/
└── schema.prisma   # Database schema definition
```

## Ví dụ sử dụng với curl

### Tạo board mới

```bash
curl -X POST http://localhost:3000/boards \
  -H "Content-Type: application/json" \
  -d '{"name": "My First Board"}'
```

### Tạo task trong board

```bash
curl -X POST http://localhost:3000/boards/1/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Complete API documentation", "status": "Todo"}'
```

### Cập nhật trạng thái task

```bash
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "In Progress"}'
```

## Error Handling

API trả về response với format nhất quán:

**Success Response:**
```json
{
  "success": true,
  "data": {...},
  "message": "Operation completed successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message description"
}
```

**HTTP Status Codes:**
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `404`: Not Found
- `500`: Internal Server Error

## Development

### Available Scripts

- `npm run dev`: Chạy development server với auto-reload
- `npm run build`: Build TypeScript thành JavaScript
- `npm start`: Chạy production server
- `npm run db:migrate`: Chạy Prisma migrations
- `npm run db:generate`: Generate Prisma client
- `npm run db:push`: Push schema changes trực tiếp đến database

### Next Steps

Dự án này có thể được mở rộng với:

- **Authentication & Authorization**: Thêm user management và JWT tokens
- **Input Validation**: Sử dụng thư viện như Joi hoặc Zod
- **Testing**: Unit tests và integration tests với Jest
- **Docker**: Containerization cho deployment
- **API Documentation**: Swagger/OpenAPI documentation
- **Rate Limiting**: Bảo vệ API khỏi abuse
- **Caching**: Redis caching cho performance
- **File Upload**: Upload attachments cho tasks
- **Real-time Updates**: WebSocket support cho live updates

## License

MIT License