import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// ES modules compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

console.log('🚀 启动恺瑞投流管理系统...');

// Set JWT secret if not provided
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'your-secret-key-here-change-in-production';
}

// Check API key configuration
if (!process.env.API_KEY && !process.env.CLOAKING_API_KEY) {
  console.warn('⚠️  WARNING: API_KEY or CLOAKING_API_KEY not found in environment variables');
}

const startServer = async () => {
  try {
    // Import routes
    const authRoutes = await import('./routes/auth.js');
    const adminRoutes = await import('./routes/admin.js');
    const apiRoutes = await import('./routes/api.js');
    const conversionsRoutes = await import('./routes/conversions.js');
    const apiLogsRoutes = await import('./routes/apiLogs.js');
    const landingPagesRoutes = await import('./routes/landingPages.js');
    const landingPagesRoutes = await import('./routes/landingPages.js');
    const { logApiRequest } = await import('./middleware/requestLogger.js');
    const { initializeDatabase, closeConnection } = await import('./config/database.js');

    const app = express();
    const PORT = process.env.PORT || 3001;

    // Initialize database
    try {
      await initializeDatabase();
      console.log('✅ Database initialized successfully');
    } catch (dbError) {
      console.error('❌ 数据库初始化失败:', dbError.message);
      console.error('请确保MySQL/MariaDB服务器正在运行，并且.env文件中的数据库配置正确');
      process.exit(1);
    }

    // Middleware
    app.use(cors());
    app.use(express.json());
    app.use(express.static(path.join(__dirname, 'dist')));

    // Apply request logging middleware to ALL routes
    app.use(logApiRequest);

    // Routes - 落地页路由放在最前面
    app.use('/api', landingPagesRoutes.default);
    app.use('/api/auth', authRoutes.default);
    app.use('/api/admin', adminRoutes.default);
    app.use('/api', apiRoutes.default);
    app.use('/api', conversionsRoutes.default);
    app.use('/api', apiLogsRoutes.default);

    // Catch-all route handler
    app.get('*', (req, res) => {
      // If it's an API request that wasn't handled by previous routes, return 404
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
      }
      
      // For all other routes, serve the React SPA
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log('📋 Available API endpoints:');
      console.log('  - POST /api/landing-pages (创建落地页)');
      console.log('  - GET /api/landing-pages (获取落地页列表)');
      console.log('  - GET /api/landing-pages/:id (获取落地页详情)');
      console.log('  - PUT /api/landing-pages/:id (更新落地页)');
      console.log('  - DELETE /api/landing-pages/:id (删除落地页)');
      console.log('  - GET /api/landing-pages/download/:id/:type (下载文件)');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n🔄 正在关闭服务器...');
      try {
        await closeConnection();
        console.log('✅ 服务器已安全关闭');
        process.exit(0);
      } catch (error) {
        console.error('❌ 关闭服务器时出错:', error);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    console.error('Error details:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
};

// Start the server
startServer();