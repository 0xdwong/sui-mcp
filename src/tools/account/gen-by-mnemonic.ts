import { z } from 'zod';
import { getKeypairFromMnemonic, getAccountInfoFromKeypair } from '../../utils/keypair.js';
import { BaseTool } from '../base.js';

const genByMnemonicParamsSchema = z.object({
  mnemonic: z.string(),
  num: z.number().default(1),
});

type GenByMnemonicParams = z.output<typeof genByMnemonicParamsSchema>;

export class GenSuiAccountsByMnemonicTool extends BaseTool<GenByMnemonicParams> {
  name = 'gen_sui_accounts_by_mnemonic';
  description = 'Create SUI accounts from mnemonic(Not recommended for production)';
  paramsSchema = genByMnemonicParamsSchema;

  async cb(args: GenByMnemonicParams) {
    if (!args.mnemonic) {
      throw new Error('Mnemonic is required');
    }

    const { mnemonic, num } = args;
    const accountInfos = [];
    for (let i = 0; i < num; i++) {
      const keypair = getKeypairFromMnemonic(mnemonic, i);
      const accountInfo = getAccountInfoFromKeypair(keypair);
      accountInfos.push(accountInfo);
    }

    const result = {
      mnemonic: mnemonic,
      accounts: accountInfos,
    };

    return this.createTextResponse(JSON.stringify(result));
  }
}

export default new GenSuiAccountsByMnemonicTool();
