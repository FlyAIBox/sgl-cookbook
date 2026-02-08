# package.json 配置文件详解

本文档详细解释了 `package.json` 文件中的每个配置项，帮助前端初学者理解项目配置。

---

## 📋 项目基本信息

### name - 项目名称
```json
"name": "sglang-cookbook"
```
- **作用**：这是你的项目在 npm 上的唯一标识符
- **命名规则**：小写字母、连字符分隔，不能包含空格或特殊字符

### version - 版本号
```json
"version": "0.0.0"
```
- **作用**：遵循语义化版本规范 (Semantic Versioning)
- **格式**：`major.minor.patch`（主版本号.次版本号.修订号）
- **说明**：`0.0.0` 表示这是一个初始开发版本

### private - 私有包标识
```json
"private": true
```
- **作用**：设置为 `true` 可防止意外发布到 npm 公共仓库
- **适用场景**：内部项目、文档站点等不需要发布的项目
- **安全措施**：这是一个好的安全实践

---

## 🛠️ NPM 脚本命令 (scripts)

所有脚本可以通过 `npm run <script-name>` 或 `yarn <script-name>` 来执行。

### docusaurus
```json
"docusaurus": "docusaurus"
```
- **作用**：基础命令，直接调用 Docusaurus CLI
- **用法**：`npm run docusaurus -- <command>`

### start - 开发服务器
```json
"start": "docusaurus start --host 0.0.0.0 --port 3000"
```
- **作用**：启动本地开发环境
- **参数说明**：
  - `--host 0.0.0.0`：允许从任何网络接口访问（包括局域网内其他设备）
  - `--port 3000`：指定运行在 3000 端口
- **访问地址**：http://localhost:3000
- **特性**：支持热重载（修改文件后自动刷新）

### build - 生产构建
```json
"build": "docusaurus build"
```
- **作用**：将项目打包为静态 HTML/CSS/JS 文件
- **输出目录**：`build/` 目录
- **部署**：构建后的文件可以部署到任何静态服务器（如 Vercel、Netlify、GitHub Pages）

### swizzle - 主题组件替换
```json
"swizzle": "docusaurus swizzle"
```
- **作用**：允许你自定义 Docusaurus 默认组件
- **术语解释**：Swizzle 是 Docusaurus 的术语，意思是"解开并覆盖"主题组件
- **使用场景**：当你需要深度定制 UI 组件时使用

### deploy - 部署命令
```json
"deploy": "docusaurus deploy"
```
- **作用**：将构建后的网站发布到 GitHub Pages
- **前提条件**：需要在 `docusaurus.config.js` 中配置部署相关参数

### clear - 清除缓存
```json
"clear": "docusaurus clear"
```
- **作用**：删除 `.docusaurus` 缓存目录和 `build` 目录
- **使用场景**：当遇到构建问题或缓存问题时运行此命令很有帮助

### serve - 本地预览
```json
"serve": "docusaurus serve"
```
- **作用**：在本地启动一个服务器来预览生产构建的结果
- **使用步骤**：
  1. 先执行 `npm run build`
  2. 再执行 `npm run serve`
- **用途**：在部署前验证生产环境的构建结果

### write-translations - 国际化翻译
```json
"write-translations": "docusaurus write-translations"
```
- **作用**：生成翻译文件的初始化 JSON 文件
- **使用场景**：用于多语言网站的翻译工作流

### write-heading-ids - 自动添加标题ID
```json
"write-heading-ids": "docusaurus write-heading-ids"
```
- **作用**：为 Markdown 文件中的标题自动生成唯一 ID
- **用途**：这些 ID 用于目录导航和锚点链接

---

## 📦 运行时依赖 (dependencies)

这些包在生产环境中也需要，会被打包到最终的构建产物中。

### @docusaurus/core
```json
"@docusaurus/core": "3.9.2"
```
- **作用**：Docusaurus 核心包
- **功能**：提供站点的基础功能和构建系统

### @docusaurus/preset-classic
```json
"@docusaurus/preset-classic": "3.9.2"
```
- **作用**：Docusaurus 经典预设
- **包含功能**：博客、文档、页面等常用功能的预配置集合
- **适用场景**：最常用的 Docusaurus 配置，适合大多数文档网站

### @mdx-js/react
```json
"@mdx-js/react": "^3.0.0"
```
- **作用**：允许在 Markdown 文件中使用 React 组件
- **概念**：MDX = Markdown + JSX
- **优势**：让文档更具交互性

