# MCP Sui Tools

这是一个基于 Sui 区块链的 MCP（Model Context Protocol）工具集。该项目提供了与 Sui 区块链交互的功能，并集成了 MCP SDK 来实现模型上下文协议的功能。

## 🚀 项目特点

- 基于 TypeScript 开发，提供类型安全
- 深度集成 Sui 区块链功能
- 支持多网络环境（测试网、开发网）
- 提供完整的构建脚本和开发工具链

## 📦 安装

```bash
# 使用 yarn 安装依赖
yarn install
```

## 🔨 构建

```bash
# 构建项目
yarn build
```

## 配置 MCP 服务器

### To add this MCP server to Claude Desktop:

1. Create or edit the Claude Desktop configuration file at:

   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
   - Linux: `~/.config/Claude/claude_desktop_config.json`

You can easily access this file via the Claude Desktop app by navigating to Claude > Settings > Developer > Edit Config.

2. Add the following configuration:

   ```json
   {
     "sui-tools": {
       "command": "node",
       "args": ["absolute-path-to-build.js"]
     }
   }
   ```

3. Restart Claude Desktop for the changes to take effect.

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
