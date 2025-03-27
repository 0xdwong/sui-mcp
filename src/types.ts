export type SuiNetwork = 'mainnet' | 'testnet' | 'devnet' | 'localnet';
export type SuiFaucetNetwork = Extract<SuiNetwork, 'testnet' | 'devnet' | 'localnet'>;
