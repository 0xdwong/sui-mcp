import { faucetTool } from './faucet.js';
import { suiBalanceTool } from './sui-balance.js';
import { suiTransferTool } from './sui-transfer.js';
import randomSuiAccountTool from './account/gen-random.js';
import genMnemonicTool from './account/gen-mnemonic.js';
import genSuiAccountsByMnemonicTool from './account/gen-by-mnemonic.js';
import getAccountInfoByPriKeyTool from './account/get-info-by-pri-key.js';

export default [
  faucetTool,
  suiBalanceTool,
  suiTransferTool,
  randomSuiAccountTool,
  genMnemonicTool,
  genSuiAccountsByMnemonicTool,
  getAccountInfoByPriKeyTool,
];
