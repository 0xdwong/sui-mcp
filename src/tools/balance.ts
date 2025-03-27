import { z } from 'zod';
import { getFullnodeUrl, SuiClient, CoinBalance } from '@mysten/sui/client';
import { SuiNetwork } from '../types.js';
import { convertBalanceFromMistToSui } from '../utils/balance.js';

export async function getBalance(address: string, client: SuiClient): Promise<number | null> {
  let balanceBefore: CoinBalance;

  try {
    // Get balance for the address
    balanceBefore = await client.getBalance({
      owner: address,
    });
  } catch (error) {
    console.error('Failed to get initial balance:', error);
    return null;
  }

  const balance = convertBalanceFromMistToSui(balanceBefore);

  return balance;
}

export const balanceTool = {
  name: 'balance',
  description: 'Get balance of an address from sui networks',
  paramsSchema: z.object({
    address: z.string(),
    network: z.enum(['testnet', 'devnet', 'localnet'] as const).default('devnet'),
  }).shape,
  cb: async (args: { address: string; network: string }) => {
    const suiClient = new SuiClient({ url: getFullnodeUrl(args.network as SuiNetwork) });
    const balance = await getBalance(args.address, suiClient);

    return {
      content: [
        {
          type: 'text' as const,
          text: balance,
        },
      ],
    };
  },
};
