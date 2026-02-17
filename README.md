# 🚀 Gasless Transaction Forwarder

A minimal and practical demo showing how to build **gasless transfers (meta-transactions)** using a lightweight on-chain forwarder and a React frontend.

This project demonstrates how users can sign transactions off-chain while a relayer pays the gas fees — enabling a smooth, gasless UX.

Perfect as a:
- 📚 Learning project  
- 🧪 Proof of Concept  
- 🏗 Starter template for meta-transactions  

---

## ✨ Features

- 📝 Minimal Solidity Forwarder contract (signature verification + execution)
- 💰 ERC-20 test token for gasless transfers
- 🖼 ERC-721 test NFT for gasless NFT transfers
- ⚛️ React frontend for signing and submitting requests
- 🔐 Signature verification using `ecrecover`
- 🔁 Nonce management for replay protection

---

## 📂 Project Structure

```
.
├── contracts/
│   ├── Forwarder.sol
│   ├── TestToken.sol
│   └── TestNFT.sol
│
└── frontend/
    ├── src/
    │   ├── App.js
    │   ├── components/
    │   │   ├── GaslessERC20.js
    │   │   └── GaslessERC721.js
    │   └── abi/
    └── .env
```

---

## 🧠 How It Works

### 1️⃣ User Creates a Forward Request

The frontend builds a `ForwardRequest` struct containing:

- `from`
- `to`
- `value`
- `gas`
- `nonce`
- `data` (ABI-encoded function call)

---

### 2️⃣ User Signs the Message

The frontend:
- Hashes the request (same logic as the contract)
- Signs it using the connected wallet (MetaMask)
- Sends the signed request to the forwarder

The contract verifies the hash using:

```solidity
keccak256(abi.encode(..., keccak256(data)))
```

---

### 3️⃣ Forwarder Verifies & Executes

The forwarder contract:

- Recovers the signer using `ecrecover`
- Checks nonce validity
- Prevents replay attacks
- Executes the call using low-level `call`

If valid → the transaction executes on behalf of the user (gas paid by relayer).

---

## ⚙️ Quickstart — Run the Frontend

### ✅ Requirements

- Node.js (LTS recommended)
- MetaMask (or compatible browser wallet)

---

### 🔧 Install & Run

```bash
cd frontend
npm install
npm start
```

App runs at:

```
http://localhost:3000
```

---

## 🔑 Environment Variables

Create a file:

```
frontend/.env
```

Add your deployed contract addresses:

```
REACT_APP_FORWARDER_ADDRESS=0x...
REACT_APP_TOKEN_ADDRESS=0x...
REACT_APP_NFT_ADDRESS=0x...
```

⚠️ Ensure `.env` is included in `.gitignore`.

---

## 🛠 Deploying Smart Contracts

Smart contracts are located in:

```
contracts/
```

You can compile and deploy them using:

- Hardhat  
- Truffle  
- Remix  
- Or any Solidity development framework

This repository does not include deployment scripts by default.

---

## 🎯 What You’ll Learn

- How meta-transactions work
- Off-chain signing + on-chain execution
- Signature verification using `ecrecover`
- Low-level contract calls
- Building Web3 frontends with React

---

## 🤝 Contributing

Pull requests are welcome.

Possible improvements:
- EIP-712 structured signing
- Relayer backend service
- Gas optimizations
- UI enhancements

Feel free to fork and build on top of it 🚀
