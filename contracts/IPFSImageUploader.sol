// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract IPFSImageUploader{
    string ipfsHash;

    event IPFSHash(string _hash);

    function set(string memory x) public {
        ipfsHash = x;
        emit IPFSHash(x);
    }
    function get() public view returns(string memory) {
        return ipfsHash;
    }
}