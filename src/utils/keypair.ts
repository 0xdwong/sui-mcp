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

export function getRandomKeypair() {
  const keypair = new Ed25519Keypair();
  return keypair;
}

export function getKeypairFromMnemonic(mnemonic: string) {
  const path = "m/44'/784'/0'/0'/0'"; // default path

  const keypair = Ed25519Keypair.deriveKeypair(mnemonic, path);
  return keypair;
}
