---
sidebar_position: 3
---

# Qwen3-VL

## 1. 模型介绍

[Qwen3-VL](https://huggingface.co/collections/Qwen/qwen3-vl) 是 Qwen 团队推出的视觉语言模型系列，结合了强大的视觉理解和语言生成能力。

**核心特性：**

- **先进的视觉理解**：精确识别和理解图像内容
- **多模态融合**：有效融合视觉和文本信息
- **长视频支持**：处理长视频内容的能力
- **高分辨率支持**：支持高分辨率图像处理
- **结构化输出**：生成结构化的分析结果
- **ROCm 支持**：通过 SGLang 兼容 AMD MI300X、MI325X 和 MI355X GPU

更多详情，请参阅[官方 Qwen3-VL GitHub 仓库](https://github.com/QwenLM/Qwen3-VL)。

## 2. SGLang 安装

SGLang 提供多种安装方法。您可以根据硬件平台和需求选择最合适的安装方法。

请参阅[官方 SGLang 安装指南](https://docs.sglang.ai/get_started/install.html)了解安装说明。

## 3. 模型部署

本节提供针对不同硬件平台和使用场景优化的部署配置。

### 3.1 基础配置

Qwen3-VL 系列提供多种尺寸的模型。以下配置已在 AMD MI300X、MI325X 和 MI355X GPU 上验证。

**交互式命令生成器**：使用下方的配置选择器，自动生成适合您硬件平台和模型尺寸的部署命令。

import Qwen3VLConfigGenerator from '@site/src/components/autoregressive/Qwen3VLConfigGenerator';

<Qwen3VLConfigGenerator />

### 3.2 配置提示

* **内存管理**：视觉语言模型需要更多内存，请相应调整配置
* **图像处理**：支持多种图像分辨率和格式
* **批处理**：支持批量处理多个图像

## 4. 模型调用

### 4.1 基础用法

基础 API 使用方法和请求示例，请参阅：

- [SGLang 基础使用指南](https://docs.sglang.ai/basic_usage/send_request.html)
- [SGLang OpenAI Vision API 指南](https://docs.sglang.ai/basic_usage/openai_api_vision.html)

### 4.2 高级用法

#### 4.2.1 图像理解示例

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
        "content": [
            {
                "type": "image_url",
                "image_url": {
                    "url": "https://example.com/image.jpg"
                }
            },
            {
                "type": "text",
                "text": "请详细描述这张图片的内容。"
            }
        ]
    }
]

response = client.chat.completions.create(
    model="Qwen/Qwen3-VL-72B-Instruct",
    messages=messages,
    max_tokens=2048
)

print(response.choices[0].message.content)
```

## 5. 性能基准测试

### 5.1 速度基准测试

**测试环境：**

- 硬件：AMD MI300X GPU
- 模型：Qwen3-VL 系列
- sglang 版本：0.5.7

详细的基准测试结果和配置，请参阅官方文档。
