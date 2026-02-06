import { ethers } from "ethers";
import forwarderABI from "../abi/Forwarder.json";
import nftABI from "../abi/TestNFT.json";
import { useState } from "react";

const FORWARDER_ADDRESS = process.env.REACT_APP_FORWARDER_ADDRESS;
const NFT_ADDRESS = process.env.REACT_APP_NFT_ADDRESS;

function GaslessERC721() {
  const [receiver, setReceiver] = useState("");
  const [tokenId, setTokenId] = useState("");

  const sendGaslessNFT = async () => {
    try {
      if (!ethers.isAddress(receiver)) {
        alert("Invalid receiver address");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      const nftInterface = new ethers.Interface(nftABI);

      const data = nftInterface.encodeFunctionData(
        "safeTransferFrom(address,address,uint256)",
        [userAddress, receiver, tokenId]
      );

      const forwarder = new ethers.Contract(
        FORWARDER_ADDRESS,
        forwarderABI,
        provider
      );

      const nonce = await forwarder.nonces(userAddress);

      const request = {
        from: userAddress,
        to: NFT_ADDRESS,
        value: 0,
        gas: 150000,
        nonce,
        data
      };

      // ✅ Correct ABI encoding
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

      alert("✅ Gasless NFT Transfer Successful");

    } catch (err) {
      console.error(err);
      alert("❌ NFT Transaction Failed");
    }
  };

  return (
    <div>
      <h2>Gasless NFT Transfer</h2>

      <input
        placeholder="Receiver Address"
        value={receiver}
        onChange={(e) => setReceiver(e.target.value)}
      />

      <input
        placeholder="Token ID"
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)}
      />

      <button onClick={sendGaslessNFT}>
        Send Gasless NFT
      </button>
    </div>
  );
}

export default GaslessERC721;
