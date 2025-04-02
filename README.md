# Sui MCP Tools

[![smithery badge](https://smithery.ai/badge/@0xdwong/sui-mcp)](https://smithery.ai/server/@0xdwong/sui-mcp)

This is a MCP (Model Context Protocol) toolkit based on the Sui blockchain. The project provides functionality to interact with the Sui blockchain and integrates the MCP SDK to implement model context protocol features.

## 🚀 Features

- Developed with TypeScript for type safety
- Deep integration with Sui blockchain functionality
- Support for multiple network environments (testnet, devnet)
- Complete build scripts and development toolchain

## 📦 Installation & Configuration

There are two ways to install and configure Sui MCP Tools:

### Installing via Smithery

To install Sui Tools for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@0xdwong/sui-mcp):

```bash
npx -y @smithery/cli install @0xdwong/sui-mcp --client claude
```

### Method 1: Using npx (Recommended)

This is the simplest way - just add the following configuration to your Claude Desktop config file:

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

### Method 2: Local Build

1. Clone and install dependencies:

```bash
git clone https://github.com/0xdwong/sui-mcp.git
cd sui-mcp
yarn install
```

2. Build the project:

```bash
yarn build
```

3. Configure Claude Desktop with your local build:

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

### Configuration Location

The Claude Desktop configuration file is located at:

- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`

You can access this file via Claude Desktop: Claude > Settings > Developer > Edit Config

Restart Claude Desktop for the changes to take effect.

## 🛠 Available Tools

- Testnet Faucet

  > eg: request SUI for 0x9eb94b1c301505d188f1b97914208b31a5419b57b2a3571169ad2165d41c2ffa

- Check SUI balance

  > eg: check SUI balance for 0x9eb94b1c301505d188f1b97914208b31a5419b57b2a3571169ad2165d41c2ffa

- Transfer SUI

  > eg: transfer 1 SUI to 0x9eb94b1c301505d188f1b97914208b31a5419b57b2a3571169ad2165d41c2ffa

## 📚 Documentation

- [Sui Developer Documentation](https://docs.sui.io/)
- [MCP Protocol Documentation](https://modelcontextprotocol.io/)
