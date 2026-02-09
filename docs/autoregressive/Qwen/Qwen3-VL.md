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

**交互式命令生成器**：为了简化部署流程，我们提供了智能配置选择器，能够根据您的具体需求自动生成最优的部署命令。

#### 3.1.1 配置生成器功能说明

我们的交互式配置生成器提供以下核心功能：

1. **硬件平台自适应**：自动识别并优化 NVIDIA CUDA 和 AMD ROCm 平台的部署参数
2. **模型尺寸选择**：支持 Qwen3-VL 系列所有模型规格（2B、7B、72B）
3. **内存优化建议**：根据所选模型和硬件自动计算最佳的张量并行度和内存配置
4. **一键复制命令**：生成后可直接复制完整的部署命令，无需手动拼接参数

#### 3.1.2 使用步骤

1. **选择硬件平台**：在下方选择器中选择您的 GPU 类型（NVIDIA 或 AMD）
2. **选择模型规格**：根据您的需求选择对应的 Qwen3-VL 模型尺寸
3. **配置部署参数**：根据提示调整张量并行度、端口号等可选参数
4. **生成并复制命令**：点击生成按钮，一键复制完整的部署命令
5. **执行部署**：在终端中粘贴并运行生成的命令

#### 3.1.3 配置选项详解

- **张量并行度 (Tensor Parallelism)**：将模型切分到多个 GPU 上运行，数值应等于 GPU 数量
- **端口配置**：默认使用 30000 端口，可根据实际情况调整以避免端口冲突
- **信任远程代码**：对于 Qwen3-VL 等需要自定义代码的模型，需启用此选项
- **ROCm 优化**：AMD 平台会自动启用 ROCm 专属优化参数

#### 3.1.4 典型配置示例

import Qwen3VLConfigGenerator from '@site/src/components/autoregressive/Qwen3VLConfigGenerator';

<Qwen3VLConfigGenerator />

**单 GPU 配置示例**：
- 模型：Qwen3-VL-2B-Instruct
- 硬件：1x NVIDIA A100/H100 或 AMD MI300X
- 张量并行度：1
- 适用场景：开发测试、小规模推理服务

**多 GPU 配置示例**：
- 模型：Qwen3-VL-72B-Instruct  
- 硬件：4x NVIDIA A100 或 4x AMD MI300X
- 张量并行度：4
- 适用场景：生产环境、高吞吐量服务

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
