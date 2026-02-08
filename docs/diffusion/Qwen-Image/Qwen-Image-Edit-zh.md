---
sidebar_position: 1
---
# Qwen-Image-Edit-2511

## 1. 模型介绍

[Qwen-Image-Edit-2511](https://huggingface.co/Qwen/Qwen-Image-Edit-2511) 是 Qwen-Image-Edit-2509 的增强版本，具有多项改进——其中文档提到一致性显著提升。Qwen-Image-Edit-2511 基于 20B Qwen-Image 模型构建，成功将 Qwen-Image 独特的文本渲染功能扩展到图像编辑任务，实现精确的文本编辑。

Qwen-Image-Edit-2511 的核心增强：

- **缓解图像漂移**：减少图像非编辑区域的不必要变化。
- **改进的人物一致性**：模型可以基于输入肖像进行富有想象力的编辑，同时保留主体的身份和视觉特征。
- **多人一致性**：增强多人合照中的一致性，能够将两张单独的人像高保真融合成连贯的合照。
- **集成 LoRA 功能**：将精选的社区创建的流行 LoRA 直接集成到基础模型中，无需额外调整即可解锁其效果（例如，照明增强、视角生成）。
- **增强的工业设计生成**：特别关注实际工程场景，包括批量工业产品设计和工业组件的材料替换。
- **增强的几何推理**：更强的几何推理能力，可用于生成辅助构造线以进行设计或注释。

更多详情，请参阅[官方 Qwen-Image-Edit-2511 HuggingFace 页面](https://huggingface.co/Qwen/Qwen-Image-Edit-2511)、[博客](https://qwenlm.github.io/blog/qwen-image-edit-2511/)和[技术报告](https://qianwen-res.oss-cn-beijing.aliyuncs.com/Qwen-Image/Qwen_Image.pdf)。

## 2. SGLang-diffusion 安装

SGLang-diffusion 提供多种安装方法。您可以根据硬件平台和需求选择最合适的安装方法。

请参阅[官方 SGLang-diffusion 安装指南](https://github.com/sgl-project/sglang/blob/main/python/sglang/multimodal_gen/docs/install.md)了解安装说明。

## 3. 模型部署

本节提供针对不同硬件平台和使用场景优化的部署配置。

### 3.1 基础配置

Qwen-Image-Edit-2511 是一个 20B 参数模型，针对图像编辑任务进行了优化。推荐的启动配置因硬件而异。

**交互式命令生成器**：使用下方的配置选择器，自动生成适合您硬件平台的部署命令。

import QwenImageEditConfigGenerator from '@site/src/components/diffusion/QwenImageEditConfigGenerator';

<QwenImageEditConfigGenerator />

### 3.2 配置提示

所有当前支持的优化列在[这里](https://github.com/sgl-project/sglang/blob/main/python/sglang/multimodal_gen/docs/support_matrix.md)。

- `--vae-path`：自定义 VAE 模型或 HuggingFace 模型 ID 的路径（例如，fal/FLUX.2-Tiny-AutoEncoder）。如果未指定，VAE 将从主模型路径加载。
- `--num-gpus`：要使用的 GPU 数量
- `--tp-size`：张量并行大小（仅用于编码器；如果启用文本编码器卸载，则不应大于 1，因为逐层卸载加预取更快）
- `--sp-degree`：序列并行大小（通常应与 GPU 数量匹配）
- `--ulysses-degree`：USP 中 DeepSpeed-Ulysses 风格 SP 的度数
- `--ring-degree`：USP 中环形注意力风格 SP 的度数

## 4. API 使用

有关完整的 API 文档，请参阅[官方 API 使用指南](https://github.com/sgl-project/sglang/blob/main/python/sglang/multimodal_gen/docs/openai_api.md)。

### 4.1 编辑图像

```python
import base64
from openai import OpenAI

client = OpenAI(api_key="EMPTY", base_url="http://localhost:3000/v1")

response = client.images.edit(
    model="Qwen/Qwen-Image-Edit-2511",
    image=open("input.png", "rb"),
    prompt="将出租车的颜色改为黑色。",
    n=1,
    response_format="b64_json",
)

# 保存编辑后的图像
image_bytes = base64.b64decode(response.data[0].b64_json)
with open("output.png", "wb") as f:
    f.write(image_bytes)
```

### 4.2 高级用法

#### 4.2.1 Cache-DiT 加速

SGLang 集成了 [Cache-DiT](https://github.com/vipshop/cache-dit)，这是一个用于扩散变换器（DiT）的缓存加速引擎，可实现高达 7.4 倍的推理加速，且质量损失最小。您可以设置 `SGLANG_CACHE_DIT_ENABLED=True` 来启用它。更多详情，请参阅 SGLang Cache-DiT [文档](https://github.com/sgl-project/sglang/blob/main/python/sglang/multimodal_gen/docs/cache_dit.md)。

**基础用法**

```bash
SGLANG_CACHE_DIT_ENABLED=true sglang serve --model-path Qwen/Qwen-Image-Edit-2511
```

**高级用法**

- DBCache 参数：DBCache 控制块级缓存行为：

  | 参数 | 环境变量 | 默认值 | 描述 |
  |---|---|---|---|
  | Fn | `SGLANG_CACHE_DIT_FN` | 1 | 始终计算的第一个块数 |
  | Bn | `SGLANG_CACHE_DIT_BN` | 0 | 始终计算的最后一个块数 |
  | W | `SGLANG_CACHE_DIT_WARMUP` | 4 | 缓存开始前的预热步骤 |
  | R | `SGLANG_CACHE_DIT_RDT` | 0.24 | 剩余差阈值 |
  | MC | `SGLANG_CACHE_DIT_MC` | 3 | 最大连续缓存步骤 |

- TaylorSeer 配置：TaylorSeer 使用 Taylor 展开提高缓存准确性：

  | 参数 | 环境变量 | 默认值 | 描述 |
  |---|---|---|---|
  | Enable | `SGLANG_CACHE_DIT_TAYLORSEER` | false | 启用 TaylorSeer 校准器 |
  | Order | `SGLANG_CACHE_DIT_TS_ORDER` | 1 | Taylor 展开阶数（1 或 2）|

  组合配置示例：

```bash
SGLANG_CACHE_DIT_ENABLED=true \
SGLANG_CACHE_DIT_FN=2 \
SGLANG_CACHE_DIT_BN=1 \
SGLANG_CACHE_DIT_WARMUP=4 \
SGLANG_CACHE_DIT_RDT=0.4 \
SGLANG_CACHE_DIT_MC=4 \
SGLANG_CACHE_DIT_TAYLORSEER=true \
SGLANG_CACHE_DIT_TS_ORDER=2 \
sglang serve --model-path Qwen/Qwen-Image-Edit-2511
```

#### 4.2.2 CPU 卸载

- `--dit-cpu-offload`：对 DiT 推理使用 CPU 卸载。内存不足时启用。
- `--text-encoder-cpu-offload`：对文本编码器推理使用 CPU 卸载。
- `--image-encoder-cpu-offload`：对图像编码器推理使用 CPU 卸载。
- `--vae-cpu-offload`：对 VAE 使用 CPU 卸载。
- `--pin-cpu-memory`：固定 CPU 卸载的内存。如果抛出"CUDA error: invalid argument"，仅作为临时解决方法添加。

## 5. 基准测试

测试环境：

- 硬件：NVIDIA B200 GPU (1x)
- 模型：Qwen/Qwen-Image-Edit-2511
- sglang diffusion 版本：0.5.6.post2

### 5.1 加速基准测试

#### 5.1.1 编辑图像

**服务器命令**：

```bash
sglang serve --model-path Qwen/Qwen-Image-Edit-2511 --port 30000
```

**基准测试命令**：

```bash
python3 -m sglang.multimodal_gen.benchmarks.bench_serving \
    --backend sglang-image --dataset vbench --task ti2i --num-prompts 1 --max-concurrency 1
```

**结果**：

```text
================= Serving Benchmark Result =================
Backend:                                 sglang-image
Model:                                   Qwen/Qwen-Image-Edit-2511
Dataset:                                 vbench
Task:                                    ti2i
--------------------------------------------------
Benchmark duration (s):                  35.31
Request rate:                            inf
Max request concurrency:                 1
Successful requests:                     1/1
--------------------------------------------------
Request throughput (req/s):              0.03
Latency Mean (s):                        35.3053
Latency Median (s):                      35.3053
Latency P99 (s):                         35.3053
--------------------------------------------------
Peak Memory Max (MB):                    47959.35
Peak Memory Mean (MB):                   47959.35
Peak Memory Median (MB):                 47959.35
============================================================
```
