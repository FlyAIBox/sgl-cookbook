# vercel.json 配置文件详解

本文档为前端初学者详细解释 `vercel.json` 配置文件的各个配置项。

---

## 📋 文件概述

`vercel.json` 是 **Vercel** 平台的配置文件，用于控制网站在 Vercel 上的部署行为。

### 什么是 Vercel？
Vercel 是一个流行的**静态网站和前端应用托管平台**，特点：
- ✅ 自动化部署（连接 GitHub 后自动部署）
- ✅ 全球 CDN 加速
- ✅ HTTPS 自动配置
- ✅ 无服务器函数支持
- ✅ 免费套餐适合个人和小型项目

---

## 🔧 配置项详解

### 完整配置

```json
{
  "cleanUrls": true,
  "trailingSlash": false,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

### 1. cleanUrls - 干净的 URL

```json
"cleanUrls": true
```

#### 作用
移除 URL 中的 `.html` 后缀，使 URL 看起来更简洁。

#### 效果对比

| cleanUrls 值 | 访问 URL | 实际文件 | 结果 |
|------------|----------|---------|------|
| `true` | `/about` | `about.html` | ✅ 正常访问 |
| `true` | `/about.html` | `about.html` | 🔄 重定向到 `/about` |
| `false` | `/about` | `about.html` | ❌ 404 错误 |
| `false` | `/about.html` | `about.html` | ✅ 正常访问 |

#### 为什么要启用？
- ✨ **更美观**：`https://example.com/docs` 比 `https://example.com/docs.html` 更简洁
- 🔍 **SEO 友好**：更符合现代 Web 标准，搜索引擎更喜欢
- 👥 **用户体验**：URL 更容易记忆和分享

#### 示例
```
启用前: https://cookbook.sglang.io/intro.html
启用后: https://cookbook.sglang.io/intro
```

---

### 2. trailingSlash - 尾部斜杠控制

```json
"trailingSlash": false
```

#### 作用
控制 URL 末尾是否需要斜杠（`/`）。

#### 效果对比

| trailingSlash 值 | 访问 URL | 结果 |
|----------------|----------|------|
| `false` | `/about` | ✅ 正常访问 |
| `false` | `/about/` | 🔄 重定向到 `/about` |
| `true` | `/about` | 🔄 重定向到 `/about/` |
| `true` | `/about/` | ✅ 正常访问 |

#### 为什么要统一？
- 🔍 **避免 SEO 问题**：搜索引擎会将 `/about` 和 `/about/` 视为两个不同的页面，可能导致重复内容惩罚
- 📊 **统计准确性**：确保网站分析工具正确统计访问量
- 🔗 **链接一致性**：避免内部链接和外部链接不匹配

#### 推荐设置
- **文档网站**：通常设置为 `false`
- **目录式网站**：可以设置为 `true`

#### 示例
```
设置 false: https://cookbook.sglang.io/intro
设置 true:  https://cookbook.sglang.io/intro/
```

---

### 3. rewrites - URL 重写规则

```json
"rewrites": [
  {
    "source": "/(.*)",
    "destination": "/index.html"
  }
]
```

#### 作用
设置 URL 路由规则。这对于**单页应用（SPA）**至关重要。

#### 配置详解

##### `source` - 匹配模式
```json
"source": "/(.*)"
```

- **格式**：正则表达式
- **含义**：
  - `/` - URL 根路径
  - `(.*)` - 捕获分组
    - `.` - 匹配任意字符
    - `*` - 匹配 0 个或多个
    - `()` - 捕获为变量
- **结果**：匹配**所有路径**

**匹配示例**：
```
✅ /
✅ /docs
✅ /docs/intro
✅ /autoregressive/Qwen/Qwen3
✅ /any/path/you/can/imagine
```

##### `destination` - 目标文件
```json
"destination": "/index.html"
```

- **含义**：所有匹配的请求都返回 `index.html` 文件
- **关键**：让前端路由接管页面渲染

---

### 为什么需要 rewrites？（重要概念）

#### 问题场景

假设你有一个 Docusaurus 网站，用户访问 `https://cookbook.sglang.io/docs/intro`：

**没有 rewrites 的情况：**
```
1. 浏览器请求: /docs/intro
2. Vercel 服务器: 查找文件 docs/intro.html
3. 结果: ❌ 404 Not Found（服务器上只有 index.html）
```

**有 rewrites 的情况：**
```
1. 浏览器请求: /docs/intro
2. Vercel 服务器: 匹配到 rewrite 规则
3. 服务器返回: index.html（状态码 200）
4. 浏览器加载 JavaScript
5. 前端路由接管: 显示 /docs/intro 对应的内容
6. 结果: ✅ 正常显示页面
```

