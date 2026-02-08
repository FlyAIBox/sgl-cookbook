# SGLang 语言模型服务基准测试文档

`sglang.bench_serving` 是一个命令行工具，用于对大型语言模型（LLM）和视觉语言模型（VLM）的在线服务吞吐量和延迟进行基准测试。它支持多种后端（`SGLang`、`vLLM` 等），并为请求速率、数据集类型和性能分析提供灵活的配置。

## 1. 快速开始

### 基础用法（随机数据）

使用本地 SGLang 服务器运行随机生成提示的基准测试。

```bash
python -m sglang.bench_serving --backend sglang --port 30000 --dataset-name random --num-prompts 100
```

### 真实世界数据（ShareGPT）

使用 ShareGPT 数据集以特定请求速率运行基准测试。

```bash
python -m sglang.bench_serving \
  --backend sglang \
  --dataset-name sharegpt \
  --dataset-path ./ShareGPT_V3_unfiltered_cleaned_split.json \
  --num-prompts 1000 \
  --request-rate 10
```

## 2. 参数参考

### 2.1 后端和服务器配置

这些参数定义目标服务器和使用的推理引擎。

| 参数 | 描述 |
|---|---|
| `--backend` | **必需。**指定后端引擎。选项：`sglang`、`sglang-native`、`sglang-oai`、`sglang-oai-chat`、`vllm`、`vllm-chat`、`lmdeploy`、`lmdeploy-chat`、`trt`、`gserver`、`truss`。|
| `--base-url` | API 基础 URL（如果不使用特定的 host/port 标志）。|
| `--host` | 服务器主机名。默认：`0.0.0.0`。|
| `--port` | 服务器端口。如果未设置，则默认为特定后端的标准端口。|
| `--model` | 模型名称或路径。如果未设置，则查询 `/v1/models` 获取配置。|
| `--served-model-name` | API 请求正文中使用的模型名称。默认为 `--model` 的值。|
| `--tokenizer` | 分词器的路径或名称。默认为模型配置。|

### 2.2 数据集配置

控制用于基准测试的提示来源。

| 参数 | 描述 |
|---|---|
| `--dataset-name` | 数据集类型。选项：`sharegpt`、`custom`、`random`、`random-ids`、`generated-shared-prefix`、`mmmu`、`image`、`mooncake`。|
| `--dataset-path` | 数据集的文件路径（例如，ShareGPT 的本地 JSON 文件）。|
| `--num-prompts` | 要处理的提示总数。默认：`1000`。|
| `--seed` | 随机种子，用于可重现性。|
| `--tokenize-prompt` | 使用整数 ID 而不是字符串作为输入。对于精确长度控制很有用。|

### 2.3 输入/输出长度控制

控制请求形状（上下文长度和生成长度）的参数。

#### 对于随机/图像数据集：

- `--random-input-len`：每个请求的输入 token 数。
- `--random-output-len`：每个请求的输出 token 数。
- `--random-range-ratio`：采样输入/输出长度的范围比率。

#### 对于 ShareGPT 数据集：

- `--sharegpt-output-len`：覆盖数据集中为每个请求定义的输出长度。
- `--sharegpt-context-len`：最大上下文长度。超过此长度的请求将被丢弃。

#### 常规请求修饰符：

