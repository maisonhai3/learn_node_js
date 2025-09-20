"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const fastify_1 = __importDefault(require("fastify"));
const client_1 = require("@prisma/client");
const boardRoutes_1 = require("./routes/boardRoutes");
const taskRoutes_1 = require("./routes/taskRoutes");
// Initialize Prisma client
exports.prisma = new client_1.PrismaClient();
// Initialize Fastify with logging
const fastify = (0, fastify_1.default)({
    logger: {
        level: 'info',
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname'
            }
        }
    }
});
const PORT = process.env.FASTIFY_PORT ? parseInt(process.env.FASTIFY_PORT) : 4000;
// Register CORS plugin
fastify.register(require('@fastify/cors'), {
    origin: true
});
// Add logging hook for requests
fastify.addHook('onRequest', async (request, reply) => {
    request.log.info({ url: request.url, method: request.method }, 'incoming request');
});
// Health check routes
fastify.get('/', async (request, reply) => {
    return reply.send({
        message: 'Mini-Trello API (Fastify Version)',
        version: '1.0.0',
        framework: 'Fastify',
        timestamp: new Date().toISOString(),
        endpoints: {
            health: '/health',
            boards: '/boards',
            tasks: '/tasks'
        }
    });
});
fastify.get('/health', async (request, reply) => {
    return reply.send({
        status: 'OK',
        message: 'Mini-Trello API (Fastify) is healthy',
        framework: 'Fastify',
        timestamp: new Date().toISOString()
    });
});
// Database test endpoint
fastify.get('/db-test', async (request, reply) => {
    try {
        await exports.prisma.$connect();
        return reply.send({
            status: 'Database connected successfully',
            framework: 'Fastify',
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        return reply.code(500).send({
            status: 'Database connection failed',
            framework: 'Fastify',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Register API routes
fastify.register(boardRoutes_1.boardRoutes, { prefix: '/boards' });
fastify.register(taskRoutes_1.taskRoutes, { prefix: '/tasks' });
fastify.register(taskRoutes_1.boardTaskRoutes, { prefix: '/boards' });
// Global error handler
fastify.setErrorHandler(async (error, request, reply) => {
    fastify.log.error(error);
    // Prisma errors
    if (error.code?.startsWith('P')) {
        return reply.code(400).send({
            success: false,
            error: 'Database operation failed',
            framework: 'Fastify'
        });
    }
    // Validation errors
    if (error.validation) {
        return reply.code(400).send({
            success: false,
            error: 'Validation failed',
            details: error.validation,
            framework: 'Fastify'
        });
    }
    // Default error
    return reply.code(500).send({
        success: false,
        error: 'Internal server error',
        framework: 'Fastify'
    });
});
// Graceful shutdown
const gracefulShutdown = async () => {
    fastify.log.info('Shutting down Fastify server...');
    try {
        await exports.prisma.$disconnect();
        fastify.log.info('Database connection closed');
        await fastify.close();
        fastify.log.info('Fastify server closed');
        process.exit(0);
    }
    catch (error) {
        fastify.log.error('Error during shutdown: ' + error.message);
        process.exit(1);
    }
};
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
// Start server
const start = async () => {
    try {
        await fastify.listen({
            port: PORT,
            host: '0.0.0.0' // Important for Docker
        });
        fastify.log.info(`🚀 Mini-Trello API (Fastify) server is running on port ${PORT}`);
        fastify.log.info(`📊 Health check: http://localhost:${PORT}/health`);
        fastify.log.info(`🗄️  Database test: http://localhost:${PORT}/db-test`);
    }
    catch (error) {
        fastify.log.error(error);
        process.exit(1);
    }
};
start();
