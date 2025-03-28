# Sui MCP Tools

这是一个基于 Sui 区块链的 MCP（Model Context Protocol）工具集。该项目提供了与 Sui 区块链交互的功能，并集成了 MCP SDK 来实现模型上下文协议的功能。

## 🚀 项目特点

- 基于 TypeScript 开发，提供类型安全
- 深度集成 Sui 区块链功能
- 支持多网络环境（测试网、开发网）
- 提供完整的构建脚本和开发工具链

## 📦 安装与配置

Sui MCP Tools 提供两种安装和配置方式：

### 方式一：使用 npx（推荐）

这是最简单的方式 - 只需在 Claude Desktop 配置文件中添加以下配置：

```json
{
  "mcpServers": {
    "sui-tools": {
      "command": "npx",
      "args": ["-y", "sui-mcp@latest"]
    }
  }
}
```

### 方式二：本地构建

1. 克隆代码并安装依赖：
```bash
git clone https://github.com/0xdwong/sui-mcp.git
cd sui-mcp
yarn install
```

2. 构建项目：
```bash
yarn build
```

3. 配置 Claude Desktop，指向本地构建文件：
```json
{
  "mcpServers": {
    "sui-tools": {
      "command": "node",
      "args": ["<absolute-path-to-your-project>/build/index.js"]
    }
  }
}
```

### 配置文件位置

Claude Desktop 配置文件位置：
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`

你可以通过 Claude Desktop 访问此文件：Claude > Settings > Developer > Edit Config

重新启动 Claude Desktop 以使更改生效。

## 🛠 可用工具

### 1. 测试网领水工具

该工具用于在 Sui 测试网络上获取测试代币，主要特点：

- ✨ 支持多网络环境（testnet、devnet）
- 🔄 自动化获取流程
- 🛡 内置错误处理机制

### 使用示例

> 请求测试币 0x9eb94b1c301505d188f1b97914208b31a5419b57b2a3571169ad2165d41c2ffa


### 2. 余额查询工具

该工具用于查询任意地址在 Sui 网络上的代币余额，主要特点：

- ✨ 支持多网络环境（主网、测试网、开发网、本地网）
- 🔄 实时余额查询
- 🔢 精确的 MIST 到 SUI 单位转换

### 使用示例

Claude

> 检查 SUI 余额 0x9eb94b1c301505d188f1b97914208b31a5419b57b2a3571169ad2165d41c2ffa




## 📚 相关文档

- [Sui 开发者文档](https://docs.sui.io/)
- [MCP 协议文档](https://modelcontextprotocol.io/)
