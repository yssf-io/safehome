// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ERC20} from "openzeppelin/token/ERC20/ERC20.sol";
import {ERC721} from "openzeppelin/token/ERC721/ERC721.sol";
import {EntranceKeys} from "./EntranceKeys.sol";

contract RentalAgreements {
    uint256 count;
    EntranceKeys constant entrance =
        EntranceKeys(0x031B09A855f48EBaec2fb743a61d2629A69F02C1);

    struct Agreement {
        address safe;
        uint256 startTimestamp;
        uint256 endTimestamp;
        address token;
        uint256 amount;
        address requested;
        bool approved;
    }

    mapping(uint256 => Agreement) public agreements;

    constructor() {
        count = 0;
    }

    function propose(
        address safe,
        uint256 startTimestamp,
        uint256 endTimestamp,
        address token,
        uint256 amount
    ) external {
        require(
            msg.sender == safe,
            "EntranceKeys: only safe can propose an agreement for itself"
        );

        agreements[count] = Agreement(
            safe,
            startTimestamp,
            endTimestamp,
            token,
            amount,
            address(0),
            false
        );
        count++;
    }

    function request(uint256 id) external {
        ERC20(agreements[id].token).transferFrom(
            msg.sender,
            address(this),
            agreements[id].amount
        );
        agreements[id].requested = msg.sender;
    }

    function response(uint256 id, bool accept) external {
        require(
            msg.sender == agreements[id].safe,
            "EntranceKeys: only safe can accept for itself"
        );

        agreements[id].approved = accept;
        address requester = agreements[id].requested;

        if (accept) {
            ERC20(agreements[id].token).transfer(
                agreements[id].safe,
                agreements[id].amount
            );

            entrance.mint(agreements[id].safe, 0, requester);
        } else {
            agreements[id].requested = address(0);
            ERC20(agreements[id].token).transfer(
                requester,
                agreements[id].amount
            );
        }
    }
}
