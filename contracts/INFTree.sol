// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
//import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";

interface INFTree is IERC721{
    
    /**
     * @dev Updates the purchase contract address
     *
     */
    function setPurchaseContract(address _purchaseContract) external;
    
    /**
     * @dev 
     * 
     * returns current purchase contract address
     *
     */
    function getPurchaseContract() external view returns(address);
    
     /**
     * @dev Mints NFTree to 'recipient' and sets the token uri to 'tokenHash' 
     * 
     */
    function buyNFTree(address _recipient, string memory _tokenHash) external;
    
    /**
     * @dev Fetches the token ids of '_owner'
     *
     * Returns returns a list of token ids
     *
     */
    function tokenOfOwner(address _owner) external view returns (uint256[] memory);
    
    /**
     * @dev
     *
     * Returns the next token id to be minted
     *
     */
    function getNextTokenId() external view returns (uint256);
    
}