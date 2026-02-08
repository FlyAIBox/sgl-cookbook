# docusaurus.config.js 配置文件详解

本文档为前端初学者详细解释 `docusaurus.config.js` 配置文件的各个部分。

---

## 📋 文件概述

`docusaurus.config.js` 是 Docusaurus 项目的核心配置文件，控制着网站的外观、行为和功能。这个文件使用 JavaScript 编写（支持注释），在构建时由 Node.js 执行。

### Docusaurus 是什么？

Docusaurus 是 Facebook（Meta）开源的静态网站生成器，专为技术文档设计：
- ⚡ 基于 React 构建
- 📝 支持 Markdown 和 MDX  
- 🎨 可自定义主题
- 🔍 内置搜索功能
- 🌐 国际化支持
- 📱 移动端响应式

---

## 🎯 文件结构概览

```javascript
// 1. TypeScript 类型检查配置
// 2. 依赖导入
// 3. 基本信息配置
//    - title, tagline, favicon
//    - url, baseUrl
// 4. GitHub Pages 配置
// 5. 国际化配置
// 6. 预设 (Presets)
// 7. 插件 (Plugins)
// 8. HTML Head 标签
// 9. 主题配置 (themeConfig)
// 10. 导出配置
```

---

## 详细配置说明

### 1. TypeScript 类型检查

```javascript
// @ts-check
/** @type {import('@docusaurus/types').Config} */
const config = {
  // ...
};
```

####作用
- `@ts-check`：启用 TypeScript 编译器对 JavaScript 文件的类型检查
- `@type`：为 config 对象提供类型定义

#### 好处
- ✅ 编辑器智能提示
- ✅ 配置错误提前发现
- ✅ 无需将文件改为 .ts

---

### 2. 依赖导入

```javascript
import { themes as prismThemes } from 'prism-react-renderer';
import path from 'path';
import { fileURLToPath } from 'url';
```

| 导入 | 用途 |
|------|------|
| `prismThemes` | 代码块语法高亮主题 |
| `path` | 处理文件路径（Webpack 别名） |
| `fileURLToPath` | ES 模块 URL 转换 |

---

### 3. 网站基本信息

```javascript
{
  title: 'SGLang Cookbook',
  tagline: '网站描述文字',
  favicon: 'img/favicon.png',
  url: 'https://cookbook.sglang.io',
  baseUrl: '/',
}
```

#### 各字段详解

##### `title` - 网站标题
- **显示位置**：
  - 浏览器标签页
  - 导航栏左侧
  - 搜索引擎结果
- **SEO 重要性**：⭐⭐⭐⭐⭐

##### `tagline` - 网站标语
- **显示位置**：首页标题下方
- **建议长度**：一句话，简洁明了
- **示例**：
  ```
  ✅ "快速构建优质技术文档"
  ❌ "这是一个非常好用的文档网站，它可以帮你做很多事情..."（太长）
  ```

##### `favicon` - 网站图标
- **格式**：`.png`, `.ico`, `.svg`
- **推荐尺寸**：32x32 或 16x16 像素
- **路径**：相对于 `static/` 目录
  ```
  static/
  └── img/
      └── favicon.png  → 'img/favicon.png'
  ```

##### `url` - 生产 URL
- **格式**：完整的域名，不含路径
- **正确示例**：
  ```javascript
  ✅ url: 'https://example.com'
  ✅ url: 'https://docs.example.com'
  ❌ url: 'https://example.com/docs'  // 不要包含路径
  ```
- **用途**：
  - Sitemap 生成
  - 社交媒体分享卡片
  - RSS 订阅

##### `baseUrl` - 基础路径
- **默认值**：`'/'`（根路径）
- **使用场景**：

| 场景 | baseUrl | 完整URL |
|------|---------|---------|
| 独立域名 | `/` | `https://docs.example.com/intro` |
| 子路径 | `/docs/` | `https://example.com/docs/intro` |
| GitHub Pages | `/项目名/` | `https://username.github.io/项目名/intro` |

- **环境变量覆盖**：
  ```javascript
  baseUrl: process.env.BASE_URL || '/',
  ```

---

### 4. GitHub Pages 配置

```javascript
{
  organizationName: 'sgl-project',
  projectName: 'sgl-cookbook',
}
```

#### 用途
1. **生成部署 URL**
   ```
   https://<organizationName>.github.io/<projectName>/
   ```

2. **生成编辑链接**
   ```
   https://github.com/<organizationName>/<projectName>/edit/main/...
   ```

#### 是否必需？
- 使用 GitHub Pages 部署：✅ 必需
- 使用 Vercel/Netlify：❌ 可选（但推荐保留，用于编辑链接）

