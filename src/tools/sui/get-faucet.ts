import { z } from 'zod';
import { SuiFaucetNetwork, SUI_FAUCET_NETWORKS } from '../../types.js';
import { getFaucet } from '../../utils/faucet.js';

async function cb(args: { addresses: string[]; network: string }) {
  const promises = [];
  for (const address of args.addresses) {
    promises.push(getFaucet(address, args.network as SuiFaucetNetwork));
  }

  const getFaucetResults = await Promise.all(promises);
  const successAddresses = getFaucetResults.filter(result => result);
  const failedAddresses = getFaucetResults.filter(result => !result);
  const result = {
    successAddresses,
    failedAddresses,
  };

  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(result),
      },
    ],
  };
}

export const faucetTool = {
  name: 'faucet',
  description: 'Get faucet from sui networks',
  paramsSchema: z.object({
    addresses: z.array(z.string()),
    network: z.enum(SUI_FAUCET_NETWORKS).default('devnet'),
  }).shape,
  cb: cb,
};