#### 工作流程图

```
用户访问任何路径
       ↓
Vercel 服务器接收请求
       ↓
匹配 rewrite 规则
       ↓
返回 index.html
       ↓
浏览器执行 JavaScript
       ↓
React Router / Docusaurus 路由接管
       ↓
显示对应页面内容
```

#### 适用场景

这个配置适用于：
- ✅ **单页应用（SPA）**：React、Vue、Angular 应用
- ✅ **Docusaurus**：文档网站
- ✅ **Next.js（静态导出）**：静态网站
- ✅ **客户端路由**：使用 React Router、Vue Router 等

不适用于：
- ❌ **多页应用（MPA）**：传统的每个页面对应一个 HTML 文件
- ❌ **静态文件站点**：纯HTML文件，无客户端路由

---

## 🎯 完整示例解析

### 示例：用户访问流程

假设用户访问 `https://cookbook.sglang.io/autoregressive/DeepSeek/DeepSeek-V3`

```
步骤 1: 用户在浏览器输入 URL
  https://cookbook.sglang.io/autoregressive/DeepSeek/DeepSeek-V3

步骤 2: DNS 解析，请求到达 Vercel 服务器

步骤 3: Vercel 应用配置规则
  - cleanUrls: true → URL 没有 .html 后缀，保持不变
  - trailingSlash: false → URL 没有尾部斜杠，保持不变
  - rewrites: 匹配 /(.*) → 返回 index.html

步骤 4: 服务器返回 index.html（状态码 200，非 404）

步骤 5: 浏览器加载 index.html 中的 JavaScript

步骤 6: Docusaurus 路由系统接管
  - 读取当前 URL: /autoregressive/DeepSeek/DeepSeek-V3
  - 匹配路由: 找到对应的文档页面
  - 渲染内容: 显示 DeepSeek-V3 的文档

步骤 7: 用户看到正确的页面内容 ✅
```

---

## 🔍 常见问题

### Q1: 为什么不直接使用文件系统路由？

**传统多页应用：**
```
网站结构:
/
├── index.html
├── about.html
└── docs/
    └── intro.html

URL 对应:
/ → index.html
/about → about.html
/docs/intro → docs/intro.html
```

**现代单页应用（SPA）：**
```
网站结构:
/
└── index.html（只有一个 HTML 文件）

构建产物:
/
├── index.html
├── main.js（包含所有路由逻辑）
└── assets/

URL 对应（通过 JavaScript 路由）:
/ → index.html（JavaScript 渲染首页）
/about → index.html（JavaScript 渲染关于页）
/docs/intro → index.html（JavaScript 渲染文档页）
```

SPA 的优势：
- ⚡ 页面切换更快（无需重新加载整个页面）
- 🎨 更流畅的用户体验（过渡动画）
- 📦 代码复用（组件化）

### Q2: 如果不配置 rewrites 会怎样？

访问首页 `/` 正常，但访问其他页面会出现：

```
❌ 404 - Not Found
This page could not be found.
```

因为服务器找不到对应的 HTML 文件。

### Q3: cleanUrls 和 rewrites 有什么区别？

| 配置 | 作用域 | 目的 |
|------|--------|------|
| `cleanUrls` | 静态 HTML 文件 | 移除 `.html` 后缀 |
| `rewrites` | 所有路径 | SPA 路由支持 |

通常**两者同时使用**以获得最佳效果。

### Q4: 可以有多个 rewrite 规则吗？

可以！数组中可以定义多个规则：

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://api.example.com/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**规则匹配顺序**：从上到下，第一个匹配的规则生效。

### Q5: 这个配置会影响性能吗？

**不会**。这些配置在 Vercel 的边缘网络（Edge Network）上执行，性能影响可以忽略不计。

---

## 📚 相关资源

- [Vercel 官方文档 - vercel.json](https://vercel.com/docs/projects/project-configuration)
- [Vercel 文档 - Rewrites](https://vercel.com/docs/edge-network/rewrites)
- [单页应用（SPA）概念](https://developer.mozilla.org/zh-CN/docs/Glossary/SPA)
- [Docusaurus 部署到 Vercel](https://docusaurus.io/docs/deployment#deploying-to-vercel)

---

## 💡 最佳实践

### 推荐配置（Docusaurus/SPA）

```json
{
  "cleanUrls": true,
  "trailingSlash": false,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### API 代理配置（进阶）

如果需要代理 API 请求：

```json
{
  "cleanUrls": true,
  "trailingSlash": false,
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://backend.example.com/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 静态文件排除（特殊需求）

```json
{
  "cleanUrls": true,
  "trailingSlash": false,
  "rewrites": [
    {
      "source": "/static/:path*",
      "destination": "/static/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
