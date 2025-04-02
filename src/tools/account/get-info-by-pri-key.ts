import { z } from 'zod';
import { getKeypairFromPrivateKey } from '../../utils/keypair.js';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

async function cb(args: { privateKey: string }) {
  if (!args.privateKey) {
    throw new Error('Private key is required');
  }

  const keypair = getKeypairFromPrivateKey(args.privateKey) as Ed25519Keypair;
  const publicKey = keypair.getPublicKey().toSuiPublicKey();
  const privateKey = keypair.getSecretKey();
  const address = keypair.toSuiAddress();

  const accountInfo = {
    publicKey,
    privateKey,
    address,
  };

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(accountInfo),
      },
    ],
  };
}

export default {
  name: 'get_account_info_by_private_key',
  description: 'Get account info by private key',
  paramsSchema: z.object({
    privateKey: z.string(),
  }).shape,
  cb: cb,
};
