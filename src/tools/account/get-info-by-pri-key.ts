import { z } from 'zod';
import { getKeypairFromPrivateKey } from '../../utils/keypair.js';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { BaseTool } from '../base.js';

const getInfoByPrivateKeyParamsSchema = z.object({
  privateKey: z.string(),
});

type GetInfoByPrivateKeyParams = z.output<typeof getInfoByPrivateKeyParamsSchema>;

export class GetAccountInfoByPrivateKeyTool extends BaseTool<GetInfoByPrivateKeyParams> {
  name = 'get_account_info_by_private_key';
  description = 'Get account info by private key';
  paramsSchema = getInfoByPrivateKeyParamsSchema;

  async cb(args: GetInfoByPrivateKeyParams) {
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

    return this.createTextResponse(JSON.stringify(accountInfo));
  }
}

export default new GetAccountInfoByPrivateKeyTool();
