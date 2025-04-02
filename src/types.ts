import { z } from 'zod';

export type SuiNetwork = 'mainnet' | 'testnet' | 'devnet' | 'localnet';
export type SuiFaucetNetwork = Extract<SuiNetwork, 'testnet' | 'devnet' | 'localnet'>;

export const SUI_NETWORKS = ['mainnet', 'testnet', 'devnet', 'localnet'] as const;
export const SUI_FAUCET_NETWORKS = ['testnet', 'devnet', 'localnet'] as const;

export interface McpToolResponse {
  content: Array<{
    type: 'text';
    text?: string;
  }>;
}

export interface McpBaseTool<T = any> {
  name: string;
  description: string;
  paramsSchema: z.ZodSchema;
  cb: (args: T) => Promise<McpToolResponse>;
}
