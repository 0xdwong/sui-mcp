import { z } from 'zod';
import { getKeypairFromMnemonic, getAccountInfoFromKeypair } from '../../utils/keypair.js';

async function cb(args: { mnemonic: string; num: number }) {
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

  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(result),
      },
    ],
  };
}

export default {
  name: 'gen_sui_accounts_by_mnemonic',
  description: 'Create SUI accounts from mnemonic(Not recommended for production)',
  paramsSchema: z.object({
    mnemonic: z.string(),
    num: z.number().default(1),
  }).shape,
  cb: cb,
};