---

### 5. 构建行为配置

```javascript
{
  onBrokenLinks: 'throw',
  trailingSlash: false,
  noIndex: false,
}
```

#### `onBrokenLinks` - 损坏链接处理

| 值 | 行为 | 推荐场景 |
|----|------|----------|
| `'throw'` | ❌ 构建失败 | ✅ 生产环境（确保链接质量） |
| `'warn'` | ⚠️ 显示警告 | 🟡 开发阶段 |
| `'ignore'` | ✓ 继续构建 | ❌ 不推荐 |

#### `trailingSlash` - URL 斜杠控制

```javascript
// false
https://example.com/docs/intro  ✅
https://example.com/docs/intro/ → 重定向到上面

// true
https://example.com/docs/intro  → 重定向到下面
https://example.com/docs/intro/ ✅
```

**SEO 影响**：
- ❌ 不统一：搜索引擎可能视为两个不同页面
- ✅ 统一：避免重复内容惩罚

**推荐设置**：
- 文档网站：`false`
- 目录式网站：`true`

#### `noIndex` - 搜索引擎索引

| 值 | 含义 | 使用场景 |
|----|------|----------|
| `false` | 允许索引 | ✅ 生产环境 |
| `true` | 禁止索引 | 🔧 开发/测试环境 |

---

### 6. 国际化配置 (i18n)

```javascript
{
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
}
```

#### 单语言网站（当前配置）

```javascript
i18n: {
  defaultLocale: 'en',  // 默认语言
  locales: ['en'],      // 只support英语
},
```

#### 多语言网站示例

```javascript
i18n: {
  defaultLocale: 'zh-Hans',  // 默认简体中文
  locales: ['zh-Hans', 'en', 'ja'],  // 中英日三语
},
```

#### 语言代码参考

| 语言 | 代码 |
|------|------|
| 英语 | `en` |
| 简体中文 | `zh-Hans` |
| 繁体中文 | `zh-Hant` |
| 日语 | `ja` |
| 韩语 | `ko` |
| 法语 | `fr` |
| 德语 | `de` |
| 西班牙语 | `es` |

#### 文件结构（多语言）

```
docs/
├── intro.md          # 默认语言（en）
i18n/
├── zh-Hans/
│   └── docusaurus-plugin-content-docs/
│       └── current/
│           └── intro.md  # 中文翻译
└── ja/
    └── docusaurus-plugin-content-docs/
        └── current/
            └── intro.md  # 日文翻译
```

---

### 7. 预设配置 (Presets)

```javascript
presets: [
  [
    'classic',
    {
      docs: { /* ... */ },
      theme: { /* ... */ },
      sitemap: { /* ... */ },
    },
  ],
],
```

#### 什么是预设？

预设是**一组预配置的插件和主题的集合**，相当于"套餐"。

#### Classic 预设包含

- ✅ 文档功能 (`@docusaurus/plugin-content-docs`)
- ✅ 博客功能 (`@docusaurus/plugin-content-blog`)
- ✅ 页面功能 (`@docusaurus/plugin-content-pages`)
- ✅ 默认主题 (`@docusaurus/theme-classic`)
- ✅ Sitemap 生成

#### Docs 配置

```javascript
docs: {
  routeBasePath: '/',
  sidebarPath: './sidebars.js',
  editUrl: 'https://github.com/sgl-project/sgl-cookbook/tree/main',
},
```

##### `routeBasePath`

| 值 | URL 示例 | 使用场景 |
|----|----------|----------|
| `/` | `/intro` | 纯文档站点 |
| `/docs/` | `/docs/intro` | 文档+博客混合站点 |

##### `sidebarPath`

侧边栏配置文件路径，通常是 `./sidebars.js`：

```javascript
// sidebars.js
module.exports = {
  tutorialSidebar: ['intro', 'tutorial-basics', ...],
};
```

##### `editUrl`

GitHub 编辑链接模板：

```
{editUrl}/{docPath}
↓
https://github.com/sgl-project/sgl-cookbook/tree/main/docs/intro.md
```

**效果**：页面底部显示"编辑此页"链接。

#### Theme 配置

```javascript
theme: {
  customCss: './src/css/custom.css',
},
```

自定义 CSS 示例（`src/css/custom.css`）：

```css
/* 主题色自定义 */
:root {
  --ifm-color-primary: #2e8555;
  --ifm-code-font-size: 95%;
}

/* 深色模式 */
[data-theme='dark'] {
  --ifm-color-primary: #25c2a0;
}
```

#### Sitemap 配置

```javascript
sitemap: {
  changefreq: 'weekly',
  priority: 0.5,
  filename: 'sitemap.xml',
},
```

