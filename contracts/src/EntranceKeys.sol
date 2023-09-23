// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ERC721} from "openzeppelin/token/ERC721/ERC721.sol";

contract EntranceKeys is ERC721 {
    uint256 count;

    struct Key {
        address safe;
        uint256 expiration;
    }

    mapping(uint256 => Key) public keys;

    constructor() ERC721("EntranceKeys", "KEY") {
        count = 0;
    }

    function mint(address safe, uint256 expiration, address to) external {
        require(msg.sender == safe, "EntranceKeys: only safe can mint");

        _safeMint(to, count);
        keys[count] = Key(safe, expiration);
        count++;
    }

    function burn(uint256 tokenId) external {
        require(
            msg.sender == keys[tokenId].safe,
            "EntranceKeys: only safe can burn"
        );

        _burn(tokenId);
        delete keys[tokenId];
    }
}
