import { z } from 'zod';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { SuiNetwork, SUI_NETWORKS } from '../../types.js';
import { getBalanceInMist, convertMistToSui } from '../../utils/balance.js';

async function cb(args: { addresses: string[]; network: string }) {
  const addresses = args.addresses.map(address => address.trim());
  const suiClient = new SuiClient({ url: getFullnodeUrl(args.network as SuiNetwork) });

  const promises = [];
  for (const address of addresses) {
    promises.push(getBalanceInMist(address, suiClient));
  }

  const getBalanceResults = await Promise.all(promises);
  const balances = getBalanceResults.map((balanceInMist, index) => {
    if (balanceInMist === null) return null;
    const balanceInSui = convertMistToSui(balanceInMist);
    return {
      address: args.addresses[index],
      mist: balanceInMist.toString(),
      sui: balanceInSui.toString(),
    };
  });

  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(balances),
      },
    ],
  };
}

export const suiBalanceTool = {
  name: 'sui-balance',
  description: 'Get balance of an address from sui networks',
  paramsSchema: z.object({
    network: z.enum(SUI_NETWORKS).default('mainnet'),
    addresses: z.array(z.string()),
  }).shape,
  cb: cb,
};
