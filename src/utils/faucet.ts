import { getFaucetHost, requestSuiFromFaucetV1 } from '@mysten/sui/faucet';
import { SuiFaucetNetwork } from '../types.js';

export async function getFaucet(address: string, network: SuiFaucetNetwork): Promise<boolean> {
  // Request faucet
  try {
    const response = await requestSuiFromFaucetV1({
      host: getFaucetHost(network),
      recipient: address,
    });

    // Check if response has error
    if (response?.error) {
      console.error('Invalid response from faucet:', response.error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('====Faucet request failed:', error);

    return false;
  }
}
