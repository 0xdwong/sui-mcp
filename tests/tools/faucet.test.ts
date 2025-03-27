import { SuiClient } from '@mysten/sui/client';
import { getFaucet } from '../../src/tools/faucet.js';
import { jest } from '@jest/globals';

// Mock the required modules
jest.mock('@mysten/sui/client');
jest.mock('@mysten/sui/faucet', () => ({
  getFaucetHost: jest.fn(() => 'http://mock-faucet.test'),
  requestSuiFromFaucetV1: jest.fn(),
}));

// Mock console.error to keep test output clean
console.error = jest.fn();

// Add type for faucet response
type FaucetResponse = {
  error?: string;
  transferred?: boolean;
};

describe('getFaucet', () => {
  let mockSuiClient: jest.Mocked<SuiClient>;
  let mockRequestSuiFromFaucetV1: jest.MockedFunction<() => Promise<FaucetResponse>>;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Create a mock SuiClient instance
    mockSuiClient = {
      getBalance: jest.fn(),
    } as any;
    // Get reference to mocked function
    mockRequestSuiFromFaucetV1 = (
      jest.requireMock('@mysten/sui/faucet') as {
        requestSuiFromFaucetV1: jest.MockedFunction<() => Promise<FaucetResponse>>;
      }
    ).requestSuiFromFaucetV1;
  });

  afterEach(() => {});

  it('should successfully get faucet tokens', async () => {
    // Setup timer mocks
    jest.useFakeTimers();

    // Mock the balance responses
    mockSuiClient.getBalance
      .mockResolvedValueOnce({
        totalBalance: '1000000000',
        coinType: '0x2::sui::SUI',
        coinObjectCount: 1,
        lockedBalance: { number: '0' },
      }) // 1 SUI before
      .mockResolvedValueOnce({
        totalBalance: '2000000000',
        coinType: '0x2::sui::SUI',
        coinObjectCount: 1,
        lockedBalance: { number: '0' },
      }); // 2 SUI after

    // Mock successful faucet request
    mockRequestSuiFromFaucetV1.mockResolvedValueOnce({});

    // Mock setTimeout to execute immediately
    jest.spyOn(global, 'setTimeout').mockImplementation(callback => {
      callback();
      return {} as any;
    });

    const result = await getFaucet(
      '0x9eb94b1c301505d188f1b97914208b31a5419b57b2a3571169ad2165d41c2ffa',
      'devnet',
      mockSuiClient
    );

    expect(result).toEqual({
      before: 1,
      after: 2,
    });

    // Cleanup timer mocks
    jest.useRealTimers();
  });

  it('should return null when initial balance check fails', async () => {
    // Mock getBalance to throw an error
    mockSuiClient.getBalance.mockRejectedValueOnce(new Error('Failed to get balance'));

    const result = await getFaucet('0x1234567890abcdef', 'devnet', mockSuiClient);

    expect(result).toBeNull();
  });

  it('should return null when faucet request fails', async () => {
    // Mock the initial balance check
    mockSuiClient.getBalance.mockResolvedValueOnce({
      totalBalance: '1000000000',
      coinType: '0x2::sui::SUI',
      coinObjectCount: 1,
      lockedBalance: { number: '0' },
    });

    // Mock faucet request to throw an error
    mockRequestSuiFromFaucetV1.mockRejectedValueOnce(new Error('Faucet request failed'));

    const result = await getFaucet('0x1234567890abcdef', 'devnet', mockSuiClient);

    expect(result).toBeNull();
  });

  it('should return null when final balance check fails', async () => {
    // Mock the initial balance check
    mockSuiClient.getBalance
      .mockResolvedValueOnce({
        totalBalance: '1000000000',
        coinType: '0x2::sui::SUI',
        coinObjectCount: 1,
        lockedBalance: { number: '0' },
      })
      .mockRejectedValueOnce(new Error('Failed to get final balance'));

    // Mock successful faucet request
    mockRequestSuiFromFaucetV1.mockResolvedValueOnce({});

    const result = await getFaucet('0x1234567890abcdef', 'devnet', mockSuiClient);

    expect(result).toBeNull();
  });

  it('should return null when faucet response has error', async () => {
    // Mock the initial balance check
    mockSuiClient.getBalance.mockResolvedValueOnce({
      totalBalance: '1000000000',
      coinType: '0x2::sui::SUI',
      coinObjectCount: 1,
      lockedBalance: { number: '0' },
    });

    // Mock faucet request with error response
    mockRequestSuiFromFaucetV1.mockResolvedValueOnce({ error: 'Some error' });

    const result = await getFaucet('0x1234567890abcdef', 'devnet', mockSuiClient);

    expect(result).toBeNull();
  });
});
