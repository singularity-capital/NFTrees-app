// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
//import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


/* Contract for NFtrees */

contract NFTree is Ownable, ERC721URIStorage{
    uint256 tokenId;
    address purchaseContract;

    constructor() ERC721('NFTree', 'TREE')
    {
        tokenId = 1;
    }
    
    function setPurchaseContract(address _purchaseContract) external onlyOwner{
        purchaseContract = _purchaseContract;
    }
    
    function getPurchaseContract() external view returns(address){
        return(purchaseContract);
    }

    function buyNFTree(address _recipient, string memory _tokenHash) external {
        require(msg.sender == purchaseContract, 'Only purchase contract can call buyNFTree');
        
        _safeMint(_recipient, tokenId);
        _setTokenURI(tokenId, _tokenHash);
        tokenId = tokenId + 1;
    }

    function tokensOfOwner(address _owner) external view returns(uint256[] memory) {
        uint256 tokenCount = balanceOf(_owner);

        if (tokenCount == 0) {
            // Return an empty array
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](tokenCount);
            uint256 totalNFTrees = tokenId - 1;
            uint256 resultIndex = 0;

            // We count on the fact that all cats have IDs starting at 1 and increasing
            // sequentially up to the totalCat count.
            uint256 NFTreeId;

            for (NFTreeId = 1; NFTreeId <= totalNFTrees; NFTreeId++) {
                if (ownerOf(NFTreeId) == _owner) {
                    result[resultIndex] = NFTreeId;
                    resultIndex++;
                }
            }

            return result;
        }

    }

    /*function tokensOfOwner(address _owner) external view returns(uint256[] memory) {
        uint256 tokenCount = balanceOf(_owner);

        if (tokenCount == 0) {
            // Return an empty array
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](tokenCount);
            uint256 resultIndex = 0;

            for (uint256 id = 1; idd <= tokenCount; id++) {
                
            }

            return result;
        }

    }
*/
    function getNextTokenId() external view returns(uint256){
        return(tokenId);
    }

}