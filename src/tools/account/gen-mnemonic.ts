import { z } from 'zod';
import { genRandomMnemonic } from '../../utils/keypair.js';
async function cb(args: { num: number }) {
  const mnemonics = [];
  for (let i = 0; i < args.num; i++) {
    const mnemonic = genRandomMnemonic();
    mnemonics.push(mnemonic);
  }

  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(mnemonics),
      },
    ],
  };
}

export default {
  name: 'gen_mnemonic',
  description: 'Generate mnemonic(Not recommended for production)',
  paramsSchema: z.object({
    num: z.number().default(1),
  }).shape,
  cb: cb,
};
