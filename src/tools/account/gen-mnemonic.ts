import { z } from 'zod';
import { genRandomMnemonic } from '../../utils/keypair.js';
import { BaseTool } from '../base.js';

const mnemonicParamsSchema = z.object({
  num: z.number().default(1),
});

type MnemonicParams = z.output<typeof mnemonicParamsSchema>;

export class GenMnemonicTool extends BaseTool<MnemonicParams> {
  name = 'gen_mnemonic';
  description = 'Generate mnemonic(Not recommended for production)';
  paramsSchema = mnemonicParamsSchema;

  async cb(args: MnemonicParams) {
    const mnemonics = [];
    for (let i = 0; i < args.num; i++) {
      const mnemonic = genRandomMnemonic();
      mnemonics.push(mnemonic);
    }

    return this.createTextResponse(JSON.stringify(mnemonics));
  }
}

export default new GenMnemonicTool();
