import { z } from 'zod';
import { SuiFaucetNetwork, SUI_FAUCET_NETWORKS } from '../../types.js';
import { getFaucet } from '../../utils/faucet.js';

async function cb(args: { addresses: string[]; network: string }) {
  const addresses = args.addresses.map(address => address.trim());

  const promises = [];
  for (const address of addresses) {
    promises.push(getFaucet(address, args.network as SuiFaucetNetwork));
  }

  const getFaucetResults = await Promise.all(promises);
  const successAddresses = addresses.filter((address, index) => getFaucetResults[index]);
  const failedAddresses = addresses.filter((address, index) => !getFaucetResults[index]);
  const result = {
    succeeds: successAddresses,
    faileds: failedAddresses,
  };

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result),
      },
    ],
  };
}

export default {
  name: 'faucet',
  description: 'Get faucet from sui networks',
  paramsSchema: z.object({
    network: z.enum(SUI_FAUCET_NETWORKS).default('devnet'),
    addresses: z.array(z.string()),
  }).shape,
  cb: cb,
};
