# 恺瑞投流管理系统

专业的斗篷流量管理平台，助力您的业务增长。

## 新增命令

`npm run start:all`：同时启动前端开发服务器和后端API服务器。

## 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发环境
```bash
# 启动前端开发服务器
npm run dev

# 在另一个终端启动后端服务器
npm run start:server
```

### 构建生产版本
```bash
npm run build
```

## 访问地址

- 前端开发服务器: http://localhost:5173
- 后端API服务器: http://localhost:3001
- 管理后台: http://localhost:3001/admin

## 默认登录信息

- 用户名: `admin`
- 密码: `admin123`

## 环境变量

创建 `.env` 文件并配置：

```env
# JWT密钥
JWT_SECRET=your-secret-key-here

# 邀请码
INVITATION_CODE=kairui2024

# API配置
API_KEY=your_api_key_here
CLOAKING_API_KEY=your_api_key_here
CLOAKING_API_BASE_URL=https://cloaking.house/api

# 服务器端口
PORT=3001
```

## 功能特性

- 🎯 流程管理 - 创建和管理斗篷流程
- 📊 统计分析 - 详细的数据分析和报告
- 🔍 点击追踪 - 实时点击数据监控
- 🛡️ 过滤系统 - 智能流量过滤
- 👥 账号管理 - 用户权限管理
- 📈 转化追踪 - Google Ads转化数据

## 技术栈

- **前端**: React + TypeScript + Tailwind CSS
- **后端**: Node.js + Express
- **数据库**: SQLite (内存数据库)
- **构建工具**: Vite