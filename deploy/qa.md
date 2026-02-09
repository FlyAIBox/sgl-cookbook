
### **Q: 启动 sglang 服务时报错 `ImportError: libnuma.so.1 ...` 且无法加载 `sgl_kernel` 怎么办？**

**问题描述：**
在 H100 (SM90) 等 GPU 环境下运行 `python -m sglang.launch_server` 时，程序崩溃并出现以下错误堆栈：

```text
ImportError: libnuma.so.1: cannot open shared object file: No such file or directory
...
[sgl_kernel] CRITICAL: Could not load any common_ops library!

```

即使按照提示执行了 `pip install --upgrade sgl_kernel`，问题依然存在。

**原因分析：**
这是**操作系统层面**缺少必要的动态链接库导致的，与 Python 包本身的版本无关。
`sgl_kernel` 包含编译好的 C++ 扩展（`.so` 文件），在高性能 GPU 上进行非一致性内存访问（NUMA）优化时，依赖系统的 `libnuma` 库。许多精简版容器镜像（如某些 Docker 基础镜像）默认未安装此库。

**解决方案：**
请在终端中以 root 权限运行以下命令安装缺失的系统库：

```bash
# Ubuntu / Debian 系统
apt-get update
apt-get install -y libnuma1

# CentOS / RHEL 系统
# yum install -y numactl-libs

```

安装完成后，无需重新安装 Python 包，直接再次运行启动命令即可。