import { CoinBalance, SuiClient } from '@mysten/sui/client';
import {
  convertCoinBalanceFromMistToSui,
  convertMistToSui,
  getBalanceInMist,
} from '../../src/utils/balance.js';
import { jest } from '@jest/globals';

console.error = jest.fn();

describe('balance utils', () => {
  describe('convertCoinBalanceFromMistToSui', () => {
    it('should correctly convert MIST to SUI', () => {
      const mockBalance: CoinBalance = {
        coinType: '0x2::sui::SUI',
        coinObjectCount: 1,
        totalBalance: '1000000000', // 1 SUI in MIST
        lockedBalance: { number: '0' },
      };

      expect(convertCoinBalanceFromMistToSui(mockBalance)).toBe(1);
    });

    it('should handle decimal values correctly', () => {
      const mockBalance: CoinBalance = {
        coinType: '0x2::sui::SUI',
        coinObjectCount: 1,
        totalBalance: '500000000', // 0.5 SUI in MIST
        lockedBalance: { number: '0' },
      };

      expect(convertCoinBalanceFromMistToSui(mockBalance)).toBe(0.5);
    });

    it('should handle small decimal values correctly', () => {
      const mockBalance: CoinBalance = {
        coinType: '0x2::sui::SUI',
        coinObjectCount: 1,
        totalBalance: '100000', // 0.0001 SUI in MIST
        lockedBalance: { number: '0' },
      };

      expect(convertCoinBalanceFromMistToSui(mockBalance)).toBe(0.0001);
    });

    it('should handle zero balance', () => {
      const mockBalance: CoinBalance = {
        coinType: '0x2::sui::SUI',
        coinObjectCount: 0,
        totalBalance: '0',
        lockedBalance: { number: '0' },
      };

      expect(convertCoinBalanceFromMistToSui(mockBalance)).toBe(0);
    });
  });

  describe('convertMistToSui', () => {
    it('should correctly convert MIST to SUI', () => {
      expect(convertMistToSui(BigInt('1000000000'))).toBe(1);
      expect(convertMistToSui(BigInt('500000000'))).toBe(0.5);
      expect(convertMistToSui(BigInt('100000'))).toBe(0.0001);
      expect(convertMistToSui(BigInt('0'))).toBe(0);
    });

    it('should handle large numbers', () => {
      expect(convertMistToSui(BigInt('1000000000000000'))).toBe(1000000);
    });
  });

  describe('getBalanceInMist', () => {
    let mockSuiClient: jest.Mocked<SuiClient>;

    beforeEach(() => {
      jest.clearAllMocks();
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
      expect(mockSuiClient.getBalance).toHaveBeenCalledWith({
        owner: address,
        coinType: '0x2::sui::SUI',
      });
    });

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
      expect(balanceInMist).toBe(BigInt('0'));
    });

    it('should return null when error occurs', async () => {
      const address = '0x1';
      mockSuiClient.getBalance.mockRejectedValueOnce(new Error('Failed to fetch balance'));
      const balanceInMist = await getBalanceInMist(address, mockSuiClient);
      expect(balanceInMist).toBeNull();
    });

    it('should handle invalid address', async () => {
      mockSuiClient.getBalance.mockRejectedValueOnce(new Error('Invalid address'));
      const balanceInMist = await getBalanceInMist('invalid_address', mockSuiClient);
      expect(balanceInMist).toBeNull();
    });
  });
});
