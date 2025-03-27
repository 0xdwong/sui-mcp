import { z } from 'zod';
import { getFullnodeUrl, SuiClient, CoinBalance } from '@mysten/sui/client';
import { getFaucetHost, requestSuiFromFaucetV1 } from '@mysten/sui/faucet';
import { MIST_PER_SUI } from '@mysten/sui/utils';

type SuiNetwork = 'testnet' | 'devnet' | 'localnet';

export async function getFaucet(
  address: string,
  network: SuiNetwork,
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
    before: _formatBalance(balanceBefore),
    after: _formatBalance(balanceAfter),
  };

  return balances;
}

const _formatBalance = (balance: CoinBalance) => {
  return Number.parseInt(balance.totalBalance) / Number(MIST_PER_SUI);
};

export const faucetTool = {
  name: 'faucet',
  description: 'Get faucet from sui networks',
  paramsSchema: z.object({
    address: z.string(),
    network: z.enum(['testnet', 'devnet', 'localnet'] as const).default('devnet'),
  }).shape,
  cb: async (args: { address: string; network: string }) => {
    const suiClient = new SuiClient({ url: getFullnodeUrl(args.network as SuiNetwork) });
    const balances = await getFaucet(args.address, args.network as SuiNetwork, suiClient);

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
