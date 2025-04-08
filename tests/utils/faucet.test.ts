import { jest } from '@jest/globals';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

// Use unstable_mockModule to mock ESM modules
const mockGetFaucetHost = jest.fn();
const mockRequestSuiFromFaucetV1 = jest.fn();

jest.unstable_mockModule('@mysten/sui/faucet', () => ({
  getFaucetHost: mockGetFaucetHost,
  requestSuiFromFaucetV1: mockRequestSuiFromFaucetV1,
}));

// Must dynamically import modules after mocking
describe('getFaucet', () => {
  let getFaucet: any;

  beforeEach(async () => {
    jest.clearAllMocks();
    console.error = jest.fn();

    // Dynamically import the module being tested
    const faucetModule = await import('../../src/utils/faucet.js');
    getFaucet = faucetModule.getFaucet;
  });

  const recipient = Ed25519Keypair.generate().toSuiAddress();

  it('should return true if the faucet request is successful', async () => {
    mockGetFaucetHost.mockReturnValue('http://127.0.0.1:9123');
    mockRequestSuiFromFaucetV1.mockResolvedValue({} as never);

    const result = await getFaucet(recipient, 'testnet');
    expect(result).toBe(true);
  });

  it('should return false if the faucet request fails', async () => {
    mockGetFaucetHost.mockReturnValue('http://127.0.0.1:9123');
    // Use generic function to mock throwing an error
    mockRequestSuiFromFaucetV1.mockImplementation(() => {
      throw new Error('Faucet error');
    });

    const result = await getFaucet(recipient, 'testnet');
    expect(result).toBe(false);
  });

  it('should return false if the faucet response has an error', async () => {
    mockGetFaucetHost.mockReturnValue('http://127.0.0.1:9123');
    mockRequestSuiFromFaucetV1.mockResolvedValue({ error: 'Some error' } as never);

    const result = await getFaucet(recipient, 'testnet');
    expect(result).toBe(false);
  });
});
