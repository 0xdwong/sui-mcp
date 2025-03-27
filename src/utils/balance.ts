import { CoinBalance } from '@mysten/sui/client';
import { MIST_PER_SUI } from '@mysten/sui/utils';

/**
 * Format SUI balance from MIST to SUI
 * @param balance Balance in MIST
 * @returns Balance in SUI
 */
export const convertBalanceFromMistToSui = (balance: CoinBalance): number => {
  return Number.parseInt(balance.totalBalance) / Number(MIST_PER_SUI);
};