### clsx
```json
"clsx": "^2.0.0"
```
- **作用**：用于条件性地组合多个 CSS 类名
- **示例**：`clsx('btn', isActive && 'btn-active')`
- **优势**：代码更简洁、易读

### prism-react-renderer
```json
"prism-react-renderer": "^2.3.0"
```
- **作用**：为代码块提供语法高亮功能
- **支持**：多种编程语言和主题

### react
```json
"react": "^19.0.0"
```
- **作用**：React 核心库
- **功能**：构建用户界面的 JavaScript 库

### react-dom
```json
"react-dom": "^19.0.0"
```
- **作用**：React 的 DOM 渲染器
- **功能**：用于将 React 组件渲染到网页

---

## 🔧 开发依赖 (devDependencies)

这些包只在开发环境使用，不会被打包到生产构建中。

### @docusaurus/module-type-aliases
```json
"@docusaurus/module-type-aliases": "3.9.2"
```
- **作用**：提供 TypeScript 类型定义
- **功能**：模块类型别名

### @docusaurus/types
```json
"@docusaurus/types": "3.9.2"
```
- **作用**：为 Docusaurus API 提供完整的类型定义
- **优势**：即使项目使用 JavaScript，也能在编辑器中获得智能提示

### @types/js-yaml
```json
"@types/js-yaml": "^4.0.9"
```
- **作用**：为 YAML 文件解析提供 TypeScript 类型支持

---

## 🌐 浏览器兼容性配置 (browserslist)

定义项目需要支持的浏览器版本，工具链会根据这个配置进行代码转译。这些规则被 Babel、PostCSS、Autoprefixer 等工具使用。

### production - 生产环境
```json
"production": [
  ">0.5%",
  "not dead",
  "not op_mini all"
]
```
- **策略**：更严格的浏览器支持（优先考虑性能）
- **规则说明**：
  - `>0.5%`：全球使用率超过 0.5% 的浏览器
  - `not dead`：排除已经停止维护的浏览器（如 IE 11）
  - `not op_mini all`：排除 Opera Mini（功能受限的移动浏览器）

### development - 开发环境
```json
"development": [
  "last 3 chrome version",
  "last 3 firefox version",
  "last 5 safari version"
]
```
- **策略**：只需支持现代浏览器（更快的编译速度）
- **规则说明**：
  - `last 3 chrome version`：最新的 3 个 Chrome 版本
  - `last 3 firefox version`：最新的 3 个 Firefox 版本
  - `last 5 safari version`：最新的 5 个 Safari 版本

---

## ⚙️ Node.js 版本要求 (engines)

```json
"engines": {
  "node": ">=20.0"
}
```
- **作用**：指定运行此项目所需的最低 Node.js 版本
- **版本要求**：Node.js 20.0 或更高版本
- **行为**：如果用户的 Node.js 版本低于此要求，npm/yarn 会显示警告

---

## 📚 版本号说明

在依赖包的版本号前，你可能会看到这些符号：

- **`^`（插入符号）**：允许次版本和修订版本的更新
  - 示例：`^3.0.0` 允许安装 `3.x.x`，但不会安装 `4.0.0`
  - 适用场景：大多数情况下使用，保持向后兼容

- **`~`（波浪号）**：只允许修订版本的更新
  - 示例：`~3.0.0` 只允许安装 `3.0.x`

- **无符号**：锁定到精确版本
  - 示例：`3.9.2` 只会安装这个确切的版本

---

## 🎯 常用命令总结

| 命令 | 用途 | 使用场景 |
|------|------|----------|
| `npm install` | 安装所有依赖 | 首次克隆项目或添加新依赖后 |
| `npm start` | 启动开发服务器 | 本地开发时 |
| `npm run build` | 构建生产版本 | 准备部署时 |
| `npm run serve` | 预览生产构建 | 部署前验证 |
| `npm run clear` | 清除缓存 | 遇到构建问题时 |
| `npm run deploy` | 部署到 GitHub Pages | 发布网站时 |

---

## 💡 学习资源

- [Docusaurus 官方文档](https://docusaurus.io/)
- [npm 文档](https://docs.npmjs.com/)
- [语义化版本规范](https://semver.org/lang/zh-CN/)
- [Browserslist 查询工具](https://browsersl.ist/)
