# SpecBundle

![specbundle logo](/img/benchmarks/specbundle-logo.png)

## 关于 SpecBundle

推测性解码，特别是 EAGLE3，提供了强大的理论保证以及 token 接受率和端到端推理速度的一致性改进。然而，尽管有这些进展，推测性解码——尤其是 EAGLE3——在开源生态系统中的采用仍然有限，主要是由于三个关键因素。

1. 缺乏生产级训练基础设施：现有的推测性解码工具链主要是研究原型，系统级优化有限，对不同架构和大规模模型的支持不足。
2. 缺乏高质量草稿模型：有效的推测性解码依赖于强大的草稿模型，但公开可用的与 EAGLE3 兼容的检查点极其有限，主要来自原作者。
3. 现有草稿模型的训练规模不足：大多数可用的草稿模型是在小型或精选数据集上训练的，无法推广到现代 LLM 训练中使用的大型多样化语料库，导致 token 接受率低和实际加速效果减弱。

**SpecBundle** 是对这些限制的直接回应。由开源社区和产业合作伙伴（包括**蚂蚁集团**、**美团**、**Nex-AGI** 和 **EigenAI**）共同推动，**SpecBundle** 代表了**首个开源倡议**，旨在通过为主流开源 LLM 提供高性能、生产级 EAGLE3 草稿模型权重来推动推测性解码的民主化。该倡议还通过多个规模和架构验证了 [**SpecForge**](https://github.com/sgl-project/SpecForge) 框架的稳健性。

## 安装

```bash
git clone https://github.com/sgl-project/SpecForge.git
```

## 使用方法

### 使用 SpecBundle 模型启动 SGLang 服务器

您可以使用以下命令启动配备 SpecBundle 模型的 SGLang 服务器。遇到内存问题时，请添加 `--tp`、`--ep` 和 `--mem-fraction-static` 参数。

```bash
python3 -m sglang.launch_server \
    --model <target-model-path> \
    --speculative-algorithm EAGLE3 \
    --speculative-draft-model-path <draft-model-path> \
    --speculative-num-steps 3 \
    --speculative-eagle-topk 1 \
    --speculative-num-draft-tokens 4
```

例如：

```bash
SGLANG_ALLOW_OVERWRITE_LONGER_CONTEXT_LEN=1 python3 -m sglang.launch_server \
    --model Qwen/Qwen3-30B-A3B-Instruct-2507 \
    --speculative-algorithm EAGLE3 \
    --speculative-draft-model-path lmsys/SGLang-EAGLE3-Qwen3-30B-A3B-Instruct-2507-SpecForge-Nex \
    --speculative-num-steps 3 \
    --speculative-eagle-topk 1 \
    --speculative-num-draft-tokens 4 \
    --tp 4
```

### 使用 SpecBundle 比较推测性解码草稿模型的性能

我们提供了一个基准测试套件来评估 SpecBundle 草稿模型的性能，[点击这里](https://github.com/sgl-project/SpecForge/tree/main/benchmarks)。

#### 示例：

1. 启动 SGLang 服务器

```bash
SGLANG_ALLOW_OVERWRITE_LONGER_CONTEXT_LEN=1 python3 -m sglang.launch_server \
    --model Qwen/Qwen3-30B-A3B-Instruct-2507 \
    --speculative-algorithm EAGLE3 \
    --speculative-draft-model-path lmsys/SGLang-EAGLE3-Qwen3-30B-A3B-Instruct-2507-SpecForge-Nex \
    --speculative-num-steps 3 \
    --speculative-eagle-topk 1 \
    --speculative-num-draft-tokens 4 \
    --tp 4
```

2. 使用基准测试套件评估 SpecBundle 草稿模型的性能

`bench_eagle3.py` 可以帮助您并发启动 SGLang 服务器进程和基准测试进程。这样，您不必手动启动 SGLang 服务器，该脚本将在不同的推测性解码配置下手动处理 SGLang 启动。一些重要参数包括：

- `--model-path`：目标模型的路径。
- `--speculative-draft-model-path`：草稿模型的路径。
- `--port`：启动 SGLang 服务器的端口。
- `--trust-remote-code`：信任远程代码。
- `--mem-fraction-static`：静态内存的内存分数。
- `--tp-size`：张量并行大小。
- `--attention-backend`：注意力后端。
- `--config-list`：要测试的推测性解码配置列表，格式为 `<batch-size>,<num-steps>,<topk>,<num-draft-tokens>`。
- `--benchmark-list`：要测试的基准测试列表，格式为 `<benchmark-name>:<num-prompts>:<subset>`。

```bash
cd SpecForge/benchmarks
python bench_eagle3.py \
    --model-path Qwen/Qwen3-30B-A3B-Instruct-2507 \
    --port 30000 \
    --config-list 1,3,1,4 \
    --benchmark-list mtbench:5 gsm8k:100 \
    --skip-launch-server
```

**交互式命令生成器**：使用下方的配置选择器，自动生成适合您模型和基准测试的测试命令。

import SpecBundleConfigGenerator from '@site/src/components/specbundle/SpecBundleConfigGenerator';

<SpecBundleConfigGenerator />

它将生成一个 json 文件，内容如下所示：

```json
{
  "mtbench": [
    {
      "batch_size": 1,
      "steps": null,
      "topk": null,
      "num_draft_tokens": null,
      "metrics": [
        {
          "latency": 12.232808108034078,
          "output_throughput": 319.71399906382845,
          "accept_length": 2.170366259711432,
          "accuracy": null,
          "num_questions": 5,
          "num_valid_predictions": 0,
          "categorical_performance": null
        }
      ],
      "num_samples": 5
    }
  ],
  "gsm8k": [
    {
      "batch_size": 1,
      "steps": null,
      "topk": null,
      "num_draft_tokens": null,
      "metrics": [
        {
          "latency": 37.42077191895805,
          "output_throughput": 373.6160234823207,
          "accept_length": 2.643410852713178,
          "accuracy": 0.96,
          "num_questions": 100,
          "num_valid_predictions": 100,
          "categorical_performance": null
        }
      ],
      "num_samples": 100
    }
  ]
}
```

## 性能评分

我们在各种基准测试上评估 SpecBundle 草稿模型的性能，请访问[性能仪表板](https://docs.sglang.io/SpecForge/SpecBundle/index.html)了解更多详情。
