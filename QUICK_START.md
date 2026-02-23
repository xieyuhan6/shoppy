# 快速启动指南

## ⚡ 30秒快速启动

### 方法 1: 分别启动两个终端（推荐）

**终端 1 - 后端：**
```bash
cd ecommercesite
source .venv/bin/activate
python manage.py runserver 8000
```

**终端 2 - 前端：**
```bash
cd frontend
npm run dev
```

然后访问 `http://localhost:3000`

---

### 方法 2: 使用启动脚本

```bash
chmod +x start-dev.sh
./start-dev.sh
```

---

## 📝 首次设置

如果这是第一次运行，需要：

```bash
# 后端数据库迁移
cd ecommercesite
source .venv/bin/activate
python manage.py migrate

# 添加超级用户（可选，用于管理后台）
python manage.py createsuperuser
```

---

## 🌐 访问地址

- **前端应用** → http://localhost:3000
- **后端 API** → http://localhost:8000
- **API 文档** → http://localhost:8000/api/
- **管理后台** → http://localhost:8000/admin

---

## 📦 项目结构

```
.
├── ecommercesite/              # Django 后端
│   ├── .venv/                  # Python 虚拟环境
│   ├── manage.py               # Django 管理脚本
│   ├── products/               # 产品应用
│   ├── cart/                   # 购物车应用
│   ├── orders/                 # 订单应用
│   └── ecommercesite/          # Django 配置
│
├── frontend/                   # Next.js 前端
│   ├── app/                    # Next.js 应用
│   ├── components/             # React 组件
│   ├── lib/                    # 工具函数
│   ├── package.json            # NPM 依赖
│   └── .env.local              # 环境变量
│
└── README.md                   # 项目文档
```

---

## 🧪 测试功能

1. **查看产品列表**
   - 访问 http://localhost:3000/products

2. **查看产品详情**
   - 点击任何产品

3. **添加到购物车**
   - 在产品页面点击 "Add to Cart"

4. **查看购物车**
   - 点击顶部导航栏的 "Cart"

5. **结账**
   - 点击 "Proceed to Checkout"
   - 填写个人信息并提交

6. **查看订单**
   - 点击 "View All Orders"

---

## 🛠️ 开发技巧

### 查看 API 返回的数据
访问 `http://localhost:8000/api/products/` 看 JSON 格式的数据

### 修改 API 超时设置
在 `frontend/lib/api.ts` 中添加 timeout 参数

### 调试 Next.js 组件
使用浏览器开发者工具（F12）的 Console 标签

### 查看数据库内容
```bash
cd ecommercesite
source .venv/bin/activate
python manage.py shell

# 然后在 shell 中：
from products.models import Product
Product.objects.all()
```

---

## ❌ 常见问题排查

**问题：端口已被占用**
```bash
# 更改后端端口
python manage.py runserver 8001

# 更改前端端口
npm run dev -- -p 3001
```

**问题：无法连接到 API**
- 确保后端正在运行：http://localhost:8000
- 检查 `frontend/.env.local` 中的 API_URL

**问题：依赖缺失**
```bash
# 重新安装前端依赖
cd frontend
npm install

# 重新安装后端依赖
cd ecommercesite
source .venv/bin/activate
uv pip install -r requirements.txt
```

---

## 📚 下一步

1. **添加认证系统**
   - 实现用户注册和登录

2. **集成支付网关**
   - 添加 Stripe 或 PayPal

3. **添加评论和评分**
   - 用户产品评价功能

4. **实时通知**
   - 订单状态更新通知

5. **部署到云端**
   - Vercel（前端）+ Heroku/Railway（后端）

---

祝你开发愉快！🚀
