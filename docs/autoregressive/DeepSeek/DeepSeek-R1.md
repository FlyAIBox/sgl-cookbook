---
sidebar_position: 1
---

# DeepSeek-R1

## 1. 模型介绍

[DeepSeek-R1](https://github.com/deepseek-ai/DeepSeek-R1) 是 DeepSeek 推出的先进推理模型，结合了强大的语言理解能力和逐步推理功能。该模型提供多种量化格式，针对不同硬件平台进行了优化。

**核心特性：**

- **先进的推理能力**：内置推理功能，用于复杂问题解决
- **多种量化选项**：FP8 和 FP4 变体，以适应不同的性能/内存权衡
- **硬件优化**：专门针对 NVIDIA B200（Blackwell）和 H200（Hopper）GPU，以及 AMD MI300X、MI325X 和 MI355X GPU 进行调优
- **高性能**：针对吞吐量和延迟场景进行优化

**可用模型：**

- **FP8（8位量化）**：[deepseek-ai/DeepSeek-R1-0528](https://huggingface.co/deepseek-ai/DeepSeek-R1-0528) - 推荐用于 H200 和 MI300X
- **FP4（4位量化）**：[nvidia/DeepSeek-R1-0528-FP4-v2](https://huggingface.co/nvidia/DeepSeek-R1-0528-FP4-v2) - 推荐用于 B200 和 MI355X

**许可证：**
使用 DeepSeek-R1 需同意 DeepSeek 社区许可证。详情请参阅 [LICENSE](https://huggingface.co/deepseek-ai/DeepSeek-R1-0528/blob/main/LICENSE)。

更多详情，请参阅[官方 DeepSeek-R1 仓库](https://github.com/deepseek-ai/DeepSeek-R1)。

## 2. SGLang 安装

请参阅[官方 SGLang 安装指南](https://docs.sglang.ai/get_started/install.html)了解安装说明。

## 3. 模型部署

本节提供针对不同硬件平台和使用场景优化的部署配置。

### 3.1 基础配置

**交互式命令生成器**：使用下方的配置选择器，自动生成适合您硬件平台、量化方法和部署策略的基本部署命令。

import { DeepSeekR1BasicConfigGenerator } from '@site/src/components/autoregressive/DeepSeekR1ConfigGenerator';

<DeepSeekR1BasicConfigGenerator />

### 3.2 最优配置

B200 和 H200 硬件的帕累托最优配置。

import { DeepSeekR1AdvancedConfigGenerator } from '@site/src/components/autoregressive/DeepSeekR1ConfigGenerator';

<DeepSeekR1AdvancedConfigGenerator />

### 3.3 配置提示

更多详细的配置建议和高级调优，请参阅 [DeepSeek V3/V3.1/R1 使用指南](https://docs.sglang.io/basic_usage/deepseek_v3.html)。

## 4. 模型调用

### 4.1 基础用法

基础 API 使用方法和请求示例，请参阅：

- [SGLang 基础使用指南](https://docs.sglang.ai/basic_usage/send_request.html)

### 4.2 高级用法

#### 4.2.1 推理解析器

DeepSeek-R1 支持高级推理功能，内置思考过程。在部署时启用推理解析器以分离思考和内容部分：

```shell
python -m sglang.launch_server \
  --model-path deepseek-ai/DeepSeek-R1-0528 \
  --reasoning-parser deepseek-r1 \
  --tp 8
```

**带有思考过程的流式输出：**

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:30000/v1",
    api_key="EMPTY"
)

# 启用流式传输以实时查看思考过程
response = client.chat.completions.create(
    model="deepseek-ai/DeepSeek-R1-0528",
    messages=[
        {"role": "user", "content": "逐步解决这个问题：240 的 15% 是多少？"}
    ],
    temperature=0.7,
    max_tokens=2048,
    stream=True
)

# 处理流
has_thinking = False
has_answer = False
thinking_started = False

for chunk in response:
    if chunk.choices and len(chunk.choices) > 0:
        delta = chunk.choices[0].delta

        # 打印思考过程
        if hasattr(delta, 'reasoning_content') and delta.reasoning_content:
            if not thinking_started:
                print("=============== 思考过程 =================", flush=True)
                thinking_started = True
            has_thinking = True
            print(delta.reasoning_content, end="", flush=True)

        # 打印答案内容
        if delta.content:
            # 关闭思考部分并添加内容标题
            if has_thinking and not has_answer:
                print("\n=============== 答案内容 =================", flush=True)
                has_answer = True
            print(delta.content, end="", flush=True)

print()
```

**输出示例：**

```text
=============== 思考过程 =================
要解决这个问题，我需要计算 240 的 15%。
步骤 1：将 15% 转换为小数：15% = 0.15
步骤 2：将 240 乘以 0.15
步骤 3：240 × 0.15 = 36
=============== 答案内容 =================

答案是 36。要找到 240 的 15%，我们将 240 乘以 0.15，结果等于 36。
```

**注意：**推理解析器会捕获模型的逐步思考过程，让您能够看到模型如何得出结论。

#### 4.2.2 工具调用

DeepSeek-R1 支持工具调用功能。启用工具调用解析器：

```shell
python -m sglang.launch_server \
  --model-path deepseek-ai/DeepSeek-R1-0528 \
  --reasoning-parser deepseek-r1 \
  --tool-call-parser deepseekv3 \
  --chat-template examples/chat_template/tool_chat_template_deepseekr1.jinja \
  --tp 8
```

**Python 示例（带有思考过程）：**

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:30000/v1",
    api_key="EMPTY"
)

# 定义可用工具
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "获取某个位置的当前天气",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "城市名称"
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                        "description": "温度单位"
                    }
                },
                "required": ["location"]
            }
        }
    }
]

# 使用流式传输发出请求以查看思考过程
response = client.chat.completions.create(
    model="deepseek-ai/DeepSeek-R1-0528",
    messages=[
        {"role": "user", "content": "北京的天气怎么样？"}
    ],
    tools=tools,
    temperature=0.7,
    stream=True
)

# 处理流式响应
thinking_started = False
has_thinking = False

for chunk in response:
    if chunk.choices and len(chunk.choices) > 0:
        delta = chunk.choices[0].delta

        # 打印思考过程
        if hasattr(delta, 'reasoning_content') and delta.reasoning_content:
            if not thinking_started:
                print("=============== 思考过程 =================", flush=True)
                thinking_started = True
            has_thinking = True
            print(delta.reasoning_content, end="", flush=True)

        # 打印工具调用
        if hasattr(delta, 'tool_calls') and delta.tool_calls:
            # 必要时关闭思考部分
            if has_thinking and thinking_started:
                print("\n=============== 答案内容 =================", flush=True)
                thinking_started = False

            for tool_call in delta.tool_calls:
                if tool_call.function:
                    print(f"🔧 工具调用: {tool_call.function.name}")
                    print(f"   参数: {tool_call.function.arguments}")

        # 打印内容
        if delta.content:
            print(delta.content, end="", flush=True)

print()
```

## 5. 性能基准测试

本节使用**行业标准配置**以获得可比较的基准测试结果。

### 5.1 速度基准测试

**测试环境：**

- 硬件：B200 GPU (8x)
- 模型：DeepSeek-R1-0528
- 张量并行度：8
- SGLang 版本：0.5.6.post1

**基准测试方法：**

我们使用行业标准基准测试配置来确保结果可跨框架和硬件平台进行比较。

#### 5.1.1 标准测试场景

三个核心场景反映真实世界的使用模式：

| 场景 | 输入长度 | 输出长度 | 使用场景 |
|---|---|---|---|
| **对话** | 1K | 1K | 最常见的对话 AI 工作负载 |
| **推理** | 1K | 8K | 长形式生成、复杂推理任务 |
| **摘要** | 8K | 1K | 文档摘要、RAG 检索 |

#### 5.1.2 并发级别

在不同并发级别测试每个场景，以捕获吞吐量与延迟的权衡：

- **低并发**：`--max-concurrency 1`（延迟优化）
- **中等并发**：`--max-concurrency 16`（平衡）
- **高并发**：`--max-concurrency 100`（吞吐量优化）

详细的基准测试命令和结果，请参阅完整文档。

### 5.2 准确性基准测试

#### 5.2.1 GSM8K 基准测试

- 基准测试命令

```bash
python3 benchmark/gsm8k/bench_sglang.py \
  --num-shots 8 \
  --num-questions 1316 \
  --parallel 1316
```

**测试结果：**

```
Accuracy: 0.959
Invalid: 0.000
Latency: 29.185 s
Output throughput: 4854.672 token/s
```
