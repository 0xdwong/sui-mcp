import { z } from 'zod';
import { getBalanceInMist } from '../utils/balance.js';
import { getKeypairFromPrivateKey } from '../utils/keypair.js';
import { config } from '../config.js';
import { Keypair } from '@mysten/sui/cryptography';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { SuiNetwork, SUI_NETWORKS } from '../types.js';

// transfer SUI(in mist) to single or multiple addresses
export async function transferSUI(
  amounts: bigint[],
  recipients: string[],
  sender: Keypair,
  client: SuiClient
): Promise<[Error | null, string]> {
  const keypair = getKeypairFromPrivateKey(config.sui.privateKey);
  if (!keypair) {
    return [new Error('Invalid or missing private key'), ''];
  }

  if (amounts.length !== recipients.length) {
    return [new Error('Amounts and recipients must have the same length'), ''];
  }

  const sumAmountsInMist = amounts.reduce((acc, amount) => acc + BigInt(amount), BigInt(0));

  const senderAddress = sender.toSuiAddress();

  const senderBalance = await getBalanceInMist(senderAddress, client);
  if (!senderBalance) {
    return [new Error('Failed to get balance'), ''];
  }

  if (senderBalance <= sumAmountsInMist) {
    return [new Error('Insufficient balance'), ''];
  }

  // Create new transaction
  const tx = new Transaction();

  // Split coins from gas coin
  const splitCoins = tx.splitCoins(tx.gas, amounts);

  // Transfer each split coin to corresponding recipient
  recipients.forEach((recipient, i) => {
    tx.transferObjects([splitCoins[i]], recipient);
  });

  // Set transaction sender
  tx.setSender(senderAddress);

  // Sign and execute transaction
  const result = await client.signAndExecuteTransaction({
    transaction: tx,
    signer: sender,
    requestType: 'WaitForLocalExecution',
    options: {
      showEffects: true,
    },
  });

  const transaction = await client.waitForTransaction({
    digest: result.digest,
    options: {
      showEffects: true,
    },
  });

  return [null, transaction.digest];
}

export const suiTool = {
  name: 'sui-transfer',
  description: 'transfer SUI to single or multiple addresses',
  paramsSchema: z.object({
    network: z.enum(SUI_NETWORKS).default('mainnet'),
    amounts: z.array(z.bigint()),
    recipients: z.array(z.string()),
  }).shape,
  cb: async (args: { network: string; amounts: bigint[]; recipients: string[] }) => {
    const suiClient = new SuiClient({ url: getFullnodeUrl(args.network as SuiNetwork) });
    const sender = getKeypairFromPrivateKey(config.sui.privateKey) as Keypair;

    const [error, digest] = await transferSUI(args.amounts, args.recipients, sender, suiClient);
    const message = error ? error.message : `Transfer successful: ${digest}`;

    return {
      content: [
        {
          type: 'text' as const,
          text: message,
        },
      ],
    };
  },
};
