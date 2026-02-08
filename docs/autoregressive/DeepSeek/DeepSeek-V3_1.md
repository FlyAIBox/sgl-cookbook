---
sidebar_position: 2
---

# DeepSeek-V3.1

## 1. 模型介绍

[DeepSeek V3.1](https://huggingface.co/deepseek-ai/DeepSeek-V3.1) 是由 DeepSeek 开发的先进专家混合（MoE）大型语言模型，代表了相对 DeepSeek V3 的重大能力和可用性升级。作为 DeepSeek V3 家族的精炼迭代，DeepSeek V3.1 引入了混合推理范式，支持快速非思考响应和显式多步推理，同时显著改进了工具调用和智能体行为。该模型在推理、数学、编码、长上下文理解和真实世界智能体工作流方面表现出色，受益于持续训练、对齐优化和推理时优化。DeepSeek V3.1 被设计为一个强大的通用基础模型，非常适合对话 AI、结构化工具调用、搜索增强生成和复杂多步任务，同时通过其稀疏 MoE 架构保持高效率。

**[DeepSeek-V3.1-Terminus](https://huggingface.co/deepseek-ai/DeepSeek-V3.1-Terminus)** 是一个实验性版本，专为常规对话和长上下文处理而设计。它具有混合思考能力，允许您在用于审慎推理的"思考"模式和用于更快响应的"非思考"模式之间切换。推荐用于常规对话、长上下文处理和实验性使用场景。

## 2. SGLang 安装

SGLang 提供多种安装方法。您可以根据硬件平台和需求选择最合适的安装方法。

请参阅[官方 SGLang 安装指南](https://docs.sglang.ai/get_started/install.html)了解安装说明。

## 3. 模型部署

本节提供从快速部署到性能优化的渐进式指南，适合不同级别的用户。

### 3.1 基础配置

**交互式命令生成器**：使用下方的配置选择器，自动生成适合您硬件平台、模型变体、部署策略和推理能力的部署命令。

import DeepSeekV31ConfigGenerator from '@site/src/components/autoregressive/DeepSeekV31ConfigGenerator';

<DeepSeekV31ConfigGenerator />

### 3.2 配置提示
更多详细的配置建议，请参阅 [DeepSeek V3/V3.1/R1 使用指南](https://docs.sglang.io/basic_usage/deepseek_v3.html)。

## 4. 模型调用

### 4.1 基础用法

基础 API 使用方法和请求示例，请参阅：

- [基础 API 使用](https://docs.sglang.ai/get_started/quick_start.html)

### 4.2 高级用法

#### 4.2.1 推理解析器

DeepSeek-V3.1 支持推理模式。在部署时启用推理解析器以分离思考和内容部分：

```shell
python -m sglang.launch_server \
  --model deepseek-ai/DeepSeek-V3.1-Terminus \
  --reasoning-parser deepseek-v3 \
  --tp 8 \
  --host 0.0.0.0 \
  --port 8000
```

**带有思考过程的流式输出：**

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:8000/v1",
    api_key="EMPTY"
)

# 启用流式传输以实时查看思考过程
response = client.chat.completions.create(
    model="deepseek-ai/DeepSeek-V3.1-Terminus",
    messages=[
        {"role": "user", "content": "逐步解决这个问题：240 的 15% 是多少？"}
    ],
    temperature=0.7,
    max_tokens=2048,
    extra_body = {"chat_template_kwargs": {"thinking": True}},
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

**注意：**推理解析器会捕获模型的逐步思考过程，让您能够看到模型如何得出结论。

#### 4.2.2 工具调用

DeepSeek-V3.1 和 DeepSeek-V3.1-Terminus 支持工具调用功能。启用工具调用解析器：

**注意：** DeepSeek-V3.1-Speciale **不**支持工具调用。它专为深度推理任务而设计。

**部署命令：**

```shell
python -m sglang.launch_server \
  --model deepseek-ai/DeepSeek-V3.1-Terminus \
  --tool-call-parser deepseekv31 \
  --reasoning-parser deepseek-v3 \
  --chat-template ./examples/chat_template/tool_chat_template_deepseekv31.jinja \
  --tp 8 \
  --host 0.0.0.0 \
  --port 8000
```

对于 DeepSeek-V3.1，也使用 `--tool-call-parser deepseekv31`。

**Python 示例（带有思考过程）：**

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:8000/v1",
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
    model="deepseek-ai/DeepSeek-V3.1-Terminus",
    messages=[
        {"role": "user", "content": "北京的天气怎么样？"}
    ],
    tools=tools,
    extra_body = {"chat_template_kwargs": {"thinking": True}},
    temperature=0.7,
    stream=True
)

# 处理流式响应
thinking_started = False
has_thinking = False
tool_calls_accumulator = {}

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

        # 累积工具调用
        if hasattr(delta, 'tool_calls') and delta.tool_calls:
            # 必要时关闭思考部分
            if has_thinking and thinking_started:
                print("\n=============== 答案内容 =================\n", flush=True)
                thinking_started = False

            for tool_call in delta.tool_calls:
                index = tool_call.index
                if index not in tool_calls_accumulator:
                    tool_calls_accumulator[index] = {
                        'name': None,
                        'arguments': ''
                    }

                if tool_call.function:
                    if tool_call.function.name:
                        tool_calls_accumulator[index]['name'] = tool_call.function.name
                    if tool_call.function.arguments:
                        tool_calls_accumulator[index]['arguments'] += tool_call.function.arguments

        # 打印内容
        if delta.content:
            print(delta.content, end="", flush=True)

# 打印累积的工具调用
for index, tool_call in sorted(tool_calls_accumulator.items()):
    print(f"🔧 工具调用: {tool_call['name']}")
    print(f"   参数: {tool_call['arguments']}")

print()
```

## 5. 性能基准测试

### 5.1 速度基准测试

**测试环境：**

- 硬件：AMD MI300X GPU (8x)
- 模型：DeepSeek-V3.1-Terminus
- 张量并行度：8
- sglang 版本：0.5.7

**基准测试方法：**

我们使用行业标准基准测试配置来确保结果可跨框架和硬件平台进行比较。

#### 5.1.1 标准测试场景

三个核心场景反映真实世界的使用模式：

| 场景 | 输入长度 | 输出长度 | 使用场景 |
|---|---|---|---|
| **对话** | 1K | 1K | 最常见的对话 AI 工作负载 |
| **推理** | 1K | 8K | 长形式生成、复杂推理任务 |
| **摘要** | 8K | 1K | 文档摘要、RAG 检索 |

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
