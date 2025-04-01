import { z } from 'zod';
import {
  genRandomMnemonic,
  getKeypairFromMnemonic,
  getAccountInfoFromKeypair,
} from '../../utils/keypair.js';

async function cb(args: { num: number }) {
  const accountInfos = [];
  const mnemonic = genRandomMnemonic();

  for (let i = 0; i < args.num; i++) {
    const keypair = getKeypairFromMnemonic(mnemonic, i);

    const accountInfo = getAccountInfoFromKeypair(keypair);

    accountInfos.push(accountInfo);
  }

  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(accountInfos),
      },
    ],
  };
}

export default {
  name: 'random-sui-account',
  description: 'Create random SUI account, do not use it in production.',
  paramsSchema: z.object({
    num: z.number().default(1),
  }).shape,
  cb: cb,
};
