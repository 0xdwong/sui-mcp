# Sui MCP Tools

This is a MCP (Model Context Protocol) toolkit based on the Sui blockchain. The project provides functionality to interact with the Sui blockchain and integrates the MCP SDK to implement model context protocol features.

## 🚀 Features

- Developed with TypeScript for type safety
- Deep integration with Sui blockchain functionality
- Support for multiple network environments (testnet, devnet)
- Complete build scripts and development toolchain

## 📦 Installation & Configuration

There are two ways to install and configure Sui MCP Tools:

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

### 1. Testnet Faucet Tool

This tool is used to obtain test tokens on the Sui test network, with the following key features:

- ✨ Support for multiple network environments (testnet, devnet)
- 🔄 Automated acquisition process
- 🛡 Built-in error handling mechanism

### Usage Example

Claude

> request SUI for 0x9eb94b1c301505d188f1b97914208b31a5419b57b2a3571169ad2165d41c2ffa

### Check SUI balance Tool

This tool allows you to check SUI token balance for any address on the Sui network, with the following features:

- ✨ Support for multiple network environments (mainnet, testnet, devnet, localnet)
- 🔄 Real-time balance querying
- 🔢 Accurate balance conversion from MIST to SUI

### Usage Example

Claude

> check SUI balance for 0x9eb94b1c301505d188f1b97914208b31a5419b57b2a3571169ad2165d41c2ffa

## 📚 Documentation

- [Sui Developer Documentation](https://docs.sui.io/)
- [MCP Protocol Documentation](https://modelcontextprotocol.io/)
