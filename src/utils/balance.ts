import { CoinBalance, SuiClient } from '@mysten/sui/client';
import { MIST_PER_SUI } from '@mysten/sui/utils';

/**
 * Format SUI balance from MIST to SUI
 * @param balance Balance in MIST
 * @returns Balance in SUI
 */
export const convertCoinBalanceFromMistToSui = (balance: CoinBalance): number => {
  return Number.parseInt(balance.totalBalance) / Number(MIST_PER_SUI);
};

export const convertMistToSui = (mist: bigint): number => {
  return Number(mist) / Number(MIST_PER_SUI);
};

/**
 * Format SUI balance from SUI to MIST
 * @param address Address to get balance
 * @param client SuiClient
 * @returns Balance in MIST
 */
export const getBalanceInMist = async (
  address: string,
  client: SuiClient
): Promise<bigint | null> => {
  try {
    const balance = await client.getBalance({
      owner: address,
      coinType: '0x2::sui::SUI',
    });
    return BigInt(balance.totalBalance);
  } catch (error) {
    console.error('Error getting balance:', error);
    return null;
  }
};
