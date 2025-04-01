import { isValidSuiAddress } from '@mysten/sui/utils';
import { Keypair } from '@mysten/sui/cryptography';
import { SuiClient } from '@mysten/sui/client';
import { getBalanceInMist } from './balance.js';
import { Transaction } from '@mysten/sui/transactions';

export async function batchTransferSUI(
  amounts: bigint[],
  recipients: string[],
  sender: Keypair,
  client: SuiClient
): Promise<string> {
  if (amounts.length !== recipients.length)
    throw new Error('Amounts and recipients must have the same length');

  // Amount must be greater than 0
  if (amounts.some(amount => amount <= BigInt(0))) throw new Error('Amount must be greater than 0');

  // Invalid recipient address
  if (recipients.some(recipient => !isValidSuiAddress(recipient))) {
    throw new Error('Invalid recipient address');
  }

  const sumAmountsInMist = amounts.reduce((acc, amount) => acc + amount, 0n);

  const senderAddress = sender.toSuiAddress();

  const senderBalance = await getBalanceInMist(senderAddress, client);
  if (senderBalance === null) throw new Error('Failed to get balance');

  if (senderBalance <= sumAmountsInMist) throw new Error('Insufficient balance');

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
  const { digest } = await client.signAndExecuteTransaction({
    transaction: tx,
    signer: sender,
    requestType: 'WaitForLocalExecution',
  });

  // Wait for transaction to be confirmed
  await client.waitForTransaction({
    digest: digest,
  });

  return digest;
}
