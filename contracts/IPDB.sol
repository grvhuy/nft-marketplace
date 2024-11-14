// SPDX-License-Identifier: MIT

// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract IPDB is Ownable {
    string private dbState;

    event dbUpdated(string newCid);

    constructor() Ownable(msg.sender) {}

    function update(string memory cid) public onlyOwner {
        dbState = cid;
        emit dbUpdated(cid);
    }

    function getState() public view returns (string memory) {
        return dbState;
    }
}