- `--extra-request-body`：向请求有效负载附加 JSON 对象（例如，\{\"key\": \"value\"\}）。对于传递采样参数很有用。
- `--prompt-suffix`：附加到所有用户提示的字符串后缀。
- `--disable-ignore-eos`：如果设置，模型将在遇到 EOS token 时停止生成（基准测试通常忽略 EOS 以强制最大生成长度）。
- `--apply-chat-template`：将模型的聊天模板应用于输入。

### 2.4 流量和并发

控制向服务器发送请求的速度。

| 参数 | 描述 |
|---|---|
| `--request-rate` | 每秒请求数（RPS）。如果为 `inf`（默认），则立即发送所有请求（突发）。否则，到达时间遵循泊松过程。|
| `--max-concurrency` | 一次允许的最大活动请求数。即使 `request-rate` 很高，如果达到此限制，客户端也会暂停请求。|
| `--warmup-requests` | 在实际测量开始前运行的请求数，用于预热服务器。|
| `--flush-cache` | 在开始基准测试之前刷新服务器缓存。|

### 2.5 输出和日志记录

| 参数 | 描述 |
|---|---|
| `--output-file` | 以 JSONL 格式保存结果的路径。|
| `--output-details` | 在输出中包含详细指标。|
| `--print-requests` | 在发送请求时将请求打印到 stdout（对调试有用）。|
| `--disable-tqdm` | 隐藏进度条。|
| `--disable-stream` | 禁用流式模式（等待完整响应）。|
| `--return-logprob` | 从服务器请求 logprobs。|
| `--tag` | 添加到输出文件以进行标识的任意字符串标签。|

### 2.6 高级功能

#### 2.6.1 图像/多模态

仅在 --dataset-name 设置为 image 时适用。

- `--image-count`：每个请求的图像数量。
- `--image-resolution`：分辨率（例如，1080p、4k 或自定义 1080x1920）。
- `--image-format`：jpeg 或 png。
- `--image-content`：random（噪声）或 blank。

#### 2.6.2 LoRA 基准测试

用于模拟多 LoRA 服务场景。

- `--lora-name`：LoRA 适配器名称列表（例如，`--lora-name` adapter1 adapter2）。
- `--lora-request-distribution`：请求如何分配给适配器：
  - `uniform`：相等概率。
  - `distinct`：每个请求使用新适配器。
  - `skewed`：遵循 Zipf 分布（模拟热/冷适配器）。
- `--lora-zipf-alpha`：Zipf 分布的 alpha 参数（如果使用 `skewed`）。

#### 2.6.3 性能分析

用于深度性能分析的工具。

- `--profile`：启用 Torch Profiler（需要在服务器上设置 `SGLANG_TORCH_PROFILER_DIR` 环境变量）。
- `--plot-throughput`：生成吞吐量/并发图（需要 `termplotlib` 和 `gnuplot`）。
- `--profile-activities`：要分析的活动（CPU、GPU、CUDA_PROFILER）。
- `--profile-num-steps`：要分析的步骤数。
- `--profile-by-stage` / `--profile-stages`：分析特定处理阶段。

#### 2.6.4 预填充-解码分离

用于基准测试预填充-解码（PD）分离架构。

- `--pd-separated`：启用 PD 分离基准测试。
- `--profile-prefill-url`：用于性能分析的预填充工作器的 URL。
- `--profile-decode-url`：用于性能分析的解码工作器的 URL。

<span style={{color:"red"}}>注意</span>：在 PD 模式下，必须分别分析 `prefill` 和 `decode`。

### 2.7 专用数据集

#### 2.7.1 生成的共享前缀（GSP）：

用于测试系统提示缓存/前缀共享性能。

- `--gsp-num-groups`：唯一系统提示的数量。
- `--gsp-prompts-per-group`：共享相同系统提示的用户问题数量。
- `--gsp-system-prompt-len`：共享前缀的长度。
- `--gsp-fast-prepare`：跳过一些统计计算以加快启动速度。

#### 2.7.2 Mooncake

用于跟踪重放。

- `--mooncake-slowdown-factor`：减慢跟踪重放速度（例如，2.0 = 慢 2 倍）。
- `--mooncake-num-rounds`：对话轮数（支持多轮）。
- `--use-trace-timestamps`：根据跟踪文件中的时间戳调度请求。

## 3. 指标

运行基准测试后，该工具通常会报告：

- `E2E`（端到端延迟）：从发送请求到接收最后一个 token 的总时间。
- `TTFT`（第一个 Token 时间）：从发送请求到看到第一个单词出现的时间。这代表预填充时间（处理图像和文本提示）。
- `TPOT`（每个输出 Token 时间）：生成一个 token（不包括第一个）的平均时间。这是按请求计算的。
- `ITL`（Token 间延迟）：两个不同流式数据包之间的时间间隔。虽然 TPOT 是一个平均值，但 ITL 测量流的"抖动"或平滑度。