##### `changefreq` - 更新频率

| 值 | 含义 | 适用内容 |
|----|------|----------|
| `always` | 每次访问都可能变化 | 动态内容 |
| `hourly` | 每小时 | 新闻网站 |
| `daily` | 每天 | 博客 |
| `weekly` | 每周 | ✅ 文档（推荐） |
| `monthly` | 每月 | 归档内容 |
| `yearly` | 每年 | 静态页面 |
| `never` | 从不变化 | 历史文档 |

##### `priority` - 优先级

```
0.0 - 1.0 范围
0.5 = 中等优先级
```

**示例分配**：
```
首页: 1.0
重要文档: 0.8
普通文档: 0.5
归档内容: 0.3
```

---

### 8. 插件配置 (Plugins)

```javascript
plugins: [
  function (context, options) {
    return {
      name: 'webpack-alias-plugin',
      configureWebpack(config, isServer, utils) {
        return {
          resolve: {
            alias: {
              '@diffusion': path.resolve(__dirname, 'docs', 'diffusion'),
              '@specbundle': path.resolve(__dirname, 'docs', 'specbundle'),
              '@optimal-configs': path.resolve(__dirname, 'data', 'optimal-configs', 'generated'),
            },
          },
        };
      },
    };
  },
],
```

#### 什么是 Webpack 别名？

简化 import 路径的工具。

**没有别名：**
```javascript
import Foo from '../../../docs/diffusion/something';
import Bar from '../../../../docs/specbundle/other';
```

**有别名：**
```javascript
import Foo from '@diffusion/something';
import Bar from '@specbundle/other';
```

#### 如何定义别名？

```javascript
alias: {
  '@别名': path.resolve(__dirname, '实际路径'),
}
```

#### 常用别名示例

```javascript
alias: {
  '@site': path.resolve(__dirname),
  '@docs': path.resolve(__dirname, 'docs'),
  '@components': path.resolve(__dirname, 'src/components'),
  '@utils': path.resolve(__dirname, 'src/utils'),
}
```

---

### 9. HTML Head 标签 (headTags)

```javascript
headTags: [
  {
    tagName: 'meta',
    attributes: {
      name: 'robots',
      content: 'index, follow',
    },
  },
  // ... 更多标签
],
```

#### 作用

在所有页面的 `<head>` 部分插入自定义 HTML 标签。

#### 常见用途

##### SEO Meta 标签

```javascript
{
  tagName: 'meta',
  attributes: {
    name: 'description',
    content: '网站描述',
  },
},
{
  tagName: 'meta',
  attributes: {
    name: 'keywords',
    content: 'keyword1, keyword2, keyword3',
  },
},
```

##### 网站验证

```javascript
// Google Search Console 验证
{
  tagName: 'meta',
  attributes: {
    name: 'google-site-verification',
    content: '验证码',
  },
},
```

##### Open Graph（社交媒体分享）

```javascript
{
  tagName: 'meta',
  attributes: {
    property: 'og:title',
    content: 'SGLang Cookbook',
  },
},
{
  tagName: 'meta',
  attributes: {
    property: 'og:image',
    content: 'https://cookbook.sglang.io/img/logo.png',
  },
},
```

**效果**：在 Facebook、Twitter、LinkedIn 分享时显示漂亮的卡片。

##### Twitter Card

```javascript
{
  tagName: 'meta',
  attributes: {
    name: 'twitter:card',
    content: 'summary_large_image',
  },
},
```

##### 结构化数据（JSON-LD）

```javascript
{
  tagName: 'script',
  attributes: {
    type: 'application/ld+json',
  },
  innerHTML: JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SGLang Cookbook',
    url: 'https://cookbook.sglang.io',
  }),
},
```

**作用**：帮助搜索引擎更好地理解网站内容，可能获得富媒体搜索结果。

---

### 10. 主题配置 (themeConfig)

```javascript
themeConfig: {
  metadata: [ /* ... */ ],
  navbar: { /* ... */ },
  footer: { /* ... */ },
  prism: { /* ... */ },
  algolia: { /* ... */ },
},
```

#### Metadata - 页面元数据

```javascript
metadata: [
  {name: 'description', content: '网站描述'},
  {name: 'keywords', content: '关键词1, 关键词2'},
],
```

#### Navbar - 导航栏

```javascript
navbar: {
  title: 'SGLang Cookbook',
  logo: {
    alt: 'Logo',
    src: 'img/logo.png',
  },
  items: [
    {
      href: 'https://github.com/sgl-project/sgl-cookbook',
      label: 'GitHub',
      position: 'right',
    },
  ],
},
```

**导航栏项目类型**：

