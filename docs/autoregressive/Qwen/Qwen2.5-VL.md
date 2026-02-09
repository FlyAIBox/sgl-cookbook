---
sidebar_position: 5
---

# Qwen2.5-VL

## 1. 模型介绍

**[Qwen2.5-VL](https://huggingface.co/collections/Qwen/qwen25-vl)** 是 Qwen 团队推出的视觉语言模型系列，在理解、推理和多模态处理方面相比前代版本有显著改进。

**核心特性：**

- **视觉理解能力**：精通识别花卉、鸟类、鱼类和昆虫等常见物体，并能高效分析图像中的文本、图表、图标、图形和布局。
- **更强的智能体能力**：可作为视觉智能体进行推理并动态指导工具，支持计算机和手机的使用。
- **长视频理解和事件捕获**：支持理解超过 1 小时的视频，并具备通过定位相关视频片段来捕获事件的新能力。
- **多格式视觉定位**：通过生成边界框或点来精确定位图像中的对象，并可为坐标和属性提供稳定的 JSON 输出。
- **生成结构化输出**：支持内容的结构化输出，有利于金融、商业等领域对发票扫描、表单、表格等数据的使用。
- **视频理解的动态分辨率和帧率训练**：通过采用动态 FPS 采样将动态分辨率扩展到时间维度，使模型能够以各种采样率理解视频。相应地，我们使用 ID 和绝对时间对齐在时间维度上更新 mRoPE，使模型能够学习时间序列和速度，并最终获得定位特定时刻的能力。
- **多种尺寸**：提供 3B、7B、32B 和 72B 变体，以满足不同的部署需求。
- **ROCm 支持**：通过 SGLang 兼容 AMD MI300X、MI325X 和 MI355X GPU（已验证）。

更多详情，请参阅[官方 Qwen2.5-VL GitHub 仓库](https://github.com/QwenLM/Qwen3-VL)。

## 2. SGLang 安装

SGLang 提供多种安装方法。您可以根据硬件平台和需求选择最合适的安装方法。

请参阅[官方 SGLang 安装指南](https://docs.sglang.ai/get_started/install.html)了解安装说明。

## 3. 模型部署

本节提供针对 AMD MI300X、MI325X 和 MI355X 硬件平台和不同使用场景优化的部署配置。

### 3.1 基础配置

Qwen2.5-VL 系列提供各种尺寸的模型。以下配置已在 AMD MI300X、MI325X 和 MI355X GPU 上验证。

**交互式命令生成器**：使用下方的配置选择器，自动生成适合您硬件平台和模型尺寸的部署命令。

import Qwen25VLConfigGenerator from '@site/src/components/autoregressive/Qwen25VLConfigGenerator';

<Qwen25VLConfigGenerator />

### 3.2 配置提示

* **内存管理**：对于 MI300X/MI325X/MI355X 上的 72B 模型，我们已验证使用 `--context-length 128000` 成功部署。如果需要，可以使用较小的上下文长度来减少内存使用。
* **多 GPU 部署**：使用张量并行（`--tp`）跨多个 GPU 扩展。例如，对于 MI300X/MI325X/MI355X 上的 72B 模型使用 `--tp 8`，对于 32B 模型使用 `--tp 2`。

## 4. 模型调用

### 4.1 基础用法

基础 API 使用方法和请求示例，请参阅：

- [SGLang 基础使用指南](https://docs.sglang.ai/basic_usage/send_request.html)
- [SGLang OpenAI Vision API 指南](https://docs.sglang.ai/basic_usage/openai_api_vision.html)

### 4.2 高级用法

#### 4.2.1 多模态输入

Qwen2.5-VL 支持图像输入。以下是单图像输入的基本示例：

```python
import time
from openai import OpenAI

client = OpenAI(
    api_key="EMPTY",
    base_url="http://localhost:30000/v1",
    timeout=3600
)

messages = [
    {
        "role": "user",
        "content": [
            {
                "type": "image_url",
                "image_url": {
                    "url": "https://ofasys-multimodal-wlcb-3-toshanghai.oss-accelerate.aliyuncs.com/wpf272043/keepme/image/receipt.png"
                }
            },
            {
                "type": "text",
                "text": "读取图像中的所有文本。"
            }
        ]
    }
]

start = time.time()
response = client.chat.completions.create(
    model="Qwen/Qwen2.5-VL-7B-Instruct",
    messages=messages,
    max_tokens=2048
)
print(f"响应耗时: {time.time() - start:.2f}s")
print(f"生成的文本: {response.choices[0].message.content}")
```

**示例输出：**

```text
响应耗时: 2.31s
生成的文本: Auntie Anne's

CINNAMON SUGAR
1 x 17,000
SUB TOTAL
17,000

GRAND TOTAL
17,000

CASH IDR
20,000

CHANGE DUE
3,000
```

**多图像输入示例：**

Qwen2.5-VL 可以在单个请求中处理多个图像以进行比较或分析：

```python
import time
from openai import OpenAI

client = OpenAI(
    api_key="EMPTY",
    base_url="http://localhost:30000/v1",
    timeout=3600
)

messages = [
    {
        "role": "user",
        "content": [
            {
                "type": "image_url",
                "image_url": {
                    "url": "https://www.civitatis.com/f/china/hong-kong/guia/taxi.jpg"
                }
            },
            {
                "type": "image_url",
                "image_url": {
                    "url": "https://cdn.cheapoguides.com/wp-content/uploads/sites/7/2025/05/GettyImages-509614603-1280x600.jpg"
                }
            },
            {
                "type": "text",
                "text": "比较这两张图像并用 100 字或更少的文字描述差异。"
            }
        ]
    }
]

start = time.time()
response = client.chat.completions.create(
    model="Qwen/Qwen2.5-VL-7B-Instruct",
    messages=messages,
    max_tokens=2048
)
print(f"响应耗时: {time.time() - start:.2f}s")
print(f"生成的文本: {response.choices[0].message.content}")
```

**注意：**

- 您也可以使用 `file://` 协议提供本地文件路径。
- 对于较大的图像，您可能需要更多内存，请相应调整 `--mem-fraction-static`。


## 5. 性能基准测试

### 5.1 速度基准测试

**测试环境：**

- 硬件：AMD MI300X GPU (8x)
- 模型：Qwen2.5-VL-72B-Instruct
- 张量并行度：8
- SGLang 版本：0.5.6

我们使用 SGLang 内置的基准测试工具，使用随机图像进行性能评估。为了模拟真实世界的使用情况，您可以为每个请求指定不同的输入和输出长度。例如，每个请求可以有 128 个输入 token、两张 720p 图像和 1024 个输出 token。

#### 5.1.1 延迟敏感型基准测试

- 模型部署命令：

```shell
python -m sglang.launch_server \
  --model Qwen/Qwen2.5-VL-72B-Instruct \
  --tp 8 \
  --host 0.0.0.0 \
  --port 30000
```

- 基准测试命令：

```shell
python3 -m sglang.bench_serving \
  --backend sglang-oai-chat \
  --host 127.0.0.1 \
  --port 30000 \
  --model Qwen/Qwen2.5-VL-72B-Instruct \
  --dataset-name image \
  --image-count 2 \
  --image-resolution 720p \
  --random-input-len 128 \
  --random-output-len 1024 \
  --num-prompts 10 \
  --max-concurrency 1
```

#### 5.1.2 吞吐量敏感型基准测试

- 模型部署命令：

```shell
python -m sglang.launch_server \
  --model Qwen/Qwen2.5-VL-72B-Instruct \
  --tp 8 \
  --host 0.0.0.0 \
  --port 30000
```

- 基准测试命令：

```shell
python3 -m sglang.bench_serving \
  --backend sglang-oai-chat \
  --host 127.0.0.1 \
  --port 30000 \
  --model Qwen/Qwen2.5-VL-72B-Instruct \
  --dataset-name image \
  --image-count 2 \
  --image-resolution 720p \
  --random-input-len 128 \
  --random-output-len 1024 \
  --num-prompts 1000 \
  --max-concurrency 100
```

### 5.2 准确性基准测试

#### 5.2.1 MMMU 基准测试

您可以使用 MMMU 数据集评估模型的准确性：

- 基准测试命令：

```shell
python3 benchmark/mmmu/bench_sglang.py \
    --port 30000 \
    --concurrency 64
```
