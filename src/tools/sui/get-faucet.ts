import { z } from 'zod';
import { SuiFaucetNetwork, SUI_FAUCET_NETWORKS } from '../../types.js';
import { getFaucet } from '../../utils/faucet.js';
import { BaseTool } from '../base.js';

const faucetParamsSchema = z.object({
  network: z.enum(SUI_FAUCET_NETWORKS).default('devnet'),
  addresses: z.array(z.string()),
});

type FaucetParams = z.output<typeof faucetParamsSchema>;

export class SuiFaucetTool extends BaseTool<FaucetParams> {
  name = 'faucet';
  description = 'Get faucet from sui networks';
  paramsSchema = faucetParamsSchema;

  async cb(args: FaucetParams) {
    const addresses = args.addresses.map(address => address.trim());

    const promises = [];
    for (const address of addresses) {
      promises.push(getFaucet(address, args.network as SuiFaucetNetwork));
    }

    const getFaucetResults = await Promise.all(promises);

    const result = {
      succeeds: addresses.filter((_, index) => getFaucetResults[index]),
      faileds: addresses.filter((_, index) => !getFaucetResults[index]),
    };

    return this.createTextResponse(JSON.stringify(result));
  }
}

export default new SuiFaucetTool();
