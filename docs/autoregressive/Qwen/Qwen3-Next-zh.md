---
sidebar_position: 2
---

# Qwen3-Next

## 1. 模型介绍

[Qwen3-Next](https://huggingface.co/collections/Qwen/qwen3-next) 是 Qwen 团队推出的下一代大型语言模型系列，代表了在性能、效率和能力方面的最新进展。

**核心特性：**

- **增强的推理能力**：在复杂推理任务中表现出色
- **优化的架构**：采用最新的模型架构设计
- **高效的 MoE 设计**：专家混合架构实现更好的性能成本比
- **扩展的上下文支持**：支持更长的上下文窗口
- **多模态能力增强**：改进的多模态处理能力
- **ROCm 支持**：通过 SGLang 兼容 AMD MI300X、MI325X 和 MI355X GPU

更多详情，请参阅[官方 Qwen3-Next GitHub 仓库](https://github.com/QwenLM/Qwen3-Next)。

## 2. SGLang 安装

SGLang 提供多种安装方法。您可以根据硬件平台和需求选择最合适的安装方法。

请参阅[官方 SGLang 安装指南](https://docs.sglang.ai/get_started/install.html)了解安装说明。

## 3. 模型部署

本节提供针对不同硬件平台和使用场景优化的部署配置。

### 3.1 基础配置

Qwen3-Next 系列提供多种尺寸的模型。以下配置已在 AMD MI300X、MI325X 和 MI355X GPU 上验证。

**交互式命令生成器**：使用下方的配置选择器，自动生成适合您硬件平台和模型尺寸的部署命令。

import Qwen3NextConfigGenerator from '@site/src/components/autoregressive/Qwen3NextConfigGenerator';

<Qwen3NextConfigGenerator />

### 3.2 配置提示

* **内存管理**：针对大型模型优化内存使用
* **专家并行**：MoE 模型使用 `--ep` 参数进行专家并行
* **量化支持**：支持 FP8 量化以减少内存占用

## 4. 模型调用

### 4.1 基础用法

基础 API 使用方法和请求示例，请参阅：

- [SGLang 基础使用指南](https://docs.sglang.ai/basic_usage/send_request.html)

### 4.2 高级用法

#### 4.2.1 对话示例

```python
from openai import OpenAI

client = OpenAI(
    api_key="EMPTY",
    base_url="http://localhost:30000/v1",
    timeout=3600
)

messages = [
    {"role": "user", "content": "请详细解释量子计算的基本原理。"}
]

response = client.chat.completions.create(
    model="Qwen/Qwen3-Next-80B-A3B-Instruct",
    messages=messages,
    max_tokens=2048,
    temperature=0.7
)

print(response.choices[0].message.content)
```

## 5. 性能基准测试

### 5.1 速度基准测试

**测试环境：**

- 硬件：AMD MI300X GPU
- 模型：Qwen3-Next 系列
- sglang 版本：0.5.7

详细的基准测试结果和配置，请参阅官方文档。
