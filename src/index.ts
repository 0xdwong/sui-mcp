#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import tools from './tools/index.js';

// Create an MCP server
const server = new McpServer({
  name: 'Sui-mcp',
  version: '1.0.0',
});

for (const tool of tools) {
  const schema = tool.paramsSchema as z.ZodObject<any>;
  const cb = ((args: any) => tool.cb(args)) as any;
  server.tool(tool.name, tool.description, schema.shape, cb);
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
