import { z } from 'zod';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { SUI_NETWORKS } from '../../types.js';
import { getBalanceInMist, convertMistToSui } from '../../utils/balance.js';
import { BaseTool } from '../base.js';

const balanceParamsSchema = z.object({
  network: z.enum(SUI_NETWORKS).default('mainnet'),
  addresses: z.array(z.string()),
});

type BalanceParams = z.output<typeof balanceParamsSchema>;

export class SuiBalanceTool extends BaseTool<BalanceParams> {
  name = 'sui-balance';
  description = 'Get balance of an address from sui networks';
  paramsSchema = balanceParamsSchema;

  async cb(args: BalanceParams, suiClient: SuiClient | null = null) {
    const addresses = args.addresses.map(address => address.trim());
    const client = suiClient ?? new SuiClient({ url: getFullnodeUrl(args.network) });

    const promises = [];
    for (const address of addresses) {
      promises.push(getBalanceInMist(address, client));
    }

    const getBalanceResults = await Promise.all(promises);
    const balances = getBalanceResults.map((balanceInMist, index) => {
      if (balanceInMist === null) return null;

      const balanceInSui = convertMistToSui(balanceInMist);
      return {
        address: addresses[index],
        mist: balanceInMist.toString(),
        sui: balanceInSui.toString(),
      };
    });

    return this.createTextResponse(JSON.stringify(balances));
  }
}

export default new SuiBalanceTool();
