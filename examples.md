# Sui MCP Examples

This document provides examples of how to interact with the Sui MCP tools through Claude.

## Basic Wallet Operations

### Get devent coin from Faucet

**You:** request SUI for <wallet address>

**Claude:** I'll help you get SUI tokens for the provided address using the Sui faucet.

_Claude uses the `faucet` tool_

**Claude:** Great! I've successfully requested SUI tokens for the devnet. The faucet response shows:

Before the request: 0 SUI tokens
After the request: 10 SUI tokens

### Check SUI Balance

**You:** check SUI for 0x9eb94b1c301505d188f1b97914208b31a5419b57b2a3571169ad2165d41c2ffa

**Claude:** I'll help you check the SUI balance for this address on different networks.

_Claude uses the `balance` tool_

**Claude:** Here are the balance results:

Network balances:
- Mainnet: 0 SUI tokens
- Testnet: 0 SUI tokens

You can check other networks (devnet/localnet) or use the faucet to get test tokens if needed.
