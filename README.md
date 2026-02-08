# SGLang Cookbook

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/sgl-project/sgl-cookbook/pulls)

社区维护的 SGLang 实践指南和使用手册仓库，用于在生产环境中部署和使用 SGLang。我们的使命很简单：用清晰、可操作的解决方案回答**"如何在硬件 Y 上使用 SGLang（及相关模型）完成任务 Z？"**

## 🎯 你将在这里找到什么

本 cookbook 汇集了经过实战检验的 SGLang 使用指南，涵盖：

- **模型**：主流LLM、视觉语言模型（VLM）和扩散模型
- **使用场景**：推理服务、部署策略、多模态应用
- **硬件**：GPU 和 CPU 配置、不同加速器的优化
- **最佳实践**：配置模板、性能调优、故障排除指南

每个使用指南都提供分步说明，帮助您快速实现符合特定需求的 SGLang 解决方案。

## 🚀 快速开始

1. 浏览上方的使用指南索引以查找您的模型
2. 按照每个指南中的分步说明进行操作
3. 根据您的具体硬件和需求调整配置
4. 加入我们的社区分享反馈和改进建议

## 🤝 贡献

我们相信最好的文档来自实践者。无论您是针对特定模型优化了 SGLang、解决了棘手的部署挑战，还是发现了性能改进，我们都鼓励您贡献您的使用指南！

**贡献方式：**

- 添加尚未涵盖的模型的新使用指南
- 通过添加提示或配置改进现有使用指南
- 报告问题或建议改进
- 分享您的生产部署经验

**如何贡献：**

```shell
# Fork 仓库并克隆到本地
git clone https://github.com/YOUR_USERNAME/sglang-cookbook.git
cd sglang-cookbook

# 创建新分支
git checkout -b add-my-recipe

# 按照 DeepSeek-V3.2 中的模板添加您的使用指南
# 提交 PR！
```

## 🛠️ 本地开发

### 前置要求

- Node.js >= 20.0
- npm 或 yarn

### 设置和运行

安装依赖并启动开发服务器：

```shell
# 安装依赖
npm install

# 启动开发服务器（启用热重载）
npm start
```

站点将自动在浏览器中打开 `http://localhost:3000`。

## 📖 资源

- [SGLang GitHub](https://github.com/sgl-project/sglang)
- [SGLang 文档](https://sgl-project.github.io)
- [社区 Slack/Discord](https://discord.gg/MpEEuAeb)

## 📄 许可证

本项目采用 Apache License 2.0 许可 - 详见 [LICENSE](https://github.com/sgl-project/sgl-cookbook/blob/main/LICENSE) 文件。

---

**让我们一起构建这个资源！** 🚀 为仓库加星并贡献您的使用指南，帮助 SGLang 社区成长。
