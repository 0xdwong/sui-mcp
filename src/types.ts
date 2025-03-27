export type SuiNetwork = 'mainnet' | 'testnet' | 'devnet' | 'localnet';
export type SuiFaucetNetwork = Extract<SuiNetwork, 'testnet' | 'devnet' | 'localnet'>;

export const SUI_NETWORKS = ['mainnet', 'testnet', 'devnet', 'localnet'] as const;
export const SUI_FAUCET_NETWORKS = ['testnet', 'devnet', 'localnet'] as const;
