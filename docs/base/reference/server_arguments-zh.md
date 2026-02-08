---
sidebar_position: 1
---

# 并行化配置指南

本指南说明 SGLang 模型配置中使用的并行化配置字段，以及它们如何映射到 SGLang 服务器命令行参数。

## 快速参考

| 配置字段 | SGLang CLI 参数 | 描述 |
|---|---|---|
| `tp` | `--tp-size`, `--tensor-parallel-size` | 张量并行 - 跨 GPU 分割模型 |
| `dp` | `--dp-size`, `--data-parallel-size` | 数据并行 - 运行多个模型副本 |
| `ep` | `--ep-size`, `--expert-parallel-size`, `--ep` | 专家并行 - 分布 MoE 专家 |
| `enable_dp_attention` | `--enable-dp-attention` | 注意力层使用 DP，FFN 使用 TP（混合） |
