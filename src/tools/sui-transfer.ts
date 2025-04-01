import { z } from 'zod';
import { getBalanceInMist } from '../utils/balance.js';
import { getKeypairFromPrivateKey } from '../utils/keypair.js';
import { config } from '../config.js';
import { Keypair } from '@mysten/sui/cryptography';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { SuiNetwork, SUI_NETWORKS } from '../types.js';
import { isValidSuiAddress } from '@mysten/sui/utils';

// transfer SUI(in mist) to single or multiple addresses
export async function transferSUI(
  amounts: bigint[],
  recipients: string[],
  sender: Keypair,
  client: SuiClient
): Promise<[Error | null, string]> {
  if (amounts.length !== recipients.length) {
    return [new Error('Amounts and recipients must have the same length'), ''];
  }

  // Amount must be greater than 0
  if (amounts.some(amount => amount <= BigInt(0))) {
    return [new Error('Amount must be greater than 0'), ''];
  }

  // Invalid recipient address
  if (recipients.some(recipient => !isValidSuiAddress(recipient))) {
    return [new Error('Invalid recipient address'), ''];
  }

  const sumAmountsInMist = amounts.reduce((acc, amount) => acc + BigInt(amount), BigInt(0));

  const senderAddress = sender.toSuiAddress();

  const senderBalance = await getBalanceInMist(senderAddress, client);
  if (senderBalance === null) {
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

  try {
    // Sign and execute transaction
    const { digest } = await client.signAndExecuteTransaction({
      transaction: tx,
      signer: sender,
      requestType: 'WaitForLocalExecution',
    });

    // Wait for transaction to be confirmed
    await client.waitForTransaction({
      digest: digest,
    });

    return [null, digest];
  } catch (error) {
    return [error as Error, ''];
  }
}

export const suiTransferTool = {
  name: 'sui-transfer',
  description: 'transfer SUI(in mist) to single or multiple addresses',
  paramsSchema: z.object({
    network: z.enum(SUI_NETWORKS).default('mainnet'),
    amounts: z.array(z.number()).nonempty(),
    recipients: z.array(z.string()).nonempty(),
  }).shape,
  cb: async (args: { network: string; amounts: number[]; recipients: string[] }) => {
    const suiClient = new SuiClient({ url: getFullnodeUrl(args.network as SuiNetwork) });

    if (!config.sui.privateKey) {
      return {
        content: [{ type: 'text' as const, text: 'Missing private key, please set it in config' }],
      };
    }

    const sender = getKeypairFromPrivateKey(config.sui.privateKey) as Keypair;

    if (!sender) {
      return {
        content: [{ type: 'text' as const, text: 'Invalid private key, please check your config' }],
      };
    }

    const amounts = args.amounts.map((amount: number) => BigInt(amount));
    const [error, digest] = await transferSUI(amounts, args.recipients, sender, suiClient);
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
