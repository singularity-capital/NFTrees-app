// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract USDT is ERC20{

    constructor() ERC20('USDT', 'USDT') {
    }

    function mint(address myaddress) public payable{
        _mint(myaddress, 1000 * 10**18);
    }
}