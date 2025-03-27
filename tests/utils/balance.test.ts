import { CoinBalance } from '@mysten/sui/client';
import { convertBalanceFromMistToSui } from '../../src/utils/balance.js';

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
});