```javascript
// 1. 链接到文档
{
  type: 'doc',
  docId: 'intro',
  label: '教程',
  position: 'left',
}

// 2. 下拉菜单
{
  label: '社区',
  position: 'left',
  items: [
    {label: 'Discord', href: 'https://discord.gg/...'},
    {label: 'Twitter', href: 'https://twitter.com/...'},
  ],
}

// 3. 外部链接
{
  href: 'https://example.com',
  label: '外部链接',
  position: 'right',
}
```

#### Footer - 页脚

```javascript
footer: {
  style: 'dark',
  copyright: `Copyright © ${new Date().getFullYear()} SGLang Team.`,
},
```

**完整示例**：

```javascript
footer: {
  style: 'dark',
  links: [
    {
      title: '文档',
      items: [
        {label: '快速开始', to: '/docs/intro'},
        {label: 'API 参考', to: '/docs/api'},
      ],
    },
    {
      title: '社区',
      items: [
        {label: 'Discord', href: 'https://discord.gg/...'},
        {label: 'GitHub', href: 'https://github.com/...'},
      ],
    },
  ],
  copyright: `© ${new Date().getFullYear()} 你的组织`,
},
```

#### Prism - 代码高亮

```javascript
prism: {
  theme: prismThemes.github,      // 浅色主题
  darkTheme: prismThemes.dracula, // 深色主题
},
```

**支持的主题**：
- `github` - GitHub 风格
- `dracula` - Dracula 紫色主题
- `vsDark` - VS Code 深色
- `duotoneDark` / `duotoneLight`
- `nightOwl` / `nightOwlLight`

**添加额外语言支持**：

```javascript
prism: {
  theme: prismThemes.github,
  darkTheme: prismThemes.dracula,
  additionalLanguages: ['bash', 'diff', 'json', 'yaml'],
},
```

#### Algolia - 搜索功能

```javascript
algolia: {
  appId: '你的 APP_ID',
  apiKey: '你的 API_KEY',
  indexName: '你的索引名',
},
```

**如何获取**：
1. 访问 [DocSearch](https://docsearch.algolia.com/)
2. 申请免费的 Algolia DocSearch
3. 获得配置信息后填入

**效果**：网站右上角出现搜索框，支持全站搜索。

---

## 🔄 完整配置示例（简化版）

```javascript
// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '我的网站',
  tagline: '一个很棒的文档网站',
  favicon: 'img/favicon.ico',
  
  url: 'https://example.com',
  baseUrl: '/',
  
  organizationName: 'myorg',
  projectName: 'myproject',
  
  onBrokenLinks: 'throw',
  trailingSlash: false,
  
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans', 'en'],
  },
  
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/myorg/myproject/tree/main',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      },
    ],
  ],
  
  themeConfig: {
    navbar: {
      title: '我的网站',
      logo: {
        alt: 'Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'intro',
          position: 'left',
          label: '教程',
        },
        {
          href: 'https://github.com/myorg/myproject',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `© ${new Date().getFullYear()} 我的组织`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },
};

export default config;
```

---

## 📚 常见问题

###Q1: 修改配置后需要重启服务吗？

**是的**。`docusaurus.config.js` 的修改需要重启开发服务器：

```bash
# 停止服务器（Ctrl + C）
# 重新启动
npm start
```

### Q2: 如何添加自定义页面？

在 `src/pages/` 目录创建 React 组件或 Markdown 文件：

```
src/pages/
├── index.js          # 首页
├── about.md          # 关于页面 (/about)
└── contact.js        # 联系页面 (/contact)
```

### Q3: 如何修改首页？

编辑 `src/pages/index.js`（React 组件）或 `src/pages/index.md`（Markdown）。

### Q4: 如何添加 Google Analytics？

使用官方插件：

```bash
npm install --save @docusaurus/plugin-google-gtag
```

```javascript
// docusaurus.config.js
{
  plugins: [
    [
      '@docusaurus/plugin-google-gtag',
      {
        trackingID: 'G-XXXXXXXXXX',
      },
    ],
  ],
}
```

### Q5: 如何部署到 Vercel？

1. 推送代码到 GitHub
2. 在 Vercel 导入项目
3. Vercel 自动检测 Docusaurus
4. 点击部署！

无需额外配置。

---

## 🔗 相关资源

- [Docusaurus 官方文档](https://docusaurus.io/)
- [配置 API 参考](https://docusaurus.io/docs/api/docusaurus-config)
- [主题配置参考](https://docusaurus.io/docs/api/themes/configuration)
- [插件列表](https://docusaurus.io/docs/api/plugins)
- [Docusaurus 社区](https://discord.gg/docusaurus)
