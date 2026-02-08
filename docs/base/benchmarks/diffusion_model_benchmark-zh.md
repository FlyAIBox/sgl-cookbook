# SGLang 扩散模型服务基准测试文档

`sglang.multimodal_gen.benchmarks.bench_serving` 是一个命令行工具，用于对扩散模型的在线服务吞吐量和延迟进行基准测试。它支持两种后端（`sglang-image`、`sglang-video`），并为请求速率、数据集类型和性能分析提供灵活的配置。

## 1. 快速开始

### 1.1 低并发基准测试

在本地服务器（端口 30000）上运行基准测试，从 `vbench` 数据集生成 1 个视频/图像。

```bash
# 文本生成视频：如 Wan2.2-T2V-A14B-Diffusers
python3 -m sglang.multimodal_gen.benchmarks.bench_serving \
    --backend sglang-video --dataset vbench --task t2v --num-prompts 1 --max-concurrency 1

# 图像生成视频：如 Wan2.2-I2V-A14B-Diffusers
python3 -m sglang.multimodal_gen.benchmarks.bench_serving \
    --backend sglang-video --dataset vbench --task i2v --num-prompts 1 --max-concurrency 1

# 图像-文本生成视频：如 Wan2.2-TI2V-5B-Diffusers
python3 -m sglang.multimodal_gen.benchmarks.bench_serving \
    --backend sglang-video --dataset vbench --task ti2v --num-prompts 1 --max-concurrency 1

# 文本生成图像：如 Qwen-Image
python3 -m sglang.multimodal_gen.benchmarks.bench_serving \
    --backend sglang-image --dataset vbench --task t2i --num-prompts 1 --max-concurrency 1

# 图像-文本生成图像：如 Qwen-Image-Edit
python3 -m sglang.multimodal_gen.benchmarks.bench_serving \
    --backend sglang-image --dataset vbench --task ti2i --num-prompts 1 --max-concurrency 1
```

### 1.2 高并发基准测试

在本地服务器（端口 30000）上运行基准测试，从 `vbench` 数据集生成 20 个视频/图像。

```bash
# 文本生成视频：如 Wan2.2-T2V-A14B-Diffusers
python3 -m sglang.multimodal_gen.benchmarks.bench_serving \
    --backend sglang-video --dataset vbench --task t2v --num-prompts 20 --max-concurrency 20

# 图像生成视频：如 Wan2.2-I2V-A14B-Diffusers
python3 -m sglang.multimodal_gen.benchmarks.bench_serving \
    --backend sglang-video --dataset vbench --task i2v --num-prompts 20 --max-concurrency 20

# 图像-文本生成视频：如 Wan2.2-TI2V-5B-Diffusers
python3 -m sglang.multimodal_gen.benchmarks.bench_serving \
    --backend sglang-video --dataset vbench --task ti2v --num-prompts 20 --max-concurrency 20

# 文本生成图像：如 Qwen-Image
python3 -m sglang.multimodal_gen.benchmarks.bench_serving \
    --backend sglang-image --dataset vbench --task t2i --num-prompts 20 --max-concurrency 20

# 图像-文本生成图像：如 Qwen-Image-Edit
python3 -m sglang.multimodal_gen.benchmarks.bench_serving \
    --backend sglang-image --dataset vbench --task ti2i --num-prompts 20 --max-concurrency 20
```

## 2参数参考

### 2.1 连接和后端设置

| 参数 | 默认值 | 描述 |
|---|---|---|
| `--backend` | **必需** | 要使用的后端类型。选项：`sglang-image`、`sglang-video`。|
| `--base-url` | `None` | 服务器的基础 URL（例如，`http://localhost:30000`）。如果指定，这将覆盖 `--host` 和 `--port`。|
| `--host` | `None` | 服务器主机（例如，`127.0.0.1`）。|
| `--port` | `None` | 服务器端口。|
| `--model` | `None` | 模型名称或路径。|

### 2.2 工作负载和任务配置

| 参数 | 选项 | 描述 |
|---|---|---|
| `--task` | `t2v`, `i2v`, `ti2v`, `t2i`, `ti2i` | 定义生成任务：<br />• `t2v`：文本生成视频<br />• `i2v`：图像生成视频<br />• `ti2v`：文本+图像生成视频<br />• `t2i`：文本生成图像<br />• `ti2i`：文本+图像生成图像 |
| `--dataset` | `vbench`, `random` | 提示/输入的来源。|
| `--dataset-path` | `None` | （可选）如果不使用内置预设，则为本地数据集文件的路径。|
| `--num-prompts` | `None` | 基准测试期间要执行的提示/请求总数。|

### 2.3 生成参数

| 参数 | 描述 |
|---|---|
| `--width` | 生成的图像或视频的目标宽度。|
| `--height` | 生成的图像或视频的目标高度。|
| `--num-frames` | 要生成的帧数（特定于视频后端）。|
| `--fps` | 每秒帧数配置（特定于视频后端）。|

### 2.4 并发和负载控制

| 参数 | 描述 |
|---|---|
| `--request-rate` | 每秒发起的请求数。<br />• 如果设置为 `inf`，所有请求立即发送（突发）。<br />• 如果设置为一个数字，请求到达时间遵循泊松过程。|
| `--max-concurrency` | 允许同时执行的最大请求数。这模拟信号量或上游限制。即使 `request-rate` 很高，实际处理速率也受此值限制。|

### 2.5 日志记录和输出

| 参数 | 描述 |
|---|---|
| `--output-file` | 保存基准测试指标的路径（JSON 格式）。|
| `--disable-tqdm` | 如果设置，在控制台中禁用进度条。|

## 3. 指标

- `Request Throughput`（req/s）、Output Throughput（tok/s）
- `Latency Mean`（ms）：每步的时间
- `Peak Memory Max`（ms）：运行期间的最大内存使用量
