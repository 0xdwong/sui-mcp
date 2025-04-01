import { z } from 'zod';
import { getRandomKeypair, getKeypairFromMnemonic } from '../utils/keypair.js';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import bip39 from 'bip39';
export function genRandomAccount() {
  const keypair = getRandomKeypair();

  const accountInfo = _getAccountInfoFromKeypair(keypair);

  return accountInfo;
}

export function genAccountFromMnemonic(mnemonic: string, num: number = 1) {
  const keypair = getKeypairFromMnemonic(mnemonic);

  const accountInfo = _getAccountInfoFromKeypair(keypair);

  return accountInfo;
}

export function genRandomMnemonic() {
  const mnemonic = bip39.generateMnemonic();

  return mnemonic;
}

function _getAccountInfoFromKeypair(keypair: Ed25519Keypair) {
  const publicKey = keypair.getPublicKey().toSuiPublicKey();
  const privateKey = keypair.getSecretKey();
  const address = keypair.toSuiAddress();

  return { publicKey, privateKey, address };
}

export const randomSuiAccountTool = {
  name: 'random-sui-account',
  description: 'Create random SUI account, do not use it in production.',
  paramsSchema: z.object({
    num: z.number().default(1),
  }).shape,
  cb: async (args: { num: number }) => {
    const accountInfos = [];
    for (let i = 0; i < args.num; i++) {
      const accountInfo = genRandomAccount();
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
  },
};
