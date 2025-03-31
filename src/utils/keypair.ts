import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

/**
 * Get keypair from private key
 * @param privateKey Private key
 * @returns Keypair or null if error
 */
export function getKeypairFromPrivateKey(privateKey: string) {
  try {
    const keypair = Ed25519Keypair.fromSecretKey(privateKey);
    return keypair;
  } catch (error) {
    console.error('Error creating keypair from private key:', error);
    return null;
  }
}
