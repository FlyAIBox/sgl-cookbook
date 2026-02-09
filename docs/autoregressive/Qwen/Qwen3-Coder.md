---
sidebar_position: 4
---

# Qwen3-Coder

## 1. 模型介绍

[Qwen3-Coder](https://huggingface.co/collections/Qwen/qwen3-coder) 是 Qwen 团队推出的最新代码专注大型语言模型系列。Qwen3-Coder 基于 Qwen3 构建，在代码生成、理解和推理任务中表现出色。

**核心特性：**

- **顶尖的编码性能**：在 HumanEval、MBPP、LiveCodeBench 和其他主要编码基准测试中取得顶级成绩。
- **工具调用支持**：原生支持函数调用和工具使用，可与外部 API 和服务无缝集成。
- **扩展的上下文长度**：支持最多 256K token，用于处理大型代码库和长文档。
- **多语言代码支持**：精通 Python、JavaScript、TypeScript、Java、C++、Go、Rust 和许多其他编程语言。
- **MoE 架构**：高效的专家混合设计，实现最佳的性能成本比。
- **ROCm 支持**：通过 SGLang 兼容 AMD MI300X、MI325X 和 MI355X GPU（已验证）。

更多详情，请参阅[官方 Qwen3-Coder GitHub 仓库](https://github.com/QwenLM/Qwen3-Coder)。

## 2. SGLang 安装

SGLang 提供多种安装方法。您可以根据硬件平台和需求选择最合适的安装方法。

请参阅[官方 SGLang 安装指南](https://docs.sglang.ai/get_started/install.html)了解安装说明。

## 3. 模型部署

本节提供在 AMD MI300X、MI325X 和 MI355X 硬件平台上验证的部署配置。

### 3.1 基础配置

以下配置已在 AMD MI300X、MI325X 和 MI355X GPU 上验证。

**交互式命令生成器**：使用下方的配置选择器，自动生成适合您硬件平台、模型尺寸和量化方法的部署命令。

import Qwen3CoderConfigGenerator from '@site/src/components/autoregressive/Qwen3CoderConfigGenerator';

<Qwen3CoderConfigGenerator />

### 3.2 配置提示

* **内存管理**：我们已验证在 MI300X/MI325X/MI355X 上使用 `--context-length 8192` 成功部署。可能支持更大的上下文长度，但需要额外的内存。
* **专家并行**：对于使用 FP8 量化的 480B-A35B，需要 `--ep 2` 以满足维度对齐要求。
* **页面大小**：建议 MoE 模型使用 `--page-size 32` 以优化内存使用。
* **环境变量**：如果遇到 aiter 相关问题，请尝试设置 `SGLANG_USE_AITER=0`。
* **工具使用**：要启用工具调用功能，请在启动命令中添加 `--tool-call-parser qwen3_coder`。


## 4. 模型调用

### 4.1 基础用法

基础 API 使用方法和请求示例，请参阅：

- [SGLang 基础使用指南](https://docs.sglang.ai/basic_usage/send_request.html)

### 4.2 高级用法

#### 4.2.1 代码生成示例

```python
from openai import OpenAI

client = OpenAI(
    api_key="EMPTY",
    base_url="http://localhost:30000/v1",
    timeout=3600
)

messages = [
    {
        "role": "user",
        "content": "编写一个 Python 函数，在已排序列表上实现二分查找。包括文档字符串和类型提示。"
    }
]

response = client.chat.completions.create(
    model="Qwen/Qwen3-Coder-480B-A35B-Instruct",
    messages=messages,
    max_tokens=2048,
    temperature=0.7
)

print(response.choices[0].message.content)
```

#### 4.2.2 工具调用示例

Qwen3-Coder 支持工具调用功能。在部署期间启用工具调用解析器。以下示例使用 30B-A3B 模型：

```shell
SGLANG_USE_AITER=0 python -m sglang.launch_server \
  --model Qwen/Qwen3-Coder-30B-A3B-Instruct \
  --tp 1 \
  --context-length 8192 \
  --page-size 32 \
  --tool-call-parser qwen3_coder
```

**Python 示例：**

```python
from openai import OpenAI

client = OpenAI(
    api_key="EMPTY",
    base_url="http://localhost:30000/v1",
    timeout=3600
)

# 定义可用工具
tools = [
    {
        "type": "function",
        "function": {
            "name": "execute_code",
            "description": "执行 Python 代码并返回结果",
            "parameters": {
                "type": "object",
                "properties": {
                    "code": {
                        "type": "string",
                        "description": "要执行的 Python 代码"
                    }
                },
                "required": ["code"]
            }
        }
    }
]

response = client.chat.completions.create(
    model="Qwen/Qwen3-Coder-30B-A3B-Instruct",
    messages=[
        {"role": "user", "content": "使用 Python 计算 10 的阶乘"}
    ],
    tools=tools,
    temperature=0.7
)

# 检查模型是否想要调用工具
if response.choices[0].message.tool_calls:
    tool_call = response.choices[0].message.tool_calls[0]
    print(f"工具: {tool_call.function.name}")
    print(f"参数: {tool_call.function.arguments}")
else:
    # 模型可能以内容格式返回工具调用
    print(response.choices[0].message.content)
```

## 5. 性能基准测试

### 5.1 速度基准测试

**测试环境：**

- 硬件：AMD MI300X GPU (8x)
- 模型：Qwen/Qwen3-Coder-480B-A35B-Instruct-FP8
- 张量并行度：8
- 专家并行度：2
- sglang 版本：0.5.7

我们使用 SGLang 内置的基准测试工具，使用随机数据集进行性能评估。

#### 5.1.1 标准场景基准测试

- 模型部署命令：

```shell
SGLANG_USE_AITER=0 python -m sglang.launch_server \
  --model Qwen/Qwen3-Coder-480B-A35B-Instruct-FP8 \
  --tp 8 \
  --ep 2 \
  --context-length 8192 \
  --page-size 32 \
  --trust-remote-code
```

##### 5.1.1.1 低并发

- 基准测试命令：

```shell
python3 -m sglang.bench_serving \
  --backend sglang \
  --model Qwen/Qwen3-Coder-480B-A35B-Instruct-FP8 \
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

- **结果**：

  - Qwen/Qwen3-Coder-480B-A35B-Instruct-FP8
    ```
    Accuracy: 0.965
    Invalid: 0.000
    Latency: 23.084 s
    Output throughput: 1148.425 token/s
    ```
