import { z } from 'zod';
import { getFullnodeUrl, SuiClient, CoinBalance } from '@mysten/sui/client';
import { getFaucetHost, requestSuiFromFaucetV1 } from '@mysten/sui/faucet';
import { SuiFaucetNetwork, SUI_FAUCET_NETWORKS } from '../types.js';
import { convertBalanceFromMistToSui } from '../utils/balance.js';

export async function getFaucet(
  address: string,
  network: SuiFaucetNetwork,
  client: SuiClient
): Promise<{ before: number; after: number } | null> {
  let balanceBefore: CoinBalance;
  let balanceAfter: CoinBalance;

  try {
    // Get balance before faucet request
    balanceBefore = await client.getBalance({
      owner: address,
    });
  } catch (error) {
    console.error('Failed to get initial balance:', error);
    return null;
  }

  // Request faucet
  try {
    const response = await requestSuiFromFaucetV1({
      host: getFaucetHost(network),
      recipient: address,
    });

    // Check if response is valid
    if (!response || response.error) {
      console.error('Invalid response from faucet:', response?.error || 'No response');
      return null;
    }
  } catch (error) {
    console.error('Faucet request failed:', error);
    return null;
  }

  // Wait for x seconds before querying balance (testnet block time is slow)
  const waitSeconds = 9;
  await new Promise(resolve => setTimeout(resolve, waitSeconds * 1000));

  try {
    // Get balance after faucet request
    balanceAfter = await client.getBalance({
      owner: address,
    });
  } catch (error) {
    console.error('Failed to get final balance:', error);
    return null;
  }

  const balances = {
    before: convertBalanceFromMistToSui(balanceBefore),
    after: convertBalanceFromMistToSui(balanceAfter),
  };

  return balances;
}

export const faucetTool = {
  name: 'faucet',
  description: 'Get faucet from sui networks',
  paramsSchema: z.object({
    address: z.string(),
    network: z.enum(SUI_FAUCET_NETWORKS).default('devnet'),
  }).shape,
  cb: async (args: { address: string; network: string }) => {
    const suiClient = new SuiClient({ url: getFullnodeUrl(args.network as SuiFaucetNetwork) });
    const balances = await getFaucet(args.address, args.network as SuiFaucetNetwork, suiClient);

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(balances),
        },
      ],
    };
  },
};
