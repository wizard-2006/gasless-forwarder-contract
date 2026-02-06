// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Forwarder {

    struct ForwardRequest {
        address from;
        address to;
        uint256 value;
        uint256 gas;
        uint256 nonce;
        bytes data;
    }

    mapping(address => uint256) public nonces;

    function getMessageHash(
        ForwardRequest calldata req
    ) internal pure returns (bytes32) {
        return keccak256(
            abi.encode(
                req.from,
                req.to,
                req.value,
                req.gas,
                req.nonce,
                keccak256(req.data)
            )
        );
    }

    function getEthSignedMessageHash(
        bytes32 messageHash
    ) internal pure returns (bytes32) {
        return keccak256(
            abi.encodePacked(
                "\x19Ethereum Signed Message:\n32",
                messageHash
            )
        );
    }

    function recoverSigner(
        bytes32 ethSignedMessageHash,
        bytes calldata signature
    ) internal pure returns (address) {
        require(signature.length == 65, "Invalid signature length");

        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly {
            r := calldataload(signature.offset)
            s := calldataload(add(signature.offset, 32))
            v := byte(0, calldataload(add(signature.offset, 64)))
        }

        return ecrecover(ethSignedMessageHash, v, r, s);
    }

    function verify(
        ForwardRequest calldata req,
        bytes calldata signature
    ) public view returns (bool) {
        bytes32 messageHash = getMessageHash(req);
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);
        return recoverSigner(ethSignedMessageHash, signature) == req.from;
    }

    function execute(
        ForwardRequest calldata req,
        bytes calldata signature
    ) external payable {
        require(verify(req, signature), "Invalid signature");
        require(nonces[req.from] == req.nonce, "Invalid nonce");

        nonces[req.from]++;

        (bool success, ) = req.to.call{gas: req.gas, value: req.value}(
            req.data
        );

        require(success, "Forwarded call failed");
    }
}
