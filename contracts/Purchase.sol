// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "./INFTree.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


/* Contract for NFtrees */

contract Purchase is Ownable{
    mapping(string => IERC20) coins;
    mapping(uint256 => string) coinNames;
    uint256 coinCount;
    address offrampWallet;
    mapping(uint256 => string) tokenHash;
    uint256 totalOffset;
    mapping(uint256 => bool) levels;
    INFTree nftree;

    constructor()
    {
        offrampWallet = 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2;
        totalOffset = 0;
        coinCount = 0;
        levels[1] = true;
        levels[10] = true;
        levels[100] = true;
        levels[1000] = true;
        levels[10000] = true;
    }
    
    function setNFTreeContract(address _nftreeContract) external{
        nftree = INFTree(_nftreeContract);
    }

    function getNFTreeContract() external view returns(INFTree){
        return(nftree);
    }

    function addToken(address _address, string memory _coin) external onlyOwner{
        coins[_coin] = IERC20(_address);
        coinNames[coinCount] = _coin;
        coinCount = coinCount + 1;
    }
    
    function setOfframpWallet(address _address) external onlyOwner{
        offrampWallet = _address;
    }
    
    function getOfframpWallet() external view onlyOwner returns(address){
        return(offrampWallet);
    }
    
    function setTokenHash(uint256 _level, string memory _hash) public onlyOwner{
        tokenHash[_level] = _hash;
    }
    
    function getTokenHash(uint256 _level) external view onlyOwner returns(string memory){
        return(tokenHash[_level]);
    }
    
    function getTotalOffset() external view returns(uint256){
        return(totalOffset);
    }
    
    function updateLevel(uint256 _level, bool value) public onlyOwner{
        levels[_level] = value;
    }
    
    function getCoins() external view returns(string[] memory){
        string[] memory coinList = new string[](coinCount);
        for(uint256 i = 0; i < coinCount; i++){
            coinList[i] = coinNames[i];
        }
        return(coinList);
    }

    function buyNFTree(uint256 _numCredits, uint256 _amount, string memory _coin) external {
        require(msg.sender != address(0) && msg.sender != address(this), 'Sending from zero address');
        require(levels[_numCredits] == true, 'Not a valid level');
        require(coins[_coin].balanceOf(msg.sender) >= _amount, 'Not enough balance');
        require(_amount >= _numCredits * 10 * (10 ** 18), 'Not enough value');
        require(coins[_coin].allowance(msg.sender, address(this)) >= _amount, 'Not enough allowance');
        
        // transfer tokens
        coins[_coin].transferFrom(msg.sender, offrampWallet, _amount);
        
        nftree.buyNFTree(msg.sender, tokenHash[_numCredits]);
        
        // add to total carbon offset log
        totalOffset = totalOffset + _numCredits;
    }
    
}
