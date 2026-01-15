# Approval System Frontend

## 技术栈
- React 18 + TypeScript
- Vite 5
- Tailwind CSS
- shadcn/ui
- Zustand
- React Router
- React Hook Form + Zod

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 启动开发服务器
```bash
npm run dev
```

访问：http://localhost:3000

### 3. 构建生产版本
```bash
npm run build
```

## 项目结构
```
src/
├── api/              # API 接口
├── components/       # 组件
│   └── ui/          # shadcn/ui 组件
├── hooks/           # 自定义 Hooks
├── lib/             # 工具库
├── pages/           # 页面
├── router/          # 路由
├── store/           # Zustand 状态管理
├── styles/          # 样式
├── types/           # 类型定义
├── App.tsx          # 根组件
└── main.tsx         # 入口文件
```

## 下一步
1. 安装 shadcn/ui 组件
2. 创建登录页面
3. 实现路由配置
4. 对接后端 API
