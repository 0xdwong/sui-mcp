import { z } from 'zod';
import { getKeypairFromPrivateKey } from '../../utils/keypair.js';
import { config } from '../../config.js';
import { Keypair } from '@mysten/sui/cryptography';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { SuiNetwork, SUI_NETWORKS } from '../../types.js';
import { batchTransferSUI } from '../../utils/sui.js';

async function cb(args: { network: string; amounts: number[]; recipients: string[] }) {
  const network = args.network as SuiNetwork;
  const amounts = args.amounts.map((amount: number) => BigInt(amount));
  const recipients = args.recipients;

  if (!config.sui.privateKey) throw new Error('Missing private key, please set it in config');
  const sender = getKeypairFromPrivateKey(config.sui.privateKey) as Keypair;
  if (!sender) throw new Error('Invalid private key, please check your config');

  const suiClient = new SuiClient({ url: getFullnodeUrl(network) });

  let digest = '';
  let errMsg = '';
  try {
    digest = await batchTransferSUI(amounts, recipients, sender, suiClient);
  } catch (error) {
    errMsg = error as string;
  }

  return {
    content: [
      {
        type: 'text' as const,
        text: `Transfer ${digest ? 'successful' : 'failed'}: digest: '${digest}', error: '${errMsg}'`,
      },
    ],
  };
}

export const suiTransferTool = {
  name: 'sui-transfer',
  description: 'transfer SUI(in mist) to single or multiple addresses',
  paramsSchema: z.object({
    network: z.enum(SUI_NETWORKS).default('mainnet'),
    amounts: z.array(z.number()).nonempty(),
    recipients: z.array(z.string()).nonempty(),
  }).shape,
  cb: cb,
};
