// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SpotifyCoin is ERC20, Ownable {
    constructor() ERC20("SpotifyCoin", "SC") {}

    function mint(uint256 amount) public payable {
        require(msg.value == amount*0.001 ether, "invalid amount of ether");
        _mint(msg.sender, amount*1 ether);
    }
    receive() external payable {}
    fallback() external payable {}
}