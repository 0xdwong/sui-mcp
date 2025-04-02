import { z } from 'zod';
import {
  genRandomMnemonic,
  getKeypairFromMnemonic,
  getAccountInfoFromKeypair,
} from '../../utils/keypair.js';
import { BaseTool } from '../base.js';

const randomAccountParamsSchema = z.object({
  num: z.number().default(1),
});

type RandomAccountParams = z.output<typeof randomAccountParamsSchema>;

export class RandomSuiAccountTool extends BaseTool<RandomAccountParams> {
  name = 'random-sui-account';
  description = 'Create random SUI account, do not use it in production.';
  paramsSchema = randomAccountParamsSchema;

  async cb(args: RandomAccountParams) {
    const accountInfos = [];
    const mnemonic = genRandomMnemonic();

    for (let i = 0; i < args.num; i++) {
      const keypair = getKeypairFromMnemonic(mnemonic, i);
      const accountInfo = getAccountInfoFromKeypair(keypair);
      accountInfos.push(accountInfo);
    }

    return this.createTextResponse(JSON.stringify(accountInfos));
  }
}

export default new RandomSuiAccountTool();
