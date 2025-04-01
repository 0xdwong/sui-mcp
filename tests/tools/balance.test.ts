import { SuiClient } from '@mysten/sui/client';
import { getBalance } from '../../src/tools/sui-balance.js';
import { jest } from '@jest/globals';

// Mock the required modules
jest.mock('@mysten/sui/client');

// Mock console.error to keep test output clean
console.error = jest.fn();

describe('getBalance', () => {
  let mockSuiClient: jest.Mocked<SuiClient>;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Create a mock SuiClient instance
    mockSuiClient = {
      getBalance: jest.fn(),
    } as any;
  });

  afterEach(() => {});

  it('should successfully get balance', async () => {
    // Mock the balance responses
    mockSuiClient.getBalance.mockResolvedValueOnce({
      totalBalance: '1000000000',
      coinType: '0x2::sui::SUI',
      coinObjectCount: 1,
      lockedBalance: { number: '0' },
    });

    const balance = await getBalance(
      '0x9eb94b1c301505d188f1b97914208b31a5419b57b2a3571169ad2165d41c2ffa',
      mockSuiClient
    );

    expect(balance).toEqual(1);
  });

  it('should return null when getBalance fails', async () => {
    mockSuiClient.getBalance.mockRejectedValueOnce(new Error('Network error'));

    const balance = await getBalance(
      '0x9eb94b1c301505d188f1b97914208b31a5419b57b2a3571169ad2165d41c2ffa',
      mockSuiClient
    );

    expect(balance).toBeNull();
    expect(console.error).toHaveBeenCalledWith('Failed to get initial balance:', expect.any(Error));
  });
});
