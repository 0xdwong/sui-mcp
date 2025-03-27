# MCP Sui Tools

This is a MCP (Model Context Protocol) toolkit based on the Sui blockchain. The project provides functionality to interact with the Sui blockchain and integrates the MCP SDK to implement model context protocol features.

## 🚀 Features

- Developed with TypeScript for type safety
- Deep integration with Sui blockchain functionality
- Support for multiple network environments (testnet, devnet)
- Complete build scripts and development toolchain

## 📦 Installation

```bash
# Install dependencies using yarn
yarn install
```

## 🔨 Build

```bash
# Build the project
yarn build
```

## Configure MCP Server

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

## 🛠 Available Tools

### 1. Testnet Faucet Tool

This tool is used to obtain test tokens on the Sui test network, with the following key features:

- ✨ Support for multiple network environments (testnet, devnet)
- 🔄 Automated acquisition process
- 🛡 Built-in error handling mechanism

### Usage Example

Claude

> request SUI for 0x9eb94b1c301505d188f1b97914208b31a5419b57b2a3571169ad2165d41c2ffa

## 📚 Documentation

- [Sui Developer Documentation](https://docs.sui.io/)
- [MCP Protocol Documentation](https://modelcontextprotocol.io/)
