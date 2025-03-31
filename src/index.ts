#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import tools from './tools/index.js';

// Create an MCP server
const server = new McpServer({
  name: 'Sui-mcp',
  version: '1.0.0',
});

const MCPTools = {
  faucet: tools.faucet,
  balance: tools.balance,
  sui: tools.sui,
};

for (const tool of Object.values(MCPTools)) {
  server.tool(tool.name, tool.description, tool.paramsSchema, tool.cb);
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MCP Server running on stdio');
}

main().catch(error => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
