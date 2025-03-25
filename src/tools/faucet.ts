import { z } from 'zod';
import { getFullnodeUrl, SuiClient, CoinBalance } from '@mysten/sui/client';
import { getFaucetHost, requestSuiFromFaucetV1 } from '@mysten/sui/faucet';
import { MIST_PER_SUI } from '@mysten/sui/utils';

type SuiNetwork = 'testnet' | 'devnet' | 'localnet';

export async function getFaucet(
  address: string,
  network: SuiNetwork
): Promise<{ before: number; after: number } | null> {
  const suiClient = new SuiClient({ url: getFullnodeUrl(network) });

  // 获取领水前余额
  const balanceBefore = await suiClient.getBalance({
    owner: address,
  });

  // 领水
  const success = await _requestFaucet(address, network);
  if (!success) return null;

  // 等待 x 秒后再查询余额（测试网出块较慢）
  const waitSeconds = 9;
  await new Promise(resolve => {
    setTimeout(resolve, waitSeconds * 1000);
  });

  // 获取领水后余额
  const balanceAfter = await suiClient.getBalance({
    owner: address,
  });

  const balances = {
    before: _formatBalance(balanceBefore),
    after: _formatBalance(balanceAfter),
  };

  return balances;
}

async function _requestFaucet(address: string, network: SuiNetwork) {
  let success = false;
  try {
    await requestSuiFromFaucetV1({
      host: getFaucetHost(network),
      recipient: address,
    });
    success = true;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }

  return success;
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
    const balances = await getFaucet(args.address, args.network as SuiNetwork);

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
