---
sidebar_position: 1
---

# Qwen3

## 1. 模型介绍

[Qwen3](https://huggingface.co/collections/Qwen/qwen3) 是 Qwen 团队推出的最新一代大型语言模型系列。Qwen3 在理解、推理和生成能力方面实现了显著提升，为各种自然语言处理任务提供了强大的性能。

**核心特性：**

- **卓越的性能**：在多个基准测试中达到业界领先水平
- **多语言支持**：支持包括中文、英文在内的多种语言
- **长上下文支持**：支持扩展的上下文窗口，适用于长文档处理
- **高效推理**：优化的模型架构实现更快的推理速度
- **多尺寸选择**：提供多种模型尺寸以适应不同的部署需求
- **ROCm 支持**：通过 SGLang 兼容 AMD MI300X、MI325X 和 MI355X GPU

更多详情，请参阅[官方 Qwen3 GitHub 仓库](https://github.com/QwenLM/Qwen3)。

## 2. SGLang 安装

SGLang 提供多种安装方法。您可以根据硬件平台和需求选择最合适的安装方法。

请参阅[官方 SGLang 安装指南](https://docs.sglang.ai/get_started/install.html)了解安装说明。

## 3. 模型部署

本节提供针对不同硬件平台和使用场景优化的部署配置。

### 3.1 基础配置

Qwen3 系列提供多种尺寸的模型。以下配置已在各种硬件平台上验证。

**交互式命令生成器**：使用下方的配置选择器，自动生成适合您硬件平台、模型尺寸和量化方法的部署命令。

import Qwen3ConfigGenerator from '@site/src/components/autoregressive/Qwen3ConfigGenerator';

<Qwen3ConfigGenerator />

### 3.2 配置提示

* **内存管理**：根据您的 GPU 内存调整 `--context-length` 参数
* **多 GPU 部署**：使用张量并行（`--tp`）跨多个 GPU 扩展
* **量化支持**：支持 FP8、INT8 等多种量化方法以优化内存使用

## 4. 模型调用

### 4.1 基础用法

基础 API 使用方法和请求示例，请参阅：

- [SGLang 基础使用指南](https://docs.sglang.ai/basic_usage/send_request.html)

### 4.2 高级用法

#### 4.2.1 基础对话示例

```python
from openai import OpenAI

client = OpenAI(
    api_key="EMPTY",
    base_url="http://localhost:30000/v1",
    timeout=3600
)

messages = [
    {"role": "system", "content": "你是一个有帮助的AI助手。"},
    {"role": "user", "content": "请解释什么是大型语言模型。"}
]

response = client.chat.completions.create(
    model="Qwen/Qwen3-30B-A3B-Instruct",
    messages=messages,
    max_tokens=2048,
    temperature=0.7
)

print(response.choices[0].message.content)
```

## 5. 性能基准测试

### 5.1 速度基准测试

**测试环境：**

- 硬件：AMD MI300X GPU (8x)
- 模型：Qwen3 系列
- 张量并行度：8
- sglang 版本：0.5.7

我们使用 SGLang 内置的基准测试工具进行性能评估。

#### 5.1.1 延迟敏感型基准测试

- 模型部署命令：

```shell
python -m sglang.launch_server \
  --model Qwen/Qwen3-30B-A3B-Instruct \
  --tp 8 \
  --host 0.0.0.0 \
  --port 30000
```

- 基准测试命令：

```shell
python3 -m sglang.bench_serving \
  --backend sglang \
  --model Qwen/Qwen3-30B-A3B-Instruct \
  --dataset-name random \
  --random-input-len 1000 \
  --random-output-len 1000 \
  --num-prompts 10 \
  --max-concurrency 1
```

### 5.2 准确性基准测试

#### 5.2.1 GSM8K 基准测试

- **基准测试命令：**

```shell
python3 -m sglang.test.few_shot_gsm8k --num-questions 200
```

有关完整的基准测试结果和详细配置，请参阅官方文档。
