import { ethers } from "ethers";
import forwarderABI from "../abi/Forwarder.json";
import tokenABI from "../abi/TestToken.json";
import { useState } from "react";

const FORWARDER_ADDRESS = process.env.REACT_APP_FORWARDER_ADDRESS;
const TOKEN_ADDRESS = process.env.REACT_APP_TOKEN_ADDRESS;

function GaslessERC20() {
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");

  const sendGaslessERC20 = async () => {
    try {
      if (!ethers.isAddress(receiver)) {
        alert("Invalid receiver address");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const network = await provider.getNetwork();
console.log("Connected chainId:", network.chainId);


      const userAddress = await signer.getAddress();

      const tokenInterface = new ethers.Interface(tokenABI);

      // ✅ MUST use transferFrom
      const data = tokenInterface.encodeFunctionData(
        "transferFrom",
        [
          userAddress,
          receiver,
          ethers.parseUnits(amount, 18)
        ]
      );

      const forwarder = new ethers.Contract(
        FORWARDER_ADDRESS,
        forwarderABI,
        provider
      );

      const nonce = await forwarder.nonces(userAddress);

      const request = {
        from: userAddress,
        to: TOKEN_ADDRESS,
        value: 0,
        gas: 100000,
        nonce,
        data
      };

      // ✅ EXACT match to Solidity abi.encode
      const hash = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
          ["address","address","uint256","uint256","uint256","bytes32"],
          [
            request.from,
            request.to,
            request.value,
            request.gas,
            request.nonce,
            ethers.keccak256(request.data)
          ]
        )
      );

      const signature = await signer.signMessage(
        ethers.getBytes(hash)
      );

      const forwarderWithSigner = new ethers.Contract(
        FORWARDER_ADDRESS,
        forwarderABI,
        signer
      );

      const tx = await forwarderWithSigner.execute(request, signature);
      await tx.wait();

      alert("✅ Gasless ERC20 Transfer Successful");

    } catch (err) {
      console.error(err);
      alert("❌ ERC20 Transaction Failed");
    }
  };

  return (
    <div>
      <h2>Gasless ERC20 Transfer</h2>

      <input
        placeholder="Receiver Address"
        value={receiver}
        onChange={(e) => setReceiver(e.target.value)}
      />

      <input
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button onClick={sendGaslessERC20}>
        Send Gasless ERC20
      </button>
    </div>
  );
}

export default GaslessERC20;
