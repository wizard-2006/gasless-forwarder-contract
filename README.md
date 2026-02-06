# Gasless Forwarder — Repo

This repository contains:
- Smart contracts: [blockchain/Forwarder.sol](blockchain/Forwarder.sol), [blockchain/TestToken.sol](blockchain/TestToken.sol), [blockchain/TestNFT.sol](blockchain/TestNFT.sol)
- Frontend: the React app in `frontend/`

## Run the frontend

1. Open a terminal:
```bash
cd frontend
npm install
npm start
```
The app runs at http://localhost:3000.

## Environment variables
The frontend expects environment variables in `frontend/.env` (do not commit this file). Example variables:
```
REACT_APP_FORWARDER_ADDRESS=0x...
REACT_APP_TOKEN_ADDRESS=0x...
REACT_APP_NFT_ADDRESS=0x...
```

## Smart contracts
Contracts are under `blockchain/`. Compile & deploy using your preferred tool (Hardhat, Truffle, Remix). This repo does not include a specific deploy config.

## Git
Make sure `.env` is ignored (see `frontend/.gitignore`) before committing.
