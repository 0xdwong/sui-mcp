import { CoinBalance, SuiClient } from '@mysten/sui/client';
import { convertBalanceFromMistToSui, getBalanceInMist } from '../../src/utils/balance.js';
import { jest } from '@jest/globals';

describe('balance utils', () => {
  describe('convertBalanceFromMistToSui', () => {
    it('should correctly convert MIST to SUI', () => {
      const mockBalance: CoinBalance = {
        coinType: '0x2::sui::SUI',
        coinObjectCount: 1,
        totalBalance: '1000000000', // 1 SUI in MIST
        lockedBalance: { number: '0' },
      };

      expect(convertBalanceFromMistToSui(mockBalance)).toBe(1);
    });

    it('should handle decimal values correctly', () => {
      const mockBalance: CoinBalance = {
        coinType: '0x2::sui::SUI',
        coinObjectCount: 1,
        totalBalance: '500000000', // 0.5 SUI in MIST
        lockedBalance: { number: '0' },
      };

      expect(convertBalanceFromMistToSui(mockBalance)).toBe(0.5);
    });

    it('should handle decimal values correctly2', () => {
      const mockBalance: CoinBalance = {
        coinType: '0x2::sui::SUI',
        coinObjectCount: 1,
        totalBalance: '100000', // 0.0001 SUI in MIST
        lockedBalance: { number: '0' },
      };

      expect(convertBalanceFromMistToSui(mockBalance)).toBe(0.0001);
    });

    it('should handle zero balance', () => {
      const mockBalance: CoinBalance = {
        coinType: '0x2::sui::SUI',
        coinObjectCount: 0,
        totalBalance: '0',
        lockedBalance: { number: '0' },
      };

      expect(convertBalanceFromMistToSui(mockBalance)).toBe(0);
    });
  });

  describe('getBalanceInMist', () => {
    let mockSuiClient: jest.Mocked<SuiClient>;

    beforeEach(() => {
      // Reset all mocks before each test
      jest.clearAllMocks();

      // Create a mock SuiClient instance
      mockSuiClient = {
        getBalance: jest.fn(),
      } as any;
    });

    it('should correctly get balance in MIST', async () => {
      const mockBalance: CoinBalance = {
        coinType: '0x2::sui::SUI',
        coinObjectCount: 1,
        totalBalance: '1000000000', // 1 SUI in MIST
        lockedBalance: { number: '0' },
      };
      mockSuiClient.getBalance.mockResolvedValueOnce(mockBalance);

      const address = '0x1';

      const balanceInMist = await getBalanceInMist(address, mockSuiClient);
      expect(balanceInMist).toBe(BigInt(mockBalance.totalBalance));
    });

    // zero balance
    it('should return 0n for zero balance', async () => {
      const mockBalance: CoinBalance = {
        coinType: '0x2::sui::SUI',
        coinObjectCount: 0,
        totalBalance: '0',
        lockedBalance: { number: '0' },
      };
      mockSuiClient.getBalance.mockResolvedValueOnce(mockBalance);

      const address = '0x1';
      const balanceInMist = await getBalanceInMist(address, mockSuiClient);
      expect(balanceInMist).toBe(0n);
    });

    // error fetching balance
    it('should throw an error if the balance is not found', async () => {
      const address = '0x1';
      mockSuiClient.getBalance.mockRejectedValueOnce(new Error('Failed to fetch balance'));
      const balanceInMist = await getBalanceInMist(address, mockSuiClient);
      expect(balanceInMist).toBeNull();
    });
  });
});
