# 配置文件说明文档总览

本目录包含 sgl-cookbook 项目各类配置文件的详细中文说明，面向前端初学者。

---

## 📚 文档列表

### 1. [package.json 配置说明](./配置文件说明-package.json.md)

**文件位置**：项目根目录 `/package.json`

**主要内容**：
- 项目基本信息（name, version, private）
- NPM 脚本命令详解
- 依赖包说明（dependencies vs devDependencies）
- 浏览器兼容性配置（browserslist）
- Node.js 版本要求

**适合阅读对象**：
- 刚接触 Node.js 项目的开发者
- 需要了解项目依赖的团队成员
- 想学习 npm scripts 的初学者

---

### 2. [vercel.json 配置说明](./配置文件说明-vercel.json.md)

**文件位置**：项目根目录 `/vercel.json`

**主要内容**：
- Vercel 平台简介
- cleanUrls 配置（URL 美化）
- trailingSlash 配置（SEO 优化）
- rewrites 规则（SPA 路由支持）
- 单页应用部署原理

**适合阅读对象**：
- 需要部署网站到 Vercel 的开发者
- 想了解 SPA 路由工作机制的学习者
- 关注 SEO 优化的网站维护者

---

### 3. [docusaurus.config.js 配置说明](./配置文件说明-docusaurus.config.js.md)

**文件位置**：项目根目录 `/docusaurus.config.js`

**主要内容**：
- Docusaurus 完整配置详解
- 网站基本信息设置
- 国际化（i18n）配置
- 预设（presets）和插件（plugins）
- SEO 和社交媒体优化（headTags）
- 主题配置（navbar, footer, prism, algolia）

**适合阅读对象**：
- Docusaurus 项目开发者
- 技术文档网站维护者
- 需要深度自定义网站的用户

---

### 4. sidebars.js（已添加中文注释）

**文件位置**：项目根目录 `/sidebars.js`

**主要内容**：
- 侧边栏结构定义
- 分类（category）配置
- 文档引用方式
- 嵌套菜单示例
- 自定义标签

**特点**：JavaScript 文件，支持注释，已在源文件中添加详细中文注释

---

### 5. .pre-commit-config.yaml（已添加中文注释）

**文件位置**：项目根目录 `/.pre-commit-config.yaml`

**主要内容**：
- Pre-commit 框架介绍
- Git hooks 工作原理
- 代码质量检查钩子
- 自定义脚本钩子
- YAML 和 TypeScript 验证

**特点**：YAML 文件，支持注释，已在源文件中添加详细中文注释

---

## 🎯 快速导航

### 按使用场景查找

#### 刚开始学习这个项目
1. 先读 [package.json 说明](./配置文件说明-package.json.md) 了解项目依赖
2. 再读 [docusaurus.config.js 说明](./配置文件说明-docusaurus.config.js.md) 了解网站配置
3. 查看 `sidebars.js` 源文件了解文档结构

#### 需要部署网站
1. 阅读 [vercel.json 说明](./配置文件说明-vercel.json.md)
2. 参考 [docusaurus.config.js 说明](./配置文件说明-docusaurus.config.js.md) 中的部署相关章节

#### 需要修改网站样式
1. 查看 [docusaurus.config.js 说明](./配置文件说明-docusaurus.config.js.md) 的主题配置部分
2. 修改 `src/css/custom.css` （在 docusaurus.config.js 中引用）

#### 需要添加新文档
1. 在 `docs/` 目录创建 Markdown 文件
2. 在 `sidebars.js` 中添加引用（见文件中的详细注释）

---

## 📖 配置文件之间的关系

```
project/
│
├── package.json              # 项目元数据和依赖管理
│   └── 定义了所有 npm 脚本和依赖包
│
├── docusaurus.config.js      # Docusaurus 核心配置
│   ├── 引用 sidebars.js
│   ├── 引用 src/css/custom.css
│   └── 配置构建和主题
│
├── sidebars.js               # 文档导航结构
│   └── 定义文档之间的组织关系
│
├── vercel.json               # Vercel 部署配置
│   └── 配置 URL 行为和路由规则
│
└── .pre-commit-config.yaml   # Git 提交前检查
    └── 确保代码质量
```

---

## ⚠️ 重要提示

### JSON 文件不支持注释

`package.json` 和 `vercel.json` 使用 JSON 格式，**不支持注释**。因此：

- ✅ 阅读独立的 `.md` 说明文档
- ❌ 不要在 JSON 文件中添加注释（会导致解析错误）

### JavaScript 文件支持注释

`docusaurus.config.js` 和 `sidebars.js` 使用 JavaScript 格式，**支持注释**：

- ✅ 可以直接在文件中查看中文注释
- ✅ 也可以参考独立的说明文档获取更详细解释

### YAML 文件支持注释

`.pre-commit-config.yaml` 使用 YAML 格式，**支持注释**：

- ✅ 已在文件中添加详细中文注释
- ✅ 可以直接阅读源文件

---

## 🛠️ 修改配置后的操作

### 修改 package.json
```bash
# 安装新增的依赖
npm install

# 无需重启开发服务器（除非修改了 scripts）
```

### 修改 docusaurus.config.js 或 sidebars.js
```bash
# 必须重启开发服务器
# 1. 停止服务器（Ctrl + C）
# 2. 重新启动
npm start
```

### 修改 vercel.json
```bash
# 本地无影响，推送到 Git 后 Vercel 自动重新部署
git add vercel.json
git commit -m "Update vercel config"
git push
```

### 修改 .pre-commit-config.yaml
```bash
# 重新安装 pre-commit hooks
pre-commit install --overwrite
```

---

## 📝 学习建议

### 初学者路径

1. **第一周**：熟悉 package.json
   - 了解依赖包的作用
   - 学会使用 npm scripts

2. **第二周**：掌握 sidebars.js
   - 理解侧边栏结构
   - 能够添加新文档

3. **第三周**：探索 docusaurus.config.js
   - 修改网站标题和图标
   - 自定义导航栏和页脚

4. **第四周**：深入配置
   - 配置 SEO 元数据
   - 了解部署流程

### 进阶开发者

- 直接查阅 [docusaurus.config.js 说明](./配置文件说明-docusaurus.config.js.md)
- 参考官方文档进行深度定制
- 使用 Webpack 别名优化代码组织

---

## 🔗 外部资源

### 官方文档
- [Docusaurus 官方文档](https://docusaurus.io/)
- [npm 官方文档](https://docs.npmjs.com/)
- [Vercel 文档](https://vercel.com/docs)
- [Pre-commit 文档](https://pre-commit.com/)

### 相关教程
- [Docusaurus 中文教程](https://docusaurus.io/zh-CN/)
- [package.json 完全指南](https://docs.npmjs.com/cli/v10/configuring-npm/package-json)

---

## 💡 贡献说明

如果您发现说明文档有任何错误或需要改进的地方，欢迎：

1. 提交 Issue：描述问题或建议
2. 提交 Pull Request：直接修改说明文档
3. 联系维护者：通过项目 README 中的联系方式

---

**最后更新时间**：2026年2月

**维护者**：SGLang Team
