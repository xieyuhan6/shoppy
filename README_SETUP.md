# XieBao E-commerce Platform

现代化的电商平台，使用 Django REST Framework 后端和 Next.js 前端。

## 项目结构

```
e-commerce-main/
├── ecommercesite/          # Django 后端
│   ├── products/           # 产品应用 (API)
│   ├── cart/              # 购物车应用 (API)
│   ├── orders/            # 订单应用 (API)
│   ├── theme/             # 主题应用
│   └── ecommercesite/      # Django 配置
└── frontend/              # Next.js 前端
    ├── app/               # 页面和布局
    ├── components/        # React 组件
    ├── lib/              # 工具函数（API 客户端）
    └── public/           # 静态文件
```

## 后端设置 (Django)

### 1. 创建并激活虚拟环境
```bash
cd ecommercesite
source .venv/bin/activate  # macOS/Linux
# 或
.venv\Scripts\activate     # Windows
```

### 2. 安装依赖
```bash
uv pip install -e .
```

### 3. 运行迁移
```bash
python manage.py migrate
```

### 4. 创建超级用户（可选）
```bash
python manage.py createsuperuser
```

### 5. 添加示例数据
```bash
python manage.py shell
```

然后在 shell 中：
```python
from products.models import Category, Product
from decimal import Decimal

# 创建分类
cat1 = Category.objects.create(name="Electronics", slug="electronics")
cat2 = Category.objects.create(name="Clothing", slug="clothing")

# 创建产品
Product.objects.create(
    name="Wireless Headphones",
    slug="wireless-headphones",
    description="High quality wireless headphones",
    price=Decimal("99.99"),
    category=cat1,
    available=True
)

Product.objects.create(
    name="T-Shirt",
    slug="t-shirt",
    description="Comfortable cotton t-shirt",
    price=Decimal("29.99"),
    category=cat2,
    available=True
)
```

### 6. 运行开发服务器
```bash
python manage.py runserver 8000
```

后端将在 `http://localhost:8000` 运行

## 前端设置 (Next.js)

### 1. 进入前端目录
```bash
cd frontend
```

### 2. 安装依赖
```bash
npm install
```

### 3. 运行开发服务器
```bash
npm run dev
```

前端将在 `http://localhost:3000` 运行

## API 端点

所有 API 端点都以 `/api/` 开头：

### 产品
- `GET /api/products/` - 获取所有产品（支持分页和过滤）
- `GET /api/products/{id}/` - 获取单个产品
- `GET /api/categories/` - 获取所有分类
- `GET /api/categories/{slug}/` - 获取单个分类

### 购物车
- `GET /api/cart/me/` - 获取当前购物车
- `POST /api/cart/add_item/` - 添加商品到购物车
- `POST /api/cart/remove_item/` - 从购物车移除商品
- `POST /api/cart/update_item/` - 更新购物车商品数量
- `POST /api/cart/clear/` - 清空购物车

### 订单
- `GET /api/orders/` - 获取所有订单
- `GET /api/orders/{id}/` - 获取单个订单
- `POST /api/orders/create_from_cart/` - 从购物车创建订单

## 功能特性

### 前端 (Next.js)
- 📱 响应式设计（使用 Tailwind CSS）
- 🛍️ 产品浏览和搜索
- 🛒 购物车管理
- 📋 订单处理
- 💫 现代化 UI/UX

### 后端 (Django)
- 🔐 REST API（使用 DRF）
- 🛡️ CORS 支持
- 📦 完整的电商模型（产品、分类、购物车、订单）
- 📄 自动 API 文档

## 开发工具

### 后端
- Django 5.2
- Django REST Framework 3.16
- django-cors-headers
- Pillow（图片处理）

### 前端
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- ESLint

## 部署

### 后端部署 (Heroku/Railway)
```bash
# 创建 requirements.txt
pip freeze > requirements.txt

# 部署到 Heroku
heroku create your-app-name
git push heroku main
heroku run python manage.py migrate
```

### 前端部署 (Vercel)
```bash
cd frontend
npm install -g vercel
vercel
```

## 环境变量

### 后端 (.env)
```
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
```

### 前端 (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 贡献

欢迎提交 Pull Request 和 Issue！

## 许可证

MIT License
