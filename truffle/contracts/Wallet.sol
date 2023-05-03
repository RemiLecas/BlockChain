// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Wallet {
    address payable public owner;
    uint256 balance;

    constructor() {
        // Permet d'avoir le owner du compte
        owner = payable(msg.sender);
    }

    function getBalance() public view returns (uint256) {
        return msg.sender.balance;
    }
}
