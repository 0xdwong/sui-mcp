import { SuiClient } from '@mysten/sui/client';
import { jest } from '@jest/globals';
import { batchTransferSUI } from '../../src/utils/sui.js';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

// Mock the required modules
jest.mock('@mysten/sui/client');
jest.mock('@mysten/sui/transactions');

// Mock console.error to keep test output clean
console.error = jest.fn();

describe('batchTransferSUI', () => {
  let mockSuiClient: jest.Mocked<SuiClient>;
  let mockKeypair: Ed25519Keypair;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Create mock client
    mockSuiClient = {
      signAndExecuteTransaction: jest.fn(),
      waitForTransaction: jest.fn(),
      getBalance: jest.fn(),
    } as unknown as jest.Mocked<SuiClient>;

    // Create mock keypair
    mockKeypair = new Ed25519Keypair();
  });

  it('should successfully transfer SUI and return digest', async () => {
    const expectedDigest = '0x123456';
    const amounts = [BigInt(1000000)];
    const recipients = [new Ed25519Keypair().toSuiAddress()];

    // Mock the balance responses
    mockSuiClient.getBalance.mockResolvedValueOnce({
      totalBalance: '1000000000',
      coinType: '0x2::sui::SUI',
      coinObjectCount: Number.MAX_SAFE_INTEGER,
      lockedBalance: { number: '0' },
    });

    // Mock successful transaction
    mockSuiClient.signAndExecuteTransaction.mockResolvedValue({ digest: expectedDigest });
    mockSuiClient.waitForTransaction.mockResolvedValue({ digest: expectedDigest });

    const digest = await batchTransferSUI(amounts, recipients, mockKeypair, mockSuiClient);

    expect(digest).toBe(expectedDigest);
    expect(mockSuiClient.signAndExecuteTransaction).toHaveBeenCalledTimes(1);
    expect(mockSuiClient.waitForTransaction).toHaveBeenCalledTimes(1);
  });

  it('should return error when balance is insufficient', async () => {
    const amounts = [BigInt(2000000)];
    const recipients = [new Ed25519Keypair().toSuiAddress()];

    // Mock low balance
    mockSuiClient.getBalance.mockResolvedValueOnce({
      totalBalance: '1000000',
      coinType: '0x2::sui::SUI',
      coinObjectCount: Number.MAX_SAFE_INTEGER,
      lockedBalance: { number: '0' },
    });

    try {
      await batchTransferSUI(amounts, recipients, mockKeypair, mockSuiClient);
      // Should not reach here
      expect(true).toBe(false);
    } catch (error) {
      expect(error instanceof Error).toBe(true);
      expect((error as Error).message).toContain('Insufficient balance');
    }
  });

  it('should return error when amounts and recipients length mismatch', async () => {
    const amounts = [BigInt(1000000), BigInt(2000000)];
    const recipients = [new Ed25519Keypair().toSuiAddress()];

    try {
      await batchTransferSUI(amounts, recipients, mockKeypair, mockSuiClient);
      // Should not reach here
      expect(true).toBe(false);
    } catch (error) {
      expect(error instanceof Error).toBe(true);
      expect((error as Error).message).toBe('Amounts and recipients must have the same length');
    }
  });

  it('should successfully transfer SUI to multiple recipients', async () => {
    const expectedDigest = '0x123456';
    const amounts = [BigInt(1000000), BigInt(2000000)];
    const recipients = [new Ed25519Keypair().toSuiAddress(), new Ed25519Keypair().toSuiAddress()];

    // Mock sufficient balance
    mockSuiClient.getBalance.mockResolvedValueOnce({
      totalBalance: '10000000000',
      coinType: '0x2::sui::SUI',
      coinObjectCount: Number.MAX_SAFE_INTEGER,
      lockedBalance: { number: '0' },
    });

    // Mock successful transaction
    mockSuiClient.signAndExecuteTransaction.mockResolvedValue({ digest: expectedDigest });
    mockSuiClient.waitForTransaction.mockResolvedValue({ digest: expectedDigest });

    const digest = await batchTransferSUI(amounts, recipients, mockKeypair, mockSuiClient);

    expect(digest).toBe(expectedDigest);
    expect(mockSuiClient.signAndExecuteTransaction).toHaveBeenCalledTimes(1);
    expect(mockSuiClient.waitForTransaction).toHaveBeenCalledTimes(1);
  });

  it('should handle transaction failure', async () => {
    const amounts = [BigInt(1000000)];
    const recipients = [new Ed25519Keypair().toSuiAddress()];

    // Mock sufficient balance
    mockSuiClient.getBalance.mockResolvedValueOnce({
      totalBalance: '10000000000',
      coinType: '0x2::sui::SUI',
      coinObjectCount: Number.MAX_SAFE_INTEGER,
      lockedBalance: { number: '0' },
    });

    // Mock transaction failure
    mockSuiClient.signAndExecuteTransaction.mockRejectedValue(new Error('Transaction failed'));

    try {
      await batchTransferSUI(amounts, recipients, mockKeypair, mockSuiClient);
      // Should not reach here
      expect(true).toBe(false);
    } catch (error) {
      expect(error instanceof Error).toBe(true);
      expect((error as Error).message).toBe('Transaction failed');
    }
  });

  // 测试用例6: balance check failure
  it('should handle balance check failure', async () => {
    const amounts = [BigInt(1000000)];
    const recipients = [new Ed25519Keypair().toSuiAddress()];

    // Mock balance check failure
    mockSuiClient.getBalance.mockRejectedValue(new Error('Failed to get balance'));

    try {
      await batchTransferSUI(amounts, recipients, mockKeypair, mockSuiClient);
      // Should not reach here
      expect(true).toBe(false);
    } catch (error) {
      expect(error instanceof Error).toBe(true);
      expect((error as Error).message).toBe('Failed to get balance');
    }
  });

  it('should validate recipient address format', async () => {
    const amounts = [BigInt(1000000)];
    const recipients = ['invalid_address']; // Invalid address format

    // Mock sufficient balance
    mockSuiClient.getBalance.mockResolvedValueOnce({
      totalBalance: '10000000000',
      coinType: '0x2::sui::SUI',
      coinObjectCount: Number.MAX_SAFE_INTEGER,
      lockedBalance: { number: '0' },
    });

    try {
      await batchTransferSUI(amounts, recipients, mockKeypair, mockSuiClient);
      // Should not reach here
      expect(true).toBe(false);
    } catch (error) {
      expect(error instanceof Error).toBe(true);
      expect((error as Error).message).toContain('Invalid recipient address');
    }
  });

  it('should validate non-zero amount', async () => {
    const amounts = [BigInt(0)];
    const recipients = [new Ed25519Keypair().toSuiAddress()];

    try {
      await batchTransferSUI(amounts, recipients, mockKeypair, mockSuiClient);
      // Should not reach here
      expect(true).toBe(false);
    } catch (error) {
      expect(error instanceof Error).toBe(true);
      expect((error as Error).message).toContain('Amount must be greater than 0');
    }
  });

  it('should handle transaction timeout', async () => {
    const amounts = [BigInt(1000000)];
    const recipients = [new Ed25519Keypair().toSuiAddress()];

    // Mock sufficient balance
    mockSuiClient.getBalance.mockResolvedValueOnce({
      totalBalance: '10000000000',
      coinType: '0x2::sui::SUI',
      coinObjectCount: Number.MAX_SAFE_INTEGER,
      lockedBalance: { number: '0' },
    });

    // Mock transaction timeout
    mockSuiClient.signAndExecuteTransaction.mockResolvedValue({ digest: '0x123456' });
    mockSuiClient.waitForTransaction.mockRejectedValue(new Error('Transaction timeout'));

    try {
      await batchTransferSUI(amounts, recipients, mockKeypair, mockSuiClient);
      // Should not reach here
      expect(true).toBe(false);
    } catch (error) {
      expect(error instanceof Error).toBe(true);
      expect((error as Error).message).toContain('Transaction timeout');
    }
  });
});
