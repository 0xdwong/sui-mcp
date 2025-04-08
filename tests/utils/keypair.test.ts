import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { jest } from '@jest/globals';
import {
  getKeypairFromPrivateKey,
  getRandomKeypair,
  getKeypairFromMnemonic,
  getAccountInfoFromKeypair,
  genRandomMnemonic,
} from '../../src/utils/keypair.js';
import bip39 from 'bip39';

// Mock the console.error to keep test output clean
console.error = jest.fn();

describe('keypair utilities', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  describe('getKeypairFromPrivateKey', () => {
    it('should return a keypair when given a valid private key', () => {
      // Create a keypair to get a valid private key
      const originalKeypair = new Ed25519Keypair();
      const privateKey = originalKeypair.getSecretKey();

      // Test the function
      const keypair = getKeypairFromPrivateKey(privateKey);

      expect(keypair).not.toBeNull();
      expect(keypair?.getPublicKey().toSuiPublicKey()).toBe(
        originalKeypair.getPublicKey().toSuiPublicKey()
      );
    });

    it('should return null when given an invalid private key', () => {
      const invalidPrivateKey = 'invalid-private-key';

      const keypair = getKeypairFromPrivateKey(invalidPrivateKey);

      expect(keypair).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('getRandomKeypair', () => {
    it('should return a new random keypair', () => {
      const keypair1 = getRandomKeypair();
      const keypair2 = getRandomKeypair();

      expect(keypair1).toBeInstanceOf(Ed25519Keypair);
      expect(keypair2).toBeInstanceOf(Ed25519Keypair);

      // Two random keypairs should be different
      expect(keypair1.getPublicKey().toSuiPublicKey()).not.toBe(
        keypair2.getPublicKey().toSuiPublicKey()
      );
    });
  });

  describe('getKeypairFromMnemonic', () => {
    it('should derive a keypair from a mnemonic with default index', () => {
      const mnemonic = genRandomMnemonic();

      const keypair = getKeypairFromMnemonic(mnemonic);

      expect(keypair).toBeInstanceOf(Ed25519Keypair);
    });

    it('should derive different keypairs with different indices', () => {
      const mnemonic = genRandomMnemonic();

      const keypair1 = getKeypairFromMnemonic(mnemonic, 0);
      const keypair2 = getKeypairFromMnemonic(mnemonic, 1);

      expect(keypair1.getPublicKey().toSuiPublicKey()).not.toBe(
        keypair2.getPublicKey().toSuiPublicKey()
      );
    });

    it('should derive the same keypair given the same mnemonic and index', () => {
      const mnemonic = genRandomMnemonic();

      const keypair1 = getKeypairFromMnemonic(mnemonic, 5);
      const keypair2 = getKeypairFromMnemonic(mnemonic, 5);

      expect(keypair1.getPublicKey().toSuiPublicKey()).toBe(
        keypair2.getPublicKey().toSuiPublicKey()
      );
    });
  });

  describe('getAccountInfoFromKeypair', () => {
    it('should return the correct account info from a keypair', () => {
      const keypair = new Ed25519Keypair();

      const accountInfo = getAccountInfoFromKeypair(keypair);

      expect(accountInfo.publicKey).toBe(keypair.getPublicKey().toSuiPublicKey());
      expect(accountInfo.privateKey).toBe(keypair.getSecretKey());
      expect(accountInfo.address).toBe(keypair.toSuiAddress());
    });
  });

  describe('genRandomMnemonic', () => {
    it('should generate a valid BIP39 mnemonic', () => {
      const mnemonic = genRandomMnemonic();

      // Validate the mnemonic
      expect(bip39.validateMnemonic(mnemonic)).toBe(true);
    });

    it('should generate different mnemonics on successive calls', () => {
      const mnemonic1 = genRandomMnemonic();
      const mnemonic2 = genRandomMnemonic();

      expect(mnemonic1).not.toBe(mnemonic2);
    });
  });
});
