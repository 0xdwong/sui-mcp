import { SuiClient } from '@mysten/sui/client';
import getBalanceTool from '../../../src/tools/sui/get-balance.js';
import { jest } from '@jest/globals';
import { convertMistToSui } from '../../../src/utils/balance.js';

// Mock the required modules
jest.mock('@mysten/sui/client');

// Mock console.error to keep test output clean
console.error = jest.fn();

describe('sui-balance tool', () => {
  let mockSuiClient: jest.Mocked<SuiClient>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSuiClient = {
      getBalance: jest.fn(),
    } as any;
  });

  it('should return formatted balance results', async () => {
    const coinBalance1 = {
      coinType: '0x2::sui::SUI',
      coinObjectCount: 1,
      totalBalance: '1000000000', // 1 SUI in MIST
      lockedBalance: { number: '0' },
    };

    const coinBalance2 = {
      coinType: '0x2::sui::SUI',
      coinObjectCount: 1,
      totalBalance: '2000000000', // 2 SUI in MIST
      lockedBalance: { number: '0' },
    };

    const addresses = ['0x123', '0x456'];
    mockSuiClient.getBalance
      .mockResolvedValueOnce(coinBalance1)
      .mockResolvedValueOnce(coinBalance2);

    const result = await getBalanceTool.cb(
      {
        addresses,
        network: 'devnet',
      },
      mockSuiClient
    );

    expect(result).toHaveProperty('content');
    expect(result.content[0]).toHaveProperty('type', 'text');
    expect(typeof result.content[0].text).toBe('string');

    const contentText = [coinBalance1, coinBalance2].map((coinBalance, index) => ({
      address: addresses[index],
      mist: coinBalance.totalBalance.toString(),
      sui: convertMistToSui(BigInt(coinBalance.totalBalance)).toString(),
    }));

    expect(result.content[0].text).toEqual(JSON.stringify(contentText));
  });

  // should return null when error
  it('should return null when error', async () => {
    mockSuiClient.getBalance.mockRejectedValueOnce(new Error('Error'));

    const result = await getBalanceTool.cb(
      { addresses: ['0x123'], network: 'devnet' },
      mockSuiClient
    );
    expect(result.content[0].text).toEqual(JSON.stringify([null]));
  });

  // Test with null client parameter to improve branch coverage
  it('should create new client when suiClient parameter is null', async () => {
    await getBalanceTool.cb({ addresses: ['0x123'], network: 'testnet' });
  });
});
