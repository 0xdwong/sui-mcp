import { z } from 'zod';
import { McpBaseTool, McpToolResponse } from '../types.js';

export abstract class BaseTool<T = any> implements McpBaseTool<T> {
  abstract name: string;
  abstract description: string;
  abstract paramsSchema: z.ZodObject<any>;
  abstract cb(args: T): Promise<McpToolResponse>;

  protected createTextResponse(text: string): McpToolResponse {
    return {
      content: [
        {
          type: 'text',
          text,
        },
      ],
    };
  }
}
