import { SuiClient } from '@mysten/sui/client';
import { jest } from '@jest/globals';
import { transferSUI } from '../../src/tools/sui-transfer.js';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

// Mock the required modules
jest.mock('@mysten/sui/client');
jest.mock('@mysten/sui/transactions');

// Mock console.error to keep test output clean
console.error = jest.fn();

describe('transferSUI', () => {
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

    const [error, digest] = await transferSUI(amounts, recipients, mockKeypair, mockSuiClient);

    expect(error).toBeNull();
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

    const [error, digest] = await transferSUI(amounts, recipients, mockKeypair, mockSuiClient);

    expect(error).not.toBeNull();
    expect(error?.message).toBe('Insufficient balance');
    expect(digest).toBe('');
  });

  it('should return error when amounts and recipients length mismatch', async () => {
    const amounts = [BigInt(1000000), BigInt(2000000)];
    const recipients = [new Ed25519Keypair().toSuiAddress()];

    const [error, digest] = await transferSUI(amounts, recipients, mockKeypair, mockSuiClient);

    expect(error).not.toBeNull();
    expect(error?.message).toBe('Amounts and recipients must have the same length');
    expect(digest).toBe('');
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

    const [error, digest] = await transferSUI(amounts, recipients, mockKeypair, mockSuiClient);

    expect(error).toBeNull();
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

    const [error, digest] = await transferSUI(amounts, recipients, mockKeypair, mockSuiClient);

    expect(error).not.toBeNull();
    expect(error?.message).toBe('Transaction failed');
    expect(digest).toBe('');
  });

  // 测试用例6: balance check failure
  it('should handle balance check failure', async () => {
    const amounts = [BigInt(1000000)];
    const recipients = [new Ed25519Keypair().toSuiAddress()];

    // Mock balance check failure
    mockSuiClient.getBalance.mockRejectedValue(new Error('Failed to get balance'));

    const [error, digest] = await transferSUI(amounts, recipients, mockKeypair, mockSuiClient);

    expect(error).not.toBeNull();
    expect(error?.message).toBe('Failed to get balance');
    expect(digest).toBe('');
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

    const [error, digest] = await transferSUI(amounts, recipients, mockKeypair, mockSuiClient);

    expect(error).not.toBeNull();
    expect(error?.message).toContain('Invalid recipient address');
    expect(digest).toBe('');
  });

  it('should validate non-zero amount', async () => {
    const amounts = [BigInt(0)];
    const recipients = [new Ed25519Keypair().toSuiAddress()];

    const [error, digest] = await transferSUI(amounts, recipients, mockKeypair, mockSuiClient);

    expect(error).not.toBeNull();
    expect(error?.message).toContain('Amount must be greater than 0');
    expect(digest).toBe('');
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

    const [error, digest] = await transferSUI(amounts, recipients, mockKeypair, mockSuiClient);

    expect(error?.message).toContain('Transaction timeout');
    expect(digest).toBe('');
  });
});
